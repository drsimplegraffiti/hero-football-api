const { Router } = require("express");
const Prediction = require("../models/predictions_model");
const Match = require("../models/match_model");
const User = require("../models/user_model");
const { errorResMsg, successResMsg } = require("../utils/response");
const { isAuth } = require("../middleware/auth");

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

    const { predGoalsHomeTeam, predGoalsAwayTeam, userId, scoreId, matchId } =
      req.body;
    if (
      predGoalsHomeTeam === "" ||
      predGoalsAwayTeam === "" ||
      matchId === ""
    ) {
      return errorResMsg(res, 400, "Please provide everything");
    }
    const newPrediction = await Prediction.create({
      predGoalsHomeTeam,
      predGoalsAwayTeam,
      userId: id,
      // scoreId,
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
