let mongoose = require("mongoose");

let citySchema = new mongoose.Schema({
  name: String,
  location: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "warehouse",
    },
  ],
});

module.exports = mongoose.model("city", citySchema);
