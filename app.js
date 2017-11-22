// Requiring Packages
var express         = require("express");
var bodyParser      = require("body-parser");
var mongoose        = require("mongoose");
var passport        = require("passport");
var localStrategy   = require("passport-local");
var methodOverride  = require("method-override");
var flash           = require("connect-flash");

// Requiring Models
var User = require("./models/user.js")
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");

// Requiring Modules
var seedDb = require("./seeds.js");
var campgroundRoutes = require("./routes/campgrounds.js");
var commentRoutes = require("./routes/comments.js");
var indexRoutes = require("./routes/index.js");

// Configuring application
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
    secret: "yelpCampSecret",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(methodOverride("_method"));
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// [CREATE (db will be created at the point of adding/saving first item!) AND] CONNECT TO THE DB 
mongoose.connect(process.env.DATABASEURL, {useMongoClient: true});
// mongoose.connect("mongodb://Ante:YelpCamp@ds117136.mlab.com:17136/yelpcampdb", {useMongoClient: true});

//seedDb();



// ==================================
// SERVER

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server is runing ...");
});