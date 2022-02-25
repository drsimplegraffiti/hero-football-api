const Match = require("../models/match_model");
var axios = require("axios").default;
const mongoose = require("mongoose");

const startDate = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
const d = new Date(new Date().setDate(new Date().getDate() + 30));
const endDate = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

const baseUrl =
  // "https://apiv3.apifootball.com/?action=get_countries&APIkey="; // country
  // "https://apiv3.apifootball.com/?action=get_leagues&country_id=85&APIkey="; // country id =85, league_id = 248;
  `https://apiv3.apifootball.com/?action=get_events&from=${startDate}&to=${endDate}&league_id=248&APIkey=${process.env.APIkey}`;
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
        matchDate: `${fixture.match_date}T${fixture.match_time}Z`, // ensure UTC format
        duration: (
          (new Date().getTime() -
            new Date(
              `${fixture.match_date}T${fixture.match_time}Z`
            ).getTime()) /
          60000
        ).toFixed(0),
        country: fixture.country_name,
        isLiveStatus: fixture.match_live,
        leagueId: fixture.league_id,
        country_id: fixture.country_id,
        team_home_badge: fixture.team_home_badge,
        team_away_badge: fixture.team_away_badge,
        league_logo: fixture.league_logo,
      };
    });
  try {
    // const savedFixtures = await Match.create(fixtures);
    for (const fixture of fixtures) {
      const checkMatch = await Match.findOne({ matchId: fixture.matchId });
      if (checkMatch) {
        await Match.findOneAndUpdate({ matchId: checkMatch.matchId }, fixture);
        continue;
      }
      const newMatch = await new Match(fixture).save();
    }
  } catch (error) {
    // if (error.message.includes("duplicate key error")) {
    // console.log("tttttttttttt", error.message.split("{")[1]);
    console.log(error);
    // }
  }
  // const savedFixtures = await Match.create(fixtures);
};

exports.getMatches = getMatches;
