const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const validator = require("validator");

const adminSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please enter your name..."],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 255,
    },
  },
  { timestamps: true }
);

module.exports.Admin = mongoose.model("Admin", adminSchema);
