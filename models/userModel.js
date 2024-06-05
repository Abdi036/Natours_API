const mongoose = require("mongoose");
const validator = require("validator");

// creating user schema
const userScema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "user must have a name"],
    maxLenght: [50, "name sholdn't be this long"],
    minLenght: [5, "name sholdn't be this short"],
  },
  email: {
    type: String,
    required: [true, "user must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "user must have a password"],
    minLenght: [8, "password shoold be atleast 8 character"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "user must have a password"],
  },
});

// making a model of the schema

const userModel = mongoose.model("User", userScema);

module.exports = userModel;
