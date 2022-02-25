const { Router } = require("express");
const { User } = require("../models/user_model");
const Prediction = require("../models/predictions_model");
const Reward = require("../models/reward_model");
const router = new Router();
const { errorResMsg, successResMsg } = require("../utils/response");

router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    const existingUser = await Admin.findOne({
      email: email,
    });
    if (existingUser) return errorResMsg(res, 400, "Admin already registered");

    const saltPassword = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltPassword);

    const admin = new Admin({
      fullName,
      email,
      password: hashedPassword,
      location,
      number,
      isVerified,
    });
    const createdUser = await user.save();
    await sendEmail({
      email: user.email,
      subject: "User registration ",
      message: `${URL}/auth/email/verify/token=${user.emailToken}`,
    });
    console.log(user.email);
    const dataInfo = {
      message: "Verification link sent Successfully",
    };
    return successResMsg(res, 200, dataInfo);
  } catch (error) {
    return errorResMsg(res, 500, "Something went wrong");
  }
});

router.get("/overview", async (req, res) => {
  try {
    let leaderBoard = 100;
    let users = await User.countDocuments();
    let [activeUsers] = await Prediction.aggregate([
      { $match: {} },
      { $group: { _id: "$userId" } },
      {
        $count: "total",
      },
    ]);
    activeUsers = activeUsers && activeUsers.total ? activeUsers.total : 0;
    let [winners] = await Reward.aggregate([
      { $match: {} },
      { $group: { _id: "$userId" } },
      {
        $count: "total",
      },
    ]);
    winners = winners && winners.total ? winners.total : 0;
    const dataInfo = {
      leaderBoard,
      users,
      activeUsers,
      winners,
    };
    return successResMsg(res, 200, dataInfo);
  } catch (error) {
    console.log(error);
    return errorResMsg(res, 500, "Something went wrong");
  }
});

//get all users --->admin
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    successResMsg(res, 200, users);
  } catch (error) {
    console.log(error);
    return errorResMsg(res, 500, "Something went wrong");
  }
});

// Get active users
router.get("/active/users", async (req, res) => {
  try {
    let activeUsers = await Prediction.aggregate([
      { $match: {} },
      { $group: { _id: "$userId" } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$user", 0] }, "$$ROOT"],
          },
        },
      },
      {
        $project: {
          email: 1,
          fullName: 1,
        },
      },
    ]);
    const dataInfo = {
      activeUsers,
    };
    return successResMsg(res, 200, dataInfo);
  } catch (error) {
    console.log(error);
    return errorResMsg(res, 500, "Something went wrong");
  }
});

router.get("/winners", async (req, res) => {
  try {
    let winners = await Reward.aggregate([
      { $match: {} },
      { $group: { _id: "$userId" } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$user", 0] }, "$$ROOT"],
          },
        },
      },
      {
        $project: {
          email: 1,
          fullName: 1,
        },
      },
    ]);
    const dataInfo = {
      winners,
    };
    return successResMsg(res, 200, dataInfo);
  } catch (error) {
    console.log(error);
    return errorResMsg(res, 500, "Something went wrong");
  }
});
module.exports = router;
