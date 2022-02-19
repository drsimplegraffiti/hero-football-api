const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    matchId: {
      type: Number,
    },
    country: {
      type: String,
    },
    homeTeamId: {
      type: Number,
      required: true,
    },
    homeTeamName: {
      type: String,
      required: true,
    },
    homeTeamLogo: {
      type: String,
    },
    goalsHomeTeam: {
      type: Number,
    },
    awayTeamId: {
      type: Number,
      required: [true, "Please enter awayId..."],
    },
    awayTeamName: {
      type: String,
      required: [true, "Please enter awayTeamName..."],
    },
    awayTeamLogo: {
      type: String,
    },
    goalsAwayTeam: {
      type: Number,
    },
    eventTimeStamp: {
      type: Date,
    },
    leagueId: {
      type: Number,
    },
    round: {
      type: String,
    },
    country_id: {
      type: Number,
    },
    isLiveStatus: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);
