let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Warehouse = require("./models/Warehouse");

mongoose.connect("mongodb://localhost/warehouse");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //mention the public directory from which we are serving the static files
// Warehouse.create({
//   city: "Cairo",
//   location: [
//     {
//       name: "October City",
//       space: "2000m",
//       price: "10,000 L.E",
//       image:
//         "https://www.thebalancesmb.com/thmb/s9YAMfD8lPTijOHeFLyc4DkOz6w=/3001x2251/smart/filters:no_upscale()/rows-of-shelves-with-boxes-in-modern-warehouse-686616360-5a99e23cae9ab80037ba1ac1.jpg",
//       typeOfgoods: "none",
//     },
//   ],
// });

// var obj = {
//   name: "Al Agami",
//   space: "4500m",
//   price: "75,000 L.E",
//   image:
//     "https://www.mondo-logistic.net/wp-content/uploads/2019/04/Lagerlogistik.jpg",
//   typeOfgoods: "Break Bulk warehouse",
// };

// db.warehouses.update(
//   { city: "Alexandria" },
//   {
//     $push: {
//       location: {
//         name: "Al Agami",
//         space: "4500m",
//         price: "75,000 L.E",
//         image:
//           "https://www.mondo-logistic.net/wp-content/uploads/2019/04/Lagerlogistik.jpg",
//         typeOfgoods: "Break Bulk warehouse",
//       }
//     }
//   }
// )

app.get("/", function (req, res) {
  res.render("landing");
});

app.get("/find", function (req, res) {
  Warehouse.find({}, function (err, warehouse) {
    if (err) console.log(err);
    else {
      res.render("findWarehouse", { warehouse: warehouse });
    }
  });
});

app.post("/find", function (req, res) {
  var city = req.body.city;
  Warehouse.findOne({ city: city }, function (err, choice) {
    if (err) console.log(err);
    else {
      res.render("foundWarehouses", { choice: choice });
    }
  });
});

app.listen(3000, function () {
  console.log("Listening !!!");
});
