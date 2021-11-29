const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const User = require("../models/users");
const flash = require("connect-flash");
const ChatModel = require("../models/chat");

router.get("/register", (req, res) => {
  res.render("home");
});

router.post(
  "/register",
  [
    check("email", "Enter a valid email").isEmail(),
    check("username", "Enter a valid username").exists(),
    check("password", "Password is required").exists(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("home", { errors: errors.array() });
    }

    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        // errors.push("User already exists!");
        req.flash("error", "User already Exists");
        res.redirect("/");
        // return res.status(400).json({ errors: [{ msg: "User already exists!" }] });
      }
      user = new User({
        username,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      await user.save();

      await new ChatModel({ user: user._id, chats: [] }).save();

      req.session.currentUser = user;

      res.redirect("/inbox");
    } catch (err) {
      console.log(err.message);
      req.flash("error", "Server Error!!");
      res.redirect("/");
      // res.status(500).send("Server error!");
    }
  }
);

module.exports = router;
