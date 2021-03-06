var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");





router.get("/", function(req, res) {
    // res.send("This is landing page bro");
    res.render("landing");
});


// ===============
// adding new comments
// ==================



// Authentication routes will be placed here
router.get("/register", function(req, res) {
    res.render("register");
});

// signup logic
router.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds");
        });
    });
});

// Showing login forms

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    function(req, res) {});


// Logout 

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});




// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;