const Match = require("../models/match_model");
var axios = require("axios").default;

const baseUrl = "https://api.betting-api.com/1xbet/football/line/all";
var options = {
  method: "GET",
  url: baseUrl,
  headers: {
    Authorization:
      "8e5d9d2beb4c47a7b799ddf3077af7e98d86f429856b4c47ad1909f3f0d403ea",
  },
};

const array = ["Abia Warriors", "Heartland", "Enyimba FC", "Enugu Rangers FC"];
const getMatches = async () => {
  const fetchData = await axios.request(options);
  const response = await fetchData.data;
  const fixtures = await response
    .filter(
      (fixture) =>
        array.includes(fixture.team1) || array.includes(fixture.team2)

      // fixture.team1 === "Abia Warriors" ||
      // fixture.team2 === "Abia Warriors" ||
      // fixture.team1 === "Heartland" ||
      // fixture.team2 === "Heartland" ||
      // fixture.team1 === "Enyimba FC" ||
      // fixture.team2 === "Enyimba FC" ||
      // fixture.team1 === "Enugu Rangers FC" ||
      // fixture.team2 === "Enugu Rangers FC"
    )
    .map((fixture) => {
      return {
        matchId: fixture.id,
        homeTeamId: fixture.team1_id,
        homeTeamName: fixture.team1,
        goalsHomeTeam: fixture.score1,
        awayTeamId: fixture.team2_id,
        awayTeamName: fixture.team2,
        goalsAwayTeam: fixture.score2,
        eventTimeStamp: fixture.date_start,
        country: fixture.country,
        isLiveStatus: fixture.isLive,
        leagueId: fixture.league.league_id,
        country_id: fixture.league.country_id,
      };
    });
  const savedFixtures = Match.create(fixtures);
};

exports.getMatches = getMatches;
// module.exports = getMatches;
