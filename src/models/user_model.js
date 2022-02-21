const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const validator = require("validator");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      // required: [true, "Please enter your name..."],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 255,
    },
    location: {
      type: String,
    },
    ageRange: {
      type: String,
    },
    emailToken: {
      type: String,
    },
    number: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports.User = mongoose.model("User", userSchema);
