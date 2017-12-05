var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var middleware = require("../middleware/index.js");
var geocoder = require('geocoder');

// INDEX (Get)
router.get("/", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log("Something went wrong:");
            console.log(err);
        } else {
           res.render("campgrounds/index", {campgrounds: campgrounds, currentUser: req.user, page: 'campgrounds'}); 
        }
    });
});

// CREATE (Get Campground Form)
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// CREATE (Post Campground Form)
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    geocoder.geocode(req.body.location, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("DATA:", data);
            var lat = data.results[0].geometry.location.lat;
            var long = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
            
            var newCampground = {name, image, description, price, author, location, lat, long};
            
            Campground.create(newCampground, function(err, newCampground){
                if(err){
                    console.log(err);
                } else {
                    res.redirect("/campgrounds");
                }
            });
        }
    });
});

// READ/SHOW (Get)
router.get("/:id", function(req, res) {
    var id = req.params.id;
    
    Campground.findById(id).populate("comments").exec(function(err, campground) {
        if(err || !campground) {
            req.flash("error", "Campground not found!");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

// EDIT/UPDATE (Get)
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        res.render("campgrounds/edit", {campground: campground});
    });
});

// EDIT/UPDATE (Put/Post)
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    var updatedCampground = req.body.campground;
    
    geocoder.geocode(updatedCampground.location, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            updatedCampground.lat = data.results[0].geometry.location.lat;
            updatedCampground.long = data.results[0].geometry.location.lng;
            updatedCampground.location = data.results[0].formatted_address;
            
            Campground.findByIdAndUpdate(req.params.id, updatedCampground, function(err, campground) {
                if (err) {
                    res.redirect("back");
                } else {
                   res.redirect("/campgrounds/" + campground._id); 
                }
            });
        }
    });
});


// DELETE (Delete/Post)
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
           res.redirect("/campgrounds"); 
        } else {
            res.redirect("/campgrounds"); 
        }
    })
});

// ==================================
// EXPORT
module.exports = router;