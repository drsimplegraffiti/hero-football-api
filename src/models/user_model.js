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
      // required: [true, "Please enter your valid address..."],
    },
    ageRange: {
      type: String,
      // required: [true, "Please enter your age..."],
    },
    number: {
      type: String,
      // required: [true, "Please enter your phone number..."],
    },
  },
  { timestamps: true }
);

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      number: this.number,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
  return token;
};

module.exports.User = mongoose.model("User", userSchema);
