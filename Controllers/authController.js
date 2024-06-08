const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const logger = require("../utils/logger");
const { token } = require("morgan");
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
