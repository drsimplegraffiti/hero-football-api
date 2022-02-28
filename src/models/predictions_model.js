const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: "User",
    },
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
    },
    matchDate: {
      type: Date,
    },
    scoreId: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: "Score",
    },
    predGoalsHomeTeam: {
      type: Number,
      required: [true, "please enter a pred Goals Home team"],
    },
    predGoalsAwayTeam: {
      type: Number,
      required: [true, "Please enter a predefined goals away team"],
    },
    week: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prediction", predictionSchema);
