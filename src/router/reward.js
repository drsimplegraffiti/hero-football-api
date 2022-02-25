const { Router } = require("express");
const { isAuth } = require("../middleware/auth");
const { errorResMsg, successResMsg } = require("../utils/response");
const Reward = require("../models/reward_model");
const router = new Router();

router.get("/rewards", isAuth, async (req, res) => {
  try {
    const id = req.user.id;
    //check user
    if (!id) {
      return errorResMsg(res, 401, "Unauthorized access");
    }
    const rewards = await Reward.find({ userId: id });
    return successResMsg(res, 200, rewards);
  } catch (error) {
    console.log(error);
    return errorResMsg(res, 500, "Server error");
  }
});
module.export = router;
