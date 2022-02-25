const { Router } = require("express");
const Prediction = require("../models/predictions_model");
const Match = require("../models/match_model");
const User = require("../models/user_model");
const { Points } = require("../models/points_model");
const { errorResMsg, successResMsg } = require("../utils/response");
const { isAuth } = require("../middleware/auth");
const { weekNumber } = require("weeknumber");

const router = new Router();

// Create prediction
router.post("/", isAuth, async (req, res) => {
  try {
    const id = req.user.id;
    //check user
    if (!id) {
      return errorResMsg(res, 401, "Unauthorized access");
    }

    const { predGoalsHomeTeam, predGoalsAwayTeam, scoreId, matchId } = req.body;
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

    const prediction = await Prediction.findOne({ matchId, userId: id });
    if (prediction) {
      const updatedPrediction = await Prediction.findOneAndUpdate(
        { matchId, userId: id },
        {
          predGoalsAwayTeam,
          predGoalsAwayTeam,
        },
        {
          new: true,
        }
      );

      const dataInfo = {
        prediction: updatedPrediction,
      };
      return successResMsg(res, 200, dataInfo);
    }
    const newPrediction = await Prediction.create({
      predGoalsHomeTeam,
      predGoalsAwayTeam,
      userId: id,
      week: weekNumber(verifyMatchId.matchDate),
      matchId,
    });
    const dataInfo = {
      prediction: newPrediction,
    };
    return successResMsg(res, 201, dataInfo);
  } catch (error) {
    console.log(error);
    return errorResMsg(res, 500, "Server error");
  }
});

// Get all prediction points
router.get("/points", isAuth, async (req, res) => {
  try {
    const id = req.user.id;
    //check user
    if (!id) {
      return errorResMsg(res, 401, "Unauthorized access");
    }
    {
      let i = 1; //weekNumber(new Date());
      let d = new Date().getFullYear();
      for (i; i < 54; i++) {
        const predictions = await Prediction.find({
          userId: id,
          week: i,
          updatedAt: {
            $gt: new Date(d - 1, 11, 31),
            $lt: new Date(d + 1, 0, 1),
          },
        });
        const correctPred = [];
        for (let prediction of predictions) {
          let match = await Match.findOne({ _id: prediction.matchId });
          let home = match.goalsHomeTeam == prediction.predGoalsHomeTeam;
          let away = match.goalsAwayTeam == prediction.predGoalsAwayTeam;
          if (home && away) {
            correctPred.push(3);
          }
        }
        let totalPoint = correctPred.reduce((a, b) => {
          return a + b;
        }, 0);
        let point = await Points.findOne({
          userId: id,
          week: i,
        });
        if (point) {
          await Points.findOneAndUpdate(
            {
              userId: id,
              week: i,
            },
            { points: totalPoint }
          );
          continue;
        }
        await new Points({
          userId: id,
          week: i,
          points: totalPoint,
        }).save();
      }
    }
    const points = await Points.find({ userId: id }).sort({ week: 1 });
    const dataInfo = {
      points,
    };
    return successResMsg(res, 200, dataInfo);
  } catch (error) {
    console.log(error);
    return errorResMsg(res, 500, "Server error");
  }
});

// Leader board
router.get("/leaderboard", async (req, res) => {
  try {
    let leaders = await Points.aggregate([
      { $match: {} },
      {
        $group: {
          _id: "$userId",
          points: { $sum: "$points" },
        },
      },
    ]).limit(100);
    return successResMsg(res, 200, leaders);
  } catch (error) {
    console.log(error);
    return errorResMsg(res, 500, "Server error");
  }
});

module.exports = router;
