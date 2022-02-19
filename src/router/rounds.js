const { Router } = require("express");
const Round = require("../models/round_model");

const router = new Router();

//GET all rounds
router.get("/", async (req, res, next) => {
  try {
    const myRounds = await Round.find();
    res.send(myRounds);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
