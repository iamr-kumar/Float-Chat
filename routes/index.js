const express = require("express");
const router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const { generateVirgilJwt } = require("../api/virgilToken");
const flash = require("connect-flash");

router.get("/", function (req, res) {
  res.render("home");
});
router.get("/login", (req, res) => {
  res.redirect("/");
});

router.post("/login", [check("username", "Username is required").exists(), check("password", "Password is required").exists()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("home", { errors: errors.array() });
  }
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      req.flash("error", "Invalid Credentials");
      res.redirect("/");
      // return res.status(400).json({ errors: { msg: "Invalid credentials!" } });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      req.flash("error", "Invalid Credentials");
      res.redirect("/");
      // return res.status(400).json({ errors: { msg: "Invalid credentials!" } });
    } else {
      req.session.currentUser = user;
      res.redirect("/inbox");
    }
  } catch (err) {
    console.log(err.message);
    req.flash("error", "Server Error!!");
    res.redirect("/");
    // res.status(500).send("Server error!");
  }
});

// const generatorPromise = getJwtGenerator();

router.get("/virgil-jwt", generateVirgilJwt);

router.get("/inbox", (req, res) => {
  res.render("inbox", { currentUser: req.session.currentUser, users });
});

module.exports = router;
