var express = require("express"),
  router = express.Router(),
  City = require("../models/city"),
  nodemailer = require("nodemailer"),
  User = require("../models/user"),
  Warehouse = require("../models/Warehouse");

router.get("/", function (req, res) {
  res.render("landing");
});

router.get("/contact", function (req, res) {
  res.render("contactUs");
});

router.get("/profile", isLoggedIn, function (req, res) {
  User.findOne({ username: req.user.username }, function (err, found) {
    if (err) console.log(err);
    else res.render("profile", { found: found });
  });
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

router.post("/find/:id/checkout", isLoggedIn, function (req, res) {
  User.findOne({ username: req.user.username }, function (err, found) {
    if (err) console.log(err);
    else {
      var obj = { price: req.body.price };
      found.checkouts.push(obj);
      found.save(function (err, data) {
        if (err) console.log(err);
      });
    }
  });

  Warehouse.findById(req.params.id, function (err, found) {
    if (err) console.log(err);
    else {
      found.days = req.body.duration;
      found.free = true;
      console.log(found.days);
      found.save(function (err, data) {
        if (err) console.log(err);
      });
    }
  });

  const output = `
    <h3>Your reservation details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Phone Number: ${req.body.phone}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message:</h3>
    <p>You've reserved ${req.body.price}</p>
  `;

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    domain: "gmail.com",
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: "warehousecorporation3@gmail.com",
      pass: "warehousecorpahmed1234", // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: '"Warehouse Corporation" <warehousecorporation3@gmail.com>', // sender address
    to: req.body.email, // list of receivers
    subject: "Warehouse Reservation", // Subject line
    text: "Hello world!", // plain text body
    html: output, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
  req.flash("success", "Reservation completed, Check your email!");
  res.redirect("/find/" + req.params.id + "/checkout");
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
