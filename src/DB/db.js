// Require mongoose
const mongoose = require("mongoose");

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

module.exports = connectDB;
