const router = require("express").Router();
const {
  signUp,
  verifyOtp,
  Login,
  Dashboard,
} = require("../controllers/user_controller");
const { isAuth } = require("../middleware/auth");

// @desc    Signup
// @route   POST  /api/user/signup
// @access  Public
router.route("/signup").post(signUp);

// @desc    Verify Otp
// @route   POST  /api/user/signup/verify
// @access  Private
router.route("/signup/verify").post(verifyOtp);

// @desc    Login
// @route   POST  /api/user/login
// @access  Private
router.route("/login").post(Login);

// @desc    Dashboard
// @route   POST  /api/user/auth/dashboard
// @access  Private

router.get("/auth/dashboard", isAuth, Dashboard);

module.exports = router;
