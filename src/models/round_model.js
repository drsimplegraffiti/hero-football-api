const { Schema, model } = require("mongoose");

const roundSchema = Schema(
  {
    roundNr: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports.User = model("Round", roundSchema);
