var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var campgrounds = [
    { name: "salmon Creek", image: "https://images.pexels.com/photos/66997/pexels-photo-66997.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500" },
    { name: "Granite hill", image: "https://images.pexels.com/photos/235615/pexels-photo-235615.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500" },
    { name: "Mountain goat", image: "https://images.pexels.com/photos/66997/pexels-photo-66997.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500" }
];

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.get("/", function(req, res) {
    // res.send("This is landing page bro");
    res.render("landing");

});
https: //images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500

    app.get("/campgrounds", function(req, res) {

        res.render("campgrounds", { campgrounds: campgrounds });
    });

app.post("/campgrounds", function(req, res) {
    // get data from form and add to array of campgrounds
    // also redirect to this page
    // res.send("You got it");
    var name = req.body.name;
    var image = req.body.image;

    var newCampground = { name: name, image: image };
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
});

app.listen(3000, function() {
    console.log("Server startsed at PORT 3000");
});