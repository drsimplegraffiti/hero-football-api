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
    // let onMatches = getMatches.filter(
    //   (match) => match.matchDate < new Date() && match.duration < 120
    // );
    let onMatches = await getMatches.filter(
      (match) => match.isLiveStatus === "1" // if i change the live status to 0
    );
    console.log(onMatches);

    let matchesNotStartedYet = getMatches.filter(
      (match) => match.matchDate > new Date()
    );
    const dataInfo = {
      onMatches,
      matchesNotStartedYet,
    };
    return successResMsg(res, 200, dataInfo);
  } catch (error) {
    console.log(error);
    errorResMsg(res, 500, "Server Error");
  }
};

const singleMatch = async (req, res) => {
  try {
    const getSingleMatch = await Matches.findById(req.params.id);
    const dataInfo = {
      getSingleMatch,
    };
    return successResMsg(res, 200, dataInfo);
  } catch (error) {
    console.log(error);
    errorResMsg(res, 500, "Server Error");
  }
};
module.exports = { getAllMatches, onGoingMatches, singleMatch };
