const { Schema, model } = require("mongoose");

module.exports.Otp = model(
  "Otp",
  Schema(
    {
      number: {
        type: String,
        required: true,
      },
      otp: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 300 }, //deletes after 5 minutes automatically from the db
      },
    },
    { timestamps: true }
  )
);
