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

const getMatches = async () => {
  const fetchData = await axios.request(options);
  const response = await fetchData.data;
  const fixtures = await response.map((fixture) => {
    return {
      id: fixture.id,
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
  const filteredObj = await fixtures.filter((country) => {
    console.log(country.country);
  });
};

getMatches();
