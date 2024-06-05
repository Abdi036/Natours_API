const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const logger = require("../utils/logger");

require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    // Check for validation errors if you're using a validation middleware
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

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

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
