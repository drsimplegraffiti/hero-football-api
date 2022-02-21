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

module.exports = getAllMatches;
