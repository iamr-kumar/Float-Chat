const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    res.render("home");
});

router.get("/messages", (req, res) => {
    res.render("messages");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/signup", (req, res) => {
    res.render("signup");
})

module.exports = router;