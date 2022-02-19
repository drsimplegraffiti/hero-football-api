var axios = require("axios").default;

var options = {
  method: "GET",
  url: "https://api-football-v1.p.rapidapi.com/v3/predictions",
  params: { fixture: "198772" },
  headers: {
    "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    "x-rapidapi-key": "43e8d3d214msh16345032f1bca9dp1ad457jsn6ab9436ed602",
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
