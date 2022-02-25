const express = require("express");
const colors = require("colors");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./router/user_router");
const matchRouter = require("./router/matches");
const roundsRouter = require("./router/rounds");
const predictionRouter = require("./router/prediction");
const scoresRouter = require("./router/scores");
const adminRouter = require("./router/admin");

const matches = require("./API_request/matches");
const rounds = require("./API_request/rounds");

matches.getMatches();
// rounds.getRounds();

//middleware
app.use(cors());
app.use(helmet());

// Logger
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Timezone
process.env.TZ = "Africa/Lagos";

//routes
app.get("/", (req, res) => {
  return res.status(200).json({ msg: "hero ---> home page" });
});
app.use("/api/user", userRouter);
app.use("/", matchRouter);
app.use("/", roundsRouter);
app.use("/api/v1/prediction", predictionRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/", scoresRouter);

// @404 page
app.get("*", (req, res) => {
  return res.status(200).json({ msg: "page not found" });
});

module.exports = app;
