const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const logger = require("../utils/logger");
const sendEmail = require("../utils/email");

require("dotenv").config();

// reusable function for token
function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

// SIGNUP AUTHENTICATION
exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid input data",
        errors: errors.array(),
      });
    }

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          photo: newUser.photo,
        },
      },
    });
  } catch (error) {
    logger.error(`Error during user signup: ${error.message}`, { error });

    // Handle different types of errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((el) => el.message);
      res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors,
      });
    } else if (error.name === "MongoError" && error.code === 11000) {
      res.status(409).json({
        status: "fail",
        message: "Duplicate field value",
        error: error.keyValue,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "An unexpected error occurred",
      });
    }
  }
};

// LOGIN AUTHENTICATION
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //1) Validate email and password
    if (!email || !password) {
      return next(
        res.status(400).json({
          status: "fail",
          message: "Please provide email and password",
        })
      );
    }

    //2) Check if user exists in the database
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(
        res.status(401).json({
          status: "fail",
          message: "Incorrect email or password",
        })
      );
    }

    //3) Generate JWT
    const token = signToken(user._id);

    next(
      res.status(200).json({
        status: "success",
        token,
      })
    );
  } catch (error) {
    logger.error(`Error during user login: ${error.message}`, { error });

    // Handle any other errors
    next(
      res.status(500).json({
        status: "error",
        message: "Something went wrong",
      })
    );
  }
};

exports.protectMiddleware = async (req, res, next) => {
  try {
    //1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        res.status(401).json({
          status: "fail",
          message: "You are not logged in! Please login to get access",
        })
      );
    }

    //2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        res.status(401).json({
          status: "fail",
          message: "The user belonging to this token no longer exists.",
        })
      );
    }

    //4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        res.status(401).json({
          status: "fail",
          message: "User recently changed password! Please log in again.",
        })
      );
    }
    //5) Grant access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    logger.error(`Error during token verification: ${err.message}`, {
      error: err,
    });

    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

// Authorization
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          status: "fail",
          message: "You do not have permission to perform this action",
        });
      }
      next();
    } catch (err) {
      logger.error(`Error during role authorization: ${err.message}`, {
        error: err,
      });

      res.status(500).json({
        status: "error",
        message: "Something went wrong during role authorization",
      });
    }
  };
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // 1) Get user based on posted email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "There is no user with this email address.",
      });
    }

    // 2) Generate the random reset token
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Construct the reset URL
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      // 4) Send the reset token to the user's email
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10 minutes)",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      logger.error(`Error sending email: ${err.message}`, { error: err });

      return res.status(500).json({
        status: "error",
        message: "There was an error sending the email. Try again later!",
      });
    }
  } catch (err) {
    logger.error(`Error during forgot password: ${err.message}`, {
      error: err,
    });

    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Token is invalid or has expired",
      });
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Log the user in, send JWT
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    logger.error(`Error during password reset: ${err.message}`, { error: err });
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
