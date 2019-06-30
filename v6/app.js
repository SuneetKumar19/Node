var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
seedDB();




// PAssport configuration



app.use(require("express-session")({
    secret: "I am very happy today",
    resave: false,
    saveUninitialized: false
}));

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
mongoose.connect("mongodb://localhost/yelp_camp_v6", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


app.get("/", function(req, res) {
    // res.send("This is landing page bro");
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {


    Campground.find({}, function(err, allcampgrounds) {
        if (err) {

        } else {
            res.render("campgrounds/index", { campgrounds: allcampgrounds, currentUser: req.user });
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
// ==================


app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {

    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {

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

// Authentication routes will be placed here

app.get("/register", function(req, res) {
    res.render("register");
});

// signup logic
app.post("/register", function(req, res) {
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

app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    function(req, res) {});


// Logout 

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};


app.listen(3000, function() {
    console.log("Server started at PORT 3000");
});