const router = require("express").Router();
const {
  signUp,
  Login,
  Dashboard,
  verifyMail,
} = require("../controllers/user_controller");
const { isAuth } = require("../middleware/auth");

// @desc    Signup
// @route   POST  /api/user/signup
// @access  Public
router.route("/signup").post(signUp);

// @desc    Login
// @route   POST  /api/user/login
// @access  Private
router.route("/login").post(Login);

// @desc    Dashboard
// @route   POST  /api/user/auth/dashboard
// @access  Private

router.get("/auth/dashboard", isAuth, Dashboard);

// @desc    Verify email
// @route   POST  /api/user/auth/verify-email
// @access  Private
router.get("/auth/verify-email", verifyMail);

module.exports = router;
