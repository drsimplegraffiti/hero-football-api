const mongoose = require("mongoose");
const { Schema } = mongoose;

const scoreSchema = Schema(
  {
    prediction: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Prediction",
    },
    fullScore: {
      type: Number,
      required: true,
    },
    totoScore: {
      type: Number,
      required: true,
    },
    goalBonus: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Score", scoreSchema);
