var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");

router.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allcampgrounds) {
        if (err) {

        } else {
            res.render("campgrounds/index", { campgrounds: allcampgrounds, currentUser: req.user });
        }
    });
});

router.post("/campgrounds", function(req, res) {
    // get data from form and add to array of campgrounds
    // also redirect to this page
    // res.send("You got it");
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;

    // addition of elements in database
    var newCampground = { name: name, image: image, description: desc };
    Campground.create(newCampground, function(err, newcreation) {
        if (err) {
            console.log("Error has occured");
        } else {
            res.redirect("/campgrounds");
        }
    });

});

router.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

// for getting more information about it

// show
router.get("/campgrounds/:id", function(req, res) {
    // res.send("This is show page bro");

    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log("Cannot connect");
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });

});

module.exports = router;