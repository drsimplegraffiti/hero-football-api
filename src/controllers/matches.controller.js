const Matches = require("../models/match_model");
const { successResMsg, errorResMsg } = require("../utils/response");

const getAllMatches = async (req, res) => {
  try {
    const getMatches = await Matches.find({});
    return successResMsg(res, 200, getMatches);
  } catch (error) {
    console.log(error);
    errorResMsg(res, 500, "Server Error");
  }
};

const onGoingMatches = async (req, res) => {
  try {
    const getMatches = await Matches.find({});
    let onMatches = getMatches.filter(
      (match) => match.matchDate < new Date() && match.duration < 120
    );
    const dataInfo = {
      onMatches,
    };
    return successResMsg(res, 200, dataInfo);
  } catch (error) {
    console.log(error);
    errorResMsg(res, 500, "Server Error");
  }
};
module.exports = { getAllMatches, onGoingMatches };
