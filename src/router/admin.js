const { Router } = require("express");
const { User } = require("../models/user_model");
const { Admin } = require("../models/admin_model");
const Prediction = require("../models/predictions_model");
const { Points } = require("../models/points_model");
const Reward = require("../models/reward_model");
const { ADMIN_SECRET } = process.env;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = new Router();
const { errorResMsg, successResMsg } = require("../utils/response");
const { isAdminAuth } = require("../middleware/auth");

router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, number, role } = req.body;

    const existingAdmin = await Admin.findOne({
      email: email,
    });
    if (existingAdmin) return errorResMsg(res, 400, "Admin already registered");

    const saltPassword = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltPassword);

    const admin = new Admin({
      fullName,
      email,
      password: hashedPassword,
      number,
      role,
    });
    const createdAdmin = await admin.save();
    const token = await jwt.sign(
      {
        id: createdAdmin._id,
        email: createdAdmin.email,
      },
      ADMIN_SECRET,
      {
        expiresIn: "2h",
      }
    );

    const dataInfo = {
      message: "Verification link sent Successfully",
      creadtedAdmin: createdAdmin._id,
      token,
    };
    return successResMsg(res, 200, dataInfo);
  } catch (error) {
    console.log(error);
    return errorResMsg(res, 500, "something went wrong");
  }
});

//admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || admin === null) {
      return errorResMsg(res, 400, "this email does not exist");
    }
    if (admin.role !== "Admin") {
      return errorResMsg(res, 401, "Unauthorized");
    }
    const confirmPassword = await bcrypt.compare(password, admin.password);
    if (!confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "User password is incorrect",
      });
    }
    //create token
    const token = await jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        fullName: admin.fullName,
      },
      process.env.ADMIN_SECRET,
      {
        expiresIn: "2d",
      }
    );
    console.log(token);
    res.cookie("access-token", token);

    const dataInfo = {
      message: "Admin Login Successful",
      token: token,
      userId: admin._id,
    };
    return successResMsg(res, 200, dataInfo);
  } catch (error) {
    console.log(error);
    return errorResMsg(res, 500, "Something went wrong");
  }
});

router.get("/overview", isAdminAuth, async (req, res) => {
  try {
    const id = req.admin.id;
    //check user
    if (!id) {
      return errorResMsg(res, 401, "Unauthorized access");
    }
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
router.get("/users", isAdminAuth, async (req, res) => {
  try {
    const id = req.admin.id;
    //check user
    if (!id) {
      return errorResMsg(res, 401, "Unauthorized access");
    }
    const users = await User.find();
    const dataInfo = {
      users,
    };
    successResMsg(res, 200, dataInfo);
  } catch (error) {
    console.log(error);
    return errorResMsg(res, 500, "Something went wrong");
  }
});

// Get active users
router.get("/active/users", isAdminAuth, async (req, res) => {
  try {
    const id = req.admin.id;
    //check user
    if (!id) {
      return errorResMsg(res, 401, "Unauthorized access");
    }
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

router.get("/winners", isAdminAuth, async (req, res) => {
  try {
    const id = req.admin.id;
    //check user
    if (!id) {
      return errorResMsg(res, 401, "Unauthorized access");
    }
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

// Create reward
router.post("/rewards", isAdminAuth, async (req, res) => {
  try {
    const id = req.admin.id;
    //check user
    if (!id) {
      return errorResMsg(res, 401, "Unauthorized access");
    }
    const { userId, reward } = req.body;

    if (userId === "" || reward === "") {
      return errorResMsg(res, 400, "Bad request");
    }
    const rewards = new Reward({
      userId,
      reward,
    });
    const dataInfo = {
      userId,
      reward,
    };
    return successResMsg(res, 201, dataInfo);
  } catch (error) {
    console.log(error);
    return errorResMsg(res, 500, "Something went wrong");
  }
});

// Leader board
router.get("/leaderboard", isAdminAuth, async (req, res) => {
  try {
    const id = req.admin.id;
    //check user
    if (!id) {
      return errorResMsg(res, 401, "Unauthorized access");
    }
    let leaders = await Points.aggregate([
      { $match: {} },
      {
        $group: {
          _id: "$userId",
          points: { $sum: "$points" },
        },
      },
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
          points: 1, // 1 means show it
        },
      },
    ]).limit(100);
    const dataInfo = {
      leaders,
    };
    return successResMsg(res, 200, dataInfo);
  } catch (error) {
    console.log(error);
    return errorResMsg(res, 500, "Server error");
  }
});
module.exports = router;
