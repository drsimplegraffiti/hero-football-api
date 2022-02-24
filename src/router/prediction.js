const { Router } = require("express");
const Prediction = require("../models/predictions_model");
const Match = require("../models/match_model");
const User = require("../models/user_model");
const { errorResMsg, successResMsg } = require("../utils/response");
const { isAuth } = require("../middleware/auth");
const { weekNumber } = require("weeknumber");

const router = new Router();

// Create prediction
router.post("/", isAuth, async (req, res) => {
  try {
    const id = req.user.id;
    console.log(id);
    //check user
    if (!id) {
      return errorResMsg(res, 401, "Unauthorized access");
    }

    const { predGoalsHomeTeam, predGoalsAwayTeam, scoreId, matchId } = req.body;
    console.log(predGoalsHomeTeam, predGoalsAwayTeam, matchId);
    // if (!matchId || !predGoalsHomeTeam || !predGoalsAwayTeam) {
    //   return errorResMsg(res, 400, "Please provide everything");
    // }
    const verifyMatchId = await Match.findOne({ _id: matchId });
    if (!verifyMatchId) {
      return errorResMsg(res, 404, "Invalid match ID provided");
    }

    // if (verifyMatchId.matchDate < new Date()) {
    //   return errorResMsg(res, 409, "Match started already....");
    // }
    const newPrediction = await Prediction.create({
      predGoalsHomeTeam,
      predGoalsAwayTeam,
      userId: id,
      week: weekNumber(verifyMatchId.matchDate),
      matchId,
    });
    const dataInfo = {
      newPrediction,
    };
    return successResMsg(res, 201, dataInfo);
  } catch (error) {
    console.log(error);
    return errorResMsg(res, 500, "Server error");
  }
});

// Update prediction
router.patch("/prediction/:predictionId", async (req, res, next) => {
  const { predictionId } = req.params;
  console.log("What is my predictionId?", predictionId);
  try {
    const predictionToUpdate = await Prediction.findById(predictionId);
    //Fetch prediction info from API await axios.get predictionId
    if (!predictionToUpdate) {
      res.status(404).send("Prediction not found");
    } else {
      const updatedPrediction = await predictionToUpdate.update(req.body);
      res.json(updatedPrediction);
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
