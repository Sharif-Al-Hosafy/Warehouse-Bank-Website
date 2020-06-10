let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  City = require("./models/city"),
  Warehouse = require("./models/warehouse"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user"),
  flash = require("connect-flash"),
  WarehouseRouts = require("./routs/warehouseRouts"),
  authRouts = require("./routs/authRouts");

mongoose.connect("mongodb://localhost/warehouse");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //mention the public directory from which we are serving the static files
app.use(flash());

//==== passport Config ===== ///
app.use(
  require("express-session")({
    secret: "sharifHosafy",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//=============================================//

app.use(function (req, res, next) {
  res.locals.currentUser = req.user; //pass the user to every single template
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(authRouts);
app.use(WarehouseRouts);

app.listen(3001, function () {
  console.log("Listening !!!");
});
