let mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  address: String,
  password: String,
});

mongoose.plugin(passportLocalMongoose);
module.exports = mongoose.model("user", userSchema);
