const { weekNumber } = require("weeknumber");

console.log(weekNumber(new Date(2016, 0, 3, 12))); // Sun
//> 53
console.log(weekNumber(new Date(2022, 2, 1))); // Mon
//> 1
