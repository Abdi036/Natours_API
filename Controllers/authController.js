const userModel = require("../models/userModel");
const { validationResult } = require("express-validator");
const logger = require("../utils/logger");

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

    const newUser = await userModel.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
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
