var mongoose = require("mongoose");

// SCHEMA SETUP (FOR MODEL)
var commentSchema = new mongoose.Schema({
    text: String,
    createdAt: {
        type: Date, 
        default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

// ENTITY MODEL
var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;