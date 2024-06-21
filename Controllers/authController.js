const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { validationResult } = require("express-validator");

const userModel = require("../models/userModel");
const logger = require("../utils/logger");
const User = require("../models/userModel");

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

    const newUser = await userModel.create({
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

    // Validate email and password
    if (!email || !password) {
      return next(
        res.status(400).json({
          status: "fail",
          message: "Please provide email and password",
        })
      );
    }

    // Check if user exists in the database
    const user = await userModel.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(
        res.status(401).json({
          status: "fail",
          message: "Incorrect email or password",
        })
      );
    }

    // Generate JWT
    const token = signToken(user._id);

    // Send response with token
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    logger.error(`Error during user login: ${error.message}`, { error });

    // Handle any other errors
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

exports.protectMiddleware = async (req, res, next) => {
  try {
    // Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // console.log(`Here is Your Token :${token}`);
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access",
      });
    }

    // Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await userModel.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists.",
      });
    }

    // Check if user changed password after the token was issued
    // iat => issued at
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: "fail",
        message: "User recently changed password! Please log in again.",
      });
    }

    // Grant access to protected route
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
//////////////////////////////////////////////////////
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

//////////////////////////////////////////////////

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
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    
    // Generate the random reset token
    // send it to the user's email
  } catch (err) {
    console.log(err);
  }
  next();
};
