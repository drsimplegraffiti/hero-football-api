const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const validator = require("validator");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      index: true,
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
    userIndex: {
      type: Number,
    },
  },
  { timestamps: true }
);
userSchema.plugin(AutoIncrement, {
  inc_field: "userIndex",
});
module.exports.User = mongoose.model("User", userSchema);
