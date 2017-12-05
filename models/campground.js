var mongoose = require("mongoose");

// SCHEMA SETUP (FOR MODEL)
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    description: String,
    location: String, 
    lat: Number,
    long: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// ENTITY MODEL
var Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground;

