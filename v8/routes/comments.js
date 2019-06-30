var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {

    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});


router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {

                    // add username and id to comments
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    console.log("My username is " + comment.author.username);
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(campground._id);
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});


// middleware

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};




module.exports = router;