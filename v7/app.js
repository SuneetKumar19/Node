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

var CommonRoutes = require("./routes/comments");
var CampgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
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

// require routes here
app.use(CommonRoutes);
app.use(CampgroundRoutes);
app.use(indexRoutes);

app.listen(3000, function() {
    console.log("Server started at PORT 3000");
});