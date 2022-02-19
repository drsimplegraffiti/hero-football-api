const { Router } = require("express");
const Score = require("../models/score_model");

const router = new Router();

// GET all scores
router.get("/", async (req, res, next) => {
  try {
    const response = await Score.find();
    res.send(response);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
