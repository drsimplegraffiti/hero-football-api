const jwt = require("jsonwebtoken");
const User = require("../models/user_model");
const dotenv = require("dotenv");
dotenv.config();
const { ADMIN_SECRET, USER_SECRET } = process.env;
const { successResMsg, errorResMsg } = require("../utils/response");

exports.isAuth = async (req, res, next) => {
  try {
    // console.log(req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return errorResMsg(res, 401, "Token Is missing");

    const decoded = await jwt.verify(token, USER_SECRET);
    if (!decoded) {
      throw new Error();
    }
    req.user = decoded;
    console.log("===req.user");
    console.log(req.user);
    console.log("===req.user");

    next();
  } catch (e) {
    return errorResMsg(res, 401, "signUp as user || Token expired ");
  }
};

exports.isAdminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return errorResMsg(res, 401, "Token Is missing");

    const decoded = await jwt.verify(token, ADMIN_SECRET);
    if (!decoded) {
      throw new Error();
    }
    req.admin = decoded;
    console.log("===req.admin");
    console.log(req.admin);
    console.log("===req.admin");

    next();
  } catch (e) {
    return errorResMsg(res, 401, "signUp as Admin || Token expired ");
  }
};
