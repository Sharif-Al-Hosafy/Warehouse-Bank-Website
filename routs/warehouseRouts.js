var express = require("express"),
  router = express.Router(),
  City = require("../models/city"),
  Warehouse = require("../models/warehouse");

router.get("/", function (req, res) {
  res.render("landing");
});

router.get("/find", function (req, res) {
  City.find({}, function (err, city) {
    if (err) console.log(err);
    else {
      res.render("findWarehouse", { city: city });
    }
  });
});

router.get("/find/:id", isLoggedIn, function (req, res) {
  var noMatch = null;
  if (req.query.search1 || req.query.search2) {
    const regex = new RegExp(escapeRegex(req.query.search1), "gi");
    const regex2 = new RegExp(escapeRegex(req.query.search2), "gi");
    City.findById(req.params.id)
      .populate("location", null, { name: regex, typeOfGoods: regex2 })
      .exec(function (err, found) {
        if (err) console.log(err);
        else {
          console.log(found);
          if (found.location.length < 1) noMatch = "No Warehouse Found";
          res.render("foundWarehouses", { found: found, noMatch: noMatch });
        }
      });
  } else {
    City.findById(req.params.id)
      .populate("location")
      .exec(function (err, found) {
        if (err) console.log(err);
        else {
          res.render("foundWarehouses", { found: found, noMatch: noMatch });
        }
      });
  }
});

router.get("/find/:id/checkout", isLoggedIn, function (req, res) {
  Warehouse.findById(req.params.id, function (err, found) {
    if (err) console.log(err);
    else res.render("checkout", { found: found });
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  else {
    req.flash("error", "Please Login First!");
    res.redirect("/login");
  }
}

module.exports = router;
