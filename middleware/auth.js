module.exports = (req, res, next) => {
    if(!req.session.currentUser) {
        req.flash("error", "You are not authorized. Login or Register first!");
        return res.redirect("/");
    }
    else {
        next();
    }
}