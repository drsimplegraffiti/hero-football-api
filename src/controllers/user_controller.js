const bcrypt = require("bcrypt");
const _ = require("lodash");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { successResMsg, errorResMsg } = require("../utils/response");
const sendEmail = require("../utils/emailSender");

const { User } = require("../models/user_model");
const { Otp } = require("../models/otp_model");

// @desc SIGNUP
module.exports.signUp = async (req, res) => {
  try {
    const {
      number,
      email,
      password,
      ageRange,
      location,
      fullName,
      isVerified,
    } = req.body;

    const existingUser = await User.findOne({
      number: number,
      email: email,
    });
    if (existingUser) return errorResMsg(res, 400, "User already registered");
    const OTP = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    console.log(OTP);

    const otp = new Otp({ number: number, otp: OTP });
    const salt = await bcrypt.genSalt(10);
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const saltPassword = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltPassword);

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      location,
      ageRange,
      number,
      isVerified,
    });
    const createdUser = await user.save();
    const result = await otp.save();
    await sendEmail({
      email: user.email,
      subject: "User registration ",
      message: `<p>You just registered please verify with  your otp...</p>
      <h1>Your Otp Number: ${OTP}</h1>`,
    });
    console.log(user.email);
    const dataInfo = {
      message: "Otp sent Successfully",
      result,
      // createdUser,
    };
    return successResMsg(res, 200, dataInfo);
  } catch (error) {
    console.log(error);
    errorResMsg(res, 500, `Server Error ${error}`);
  }
};

// @desc VERIFY OTP
module.exports.verifyOtp = async (req, res) => {
  try {
    const otpHolder = await Otp.find({
      number: req.body.number,
    });
    if (otpHolder.length === 0) {
      return errorResMsg(res, 400, "You used an expired Otp");
    }
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
    if (rightOtpFind.number === req.body.number && validUser) {
      const user = await User.findOne({ number: req.body.number });
      const token = user.generateJWT();
      user.isVerified = true;
      await user.save();
      const OTPDelete = await Otp.deleteMany({
        number: rightOtpFind.number,
      });
      const dataInfo = {
        message: "User Registration Completed and Successful",
        token: token,
      };

      return successResMsg(res, 200, dataInfo);
    } else {
      return errorResMsg(res, 400, "Otp was wrong");
    }
  } catch (error) {
    console.log(error);
    errorResMsg(res, 500, `Server error:=== ${error}`);
  }
};

// @LOGIN
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
      process.env.SECRET,
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
