const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// creating user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
    maxLength: [50, "Name shouldn't be this long"],
    minLength: [5, "Name shouldn't be this short"],
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "User must have a password"],
    minLength: [8, "Password should be at least 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  // Runs only if password is modified
  if (!this.isModified("password")) return next();

  // Hashing the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// Method to compare password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

// Making a model of the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
