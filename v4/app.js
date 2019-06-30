var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

seedDB();

mongoose.connect("mongodb://localhost/yelp_camp_v3", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.get("/", function(req, res) {
    // res.send("This is landing page bro");
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {

    Campground.find({}, function(err, allcampgrounds) {
        if (err) {

        } else {
            res.render("campgrounds/index", { campgrounds: allcampgrounds });
        }
    });

});

app.post("/campgrounds", function(req, res) {
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

app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

// for getting more information about it

// show
app.get("/campgrounds/:id", function(req, res) {
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
// ===============
// adding new comments
app.get("/campgrounds/:id/comments/new", function(req, res) {

    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res) {

    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    console.log(campground._id);
                    res.redirect("/campgrounds/" + campground._id);
                }
            });

        }
    });
});
app.listen(3000, function() {
    console.log("Server started at PORT 3000");
});