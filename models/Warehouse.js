let mongoose = require("mongoose");

let warehouseSchema = new mongoose.Schema({
  name: String,
  price: String,
  typeOfGoods: String,
  image: String,
  space: String,
});

module.exports = mongoose.model("warehouse", warehouseSchema);
