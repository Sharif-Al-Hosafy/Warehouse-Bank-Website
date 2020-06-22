let mongoose = require("mongoose");

let warehouseSchema = new mongoose.Schema({
  name: String,
  price: String,
  typeOfGoods: String,
  image: String,
  space: String,
  free: Boolean,
  days: Number,
});

module.exports = mongoose.model("warehouse", warehouseSchema);
