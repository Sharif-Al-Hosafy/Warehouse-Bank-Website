var express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user");

router.get("/register", function (req, res) {
  res.render("register");
});

router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  if (req.body.password === req.body.confirmPassword) {
    User.register(newUser, req.body.password, function (err, user) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          // take req.body.pass and req.body.username and check and store
          req.flash("success", "Welcome To Warehouse, " + req.body.username);
          res.redirect("/find");
        });
      }
    });
  } else {
    req.flash("error", " Password doesn't match ");
    res.redirect("/register");
  }
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/find",
    failureRedirect: "/login",
    failureFlash: "Incorrect Username or Password",
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "Logged you out");
  res.redirect("/find");
});

module.exports = router;
