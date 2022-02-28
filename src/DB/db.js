// Require mongoose
const mongoose = require("mongoose");
const AutoIncrementFactory = require("mongoose-sequence");
//Require dotenv file
require("dotenv").config();
const { MONGO_URL_LOCAL } = process.env;

// Async mongoose connection using async await
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URL_LOCAL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(error.message);

    // Exit with failure
    process.exit(1);
  }
};
const AutoIncrement = AutoIncrementFactory(connectDB);
module.exports = connectDB;
