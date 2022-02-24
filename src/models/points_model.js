const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const validator = require("validator");

const pointSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    points: {
      type: Number,
    },
    week: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports.Points = mongoose.model("Points", pointSchema);
