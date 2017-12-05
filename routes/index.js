var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user.js");
var middleware = require("../middleware/index.js");

// INDEX Route
router.get("/", function(req, res) {
    res.render("landing");
});

// REGISTER Get
router.get("/register", function(req, res) {
    res.render("register", {page: 'register'});
});

// REGISTER Post
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/register");
        } else {
           passport.authenticate("local")(req, res, function() {
               req.flash("success", "Welcome to YelpCamp " + user.username);
               res.redirect("/campgrounds");
           }); 
        }
    });
});

// LOGIN Get
router.get("/login", function(req, res) {
    res.render("login", {page: 'login'});
});

// LOGIN Post
// app.post(route, middleware, callback);
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

// LOGOUT Get
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

// ==================================
// EXPORT
module.exports = router;