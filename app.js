let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Warehouse = require("./models/Warehouse"),
  City = require("./models/city"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user"),
  flash = require("connect-flash"),
  WarehouseRouts = require("./routs/warehouseRouts"),
  authRouts = require("./routs/authRouts");

// City.create({
//   name: "Alexandria",
// });
// Warehouse.create(
//   {
//     name: "Abis",
//     price: "13000",
//     typeOfGoods: "Break Bulk Warehouses",
//     image: "https://i.ibb.co/Jj1Gp0x/ssss.jpg",
//     space: "750m",
//   },
//   function (err, house) {
//     City.findOne({ name: "Alexandria" }, function (err, foundCity) {
//       if (err) console.log(err);
//       else {
//         foundCity.location.push(house);
//         foundCity.save(function (err, data) {
//           if (err) console.log(err);
//           else console.log(data);
//         });
//       }
//     });
//   }
// );

mongoose.connect(
  "mongodb+srv://sharif:allahraby1234@warehouse-jrtie.mongodb.net/warehouse?retryWrites=true&w=majority",
  { autoIndex: false }
);

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

var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log("Listening !!!");
});
