const bcrypt = require("bcrypt");
const _ = require("lodash");
const axios = require("axios");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { successResMsg, errorResMsg } = require("../utils/response");
const sendEmail = require("../utils/emailSender");

const { User } = require("../models/user_model");
// const { Otp } = require("../models/otp_model");

const URL = "https://hero-clan-cans.vercel.app";

// @desc      SIGNUP
// @route     POST /api/user/signup
// @access    PUBLIC
module.exports.signUp = async (req, res) => {
  try {
    const {
      number,
      email,
      password,
      ageRange,
      location,
      fullName,
      emailToken,
      isVerified,
      userIndex,
    } = req.body;

    const existingUser = await User.findOne({
      email: email,
    });
    if (existingUser) return errorResMsg(res, 400, "User already registered");

    const saltPassword = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltPassword);

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      emailToken: crypto.randomBytes(64).toString("hex"),
      location,
      ageRange,
      number,
      isVerified,
      userIndex,
    });
    const createdUser = await user.save();
    await sendEmail({
      email: user.email,
      subject: "User registration ",
      // message: `${URL}/auth/email/verify/token=${user.emailToken}`,
      message: `
      <div style="background-color: #eeeeee;">
      <div style="max-width: 700px; height: 250px; margin: auto;">
        <img
          style="width: 100%; height: 100%; object-fit: cover;"
          src="https://res.cloudinary.com/ogeobubu/image/upload/v1645817302/koybnukvdsgso9wqord1.jpg"
          alt="hero"
        />
      </div>
      <div
        style="
          max-width: 600px;
          margin: auto;
          padding: 30px 20px;
          font-size: 110%;
        "
      >
        <p><strong>Dear</strong> User,</p>
        <p>
          Click <a href=${URL}/auth/email/verify/token=${user.emailToken}>here</a> to verify your League of Heroes
          Account.<br />
          <br />
          Cheers,
        </p>
      </div>

      <div style="max-width: 700px; height: 200px; margin: auto;">
        <img
          style="width: 100%; height: 100%; object-fit: cover;"
          src="https://res.cloudinary.com/ogeobubu/image/upload/v1645818137/sgcjpibpk1pvaoxma6gg.jpg"
          alt="hero"
        />
      </div>
    </div>`,
    });
    console.log(user.email);
    const dataInfo = {
      message: "Verification link sent Successfully",
      userId: user._id,
    };
    return successResMsg(res, 200, dataInfo);
  } catch (error) {
    console.log(error);
    errorResMsg(res, 500, `Server Error ${error}`);
  }
};

// @desc      LOGIN
// @route     POST /api/user/login
// @access    PUBLIC
module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user === null) {
      return errorResMsg(res, 400, "this email does not exist");
    }

    if (!user.isVerified) {
      return errorResMsg(
        res,
        401,
        "Unverified account: please check your email to verify your account "
      );
    }
    const confirmPassword = await bcrypt.compare(password, user.password);
    if (!confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "User password is incorrect",
      });
    }
    //create token
    const token = await jwt.sign(
      {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
      process.env.USER_SECRET,
      {
        expiresIn: "2d",
      }
    );
    console.log(token);
    const dataInfo = {
      message: "User Login Successful",
      token: token,
      userId: user._id,
    };
    return successResMsg(res, 200, dataInfo);
  } catch (error) {
    console.log(error);
    errorResMsg(res, 500, `Server error ${error}`);
  }
};

module.exports.Dashboard = async (req, res) => {
  try {
    const key = "test85g57";
    const countryId = "37";
    const countryName = "Nigeria";
    const league = await axios.get(`https://app.api.sportx.bet/leagues`);
    const country = await axios.get(
      `https://api.football-data-api.com/country-list?key=${key}&&name=${countryName}`
    );
    console.log(league.data);

    // const dataInfo = { result: league.data };
    // return successResMsg(res, 200, dataInfo);
  } catch (error) {
    console.log(error);
    errorResMsg(res, 500, `Server error ${error}`);
  }
};

// @desc      VERIFY MAIL
// @route     POST /api/user/auth/verify-email
// @access    PUBLIC
module.exports.verifyMail = async (req, res) => {
  try {
    const token = req.query.token;
    const user = await User.findOne({ emailToken: token });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: " User does not exist",
      });
    }

    user.emailToken = null;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      status: "success",
      message:
        "Success: Your email has been verified, please login to continue",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: error,
      message: "Something Went Wrong",
    });
  }
};
