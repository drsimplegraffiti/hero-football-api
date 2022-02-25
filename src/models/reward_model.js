const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reward: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reward", rewardSchema);
