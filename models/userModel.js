const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    minLenght: [8, "password should be atleast 8 character"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "user must have a password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
});

userScema.pre("save", async function (next) {
  // runs only if password is modified
  if (!this.isModified("password")) return next;

  // hashing the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete passwordConfirm field
  this.passwordConfirm = undefined;
});

// making a model of the schema

const userModel = mongoose.model("User", userScema);

module.exports = userModel;
