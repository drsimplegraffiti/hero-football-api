const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  matchId: {
    type: Number,
    unique: true,
  },
  country: {
    type: String,
  },
  homeTeamId: {
    type: Number,
    // required: true,
  },
  homeTeamName: {
    type: String,
    // required: true,
  },
  homeTeamLogo: {
    type: String,
  },
  goalsHomeTeam: {
    type: Number,
  },
  awayTeamId: {
    type: Number,
    // required: [true, "Please enter awayId..."],
  },
  awayTeamName: {
    type: String,
    // required: [true, "Please enter awayTeamName..."],
  },
  awayTeamLogo: {
    type: String,
  },
  goalsAwayTeam: {
    type: Number,
  },
  leagueId: {
    type: String,
  },
  round: {
    type: String,
  },
  country_id: {
    type: String,
  },
  isLiveStatus: {
    type: String,
  },
  matchDate: {
    type: String,
  },
  team_home_badge: {
    type: String,
  },
  team_away_badge: {
    type: String,
  },
  league_logo: {
    type: String,
  },
});

module.exports = mongoose.model("Match", matchSchema);
