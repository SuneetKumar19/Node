var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");
var data = [{
        name: "cloudnrkldsce",
        image: "https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "blah blah blah"
    },
    {
        name: "cloudjkdce",
        image: "https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "blajnfek iefd"
    },
    {
        name: "cloudjfilkrjemfklnre",
        image: "https://images.pexels.com/photos/236047/pexels-photo-236047.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "mks fvnsdmvndfskc rindscmo"
    }
]

function seedDB() {
    Campground.remove({}, function(err) {

        if (err) {
            console.log("Error has occured");
            console.log(err);
        }
        console.log("All removed");
    });

    data.forEach(function(seed) {
        Campground.create(seed, function(err, campground) {
            if (err) {
                console.log(err);
            } else {
                console.log("added campground");

                //  creating comments

                Comment.create({

                        text: "this place is literally quite nice",
                        author: "Homer"
                    },
                    function(err, comment) {
                        if (err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("comment added successfully");
                        }
                    });
            }
        });
    });
};



module.exports = seedDB;