var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");

router.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allcampgrounds) {
        if (err) {
            res.send("Error has occured");
        } else {
            res.render("campgrounds/index", { campgrounds: allcampgrounds, currentUser: req.user });
        }
    });
});

router.get("/campgrounds/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});
router.post("/campgrounds", isLoggedIn, function(req, res) {
    // get data from form and add to array of campgrounds
    // also redirect to this page
    // res.send("You got it");
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    // addition of elements in database
    var newCampground = { name: name, image: image, description: desc, author: author };
    Campground.create(newCampground, function(err, newcreation) {
        if (err) {
            console.log("Error has occured");
        } else {
            res.redirect("/campgrounds");
        }
    });

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
// Edit Route
router.get("/campgrounds/:id/edit", checkCampgroundOwnership, function(req, res) {
    // is user logged in , if not then show login form 

    Campground.findById(req.params.id, checkCampgroundOwnership, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/edit", { campground: foundCampground });
        }
    });
});



// Update campground Route 
router.put("/campgrounds/:id", checkCampgroundOwnership, function(req, res) {

    Campground.findOneAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// DEstroy campground route

router.delete("/campgrounds/:id", checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);

        } else {
            res.redirect("/campgrounds");
        }
    });
});

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};


function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    // This takes user back to the previous page from where they came from
                    res.redirect("back");
                }
            }
        });

    } else {
        res.redirect("back");
    }
}

module.exports = router;