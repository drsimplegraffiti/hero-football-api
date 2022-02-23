const Match = require("../models/match_model");
var axios = require("axios").default;
const mongoose = require("mongoose");

const baseUrl =
  // "https://apiv3.apifootball.com/?action=get_countries&APIkey=ed2a9573227f81ca3da6755c16c77e093e37d5dc671ec360aef0e2a92734312b"; // country
  // "https://apiv3.apifootball.com/?action=get_leagues&country_id=85&APIkey=ed2a9573227f81ca3da6755c16c77e093e37d5dc671ec360aef0e2a92734312b"; // country id =85, league_id = 248;
  `https://apiv3.apifootball.com/?action=get_events&from=2022-02-23&to=2022-03-30&league_id=248&APIkey=${process.env.APIkey}`;
var options = {
  method: "GET",
  url: baseUrl,
};

const array = ["Abia Warriors", "Heartland", "Enyimba FC", "Enugu Rangers FC"];
const getMatches = async () => {
  const fetchData = await axios.request(options);
  const response = await fetchData.data;
  const fixtures = await response
    .filter(
      (fixture) =>
        array.includes(fixture.match_hometeam_name) ||
        array.includes(fixture.match_awayteam_name)
    )
    .map((fixture) => {
      return {
        matchId: fixture.match_id,
        homeTeamId: fixture.match_hometeam_id,
        homeTeamName: fixture.match_hometeam_name,
        goalsHomeTeam: fixture.match_hometeam_score,
        awayTeamId: fixture.match_awayteam_id,
        awayTeamName: fixture.match_awayteam_name,
        goalsAwayTeam: fixture.match_awayteam_score,
        matchDate: fixture.match_date,
        country: fixture.country_name,
        isLiveStatus: fixture.match_live,
        leagueId: fixture.league_id,
        country_id: fixture.country_id,
        team_home_badge: fixture.team_home_badge,
        team_away_badge: fixture.team_away_badge,
        league_logo: fixture.league_logo,
      };
    });
  const savedFixtures = Match.create(fixtures, {
    updateOnDuplicate: ["id"],
  });
  // console.log(fixtures);
};

exports.getMatches = getMatches;
