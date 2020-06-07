let mongoose = require("mongoose");

let warehouseSchema = new mongoose.Schema({
  city: String,
  location: [
    {
      name: String,
      space: String,
      price: String,
      image: String,
      typeOfgoods: String,
    },
  ],
});

module.exports = mongoose.model("warehouse", warehouseSchema);
