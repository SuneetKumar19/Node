var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//         name: "Mountain goatsss",
//         image: "https://images.pexels.com/photos/66997/pexels-photo-66997.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500",
//         description: "This is a very beautiful place full"
//     },
//     function(err, campground) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("Crated a new one");
//             console.log(campground);
//         }
//     }
// );



app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.get("/", function(req, res) {
    // res.send("This is landing page bro");
    res.render("landing");
});



// https: //images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500


app.get("/campgrounds", function(req, res) {

    Campground.find({}, function(err, allcampgrounds) {
        if (err) {

        } else {
            res.render("index", { campgrounds: allcampgrounds });
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
    res.render("new.ejs");
});

// for getting more information about it
app.get("/campgrounds/:id", function(req, res) {
    // res.send("This is show page bro");

    Campground.findById(req.params.id, function(err, foundCampground) {

        if (err) {
            console.log("Cannot connect");
        } else {
            res.render("show", { campground: foundCampground });
        }
    });

});


app.listen(3000, function() {
    console.log("Server started at PORT 3000");
});