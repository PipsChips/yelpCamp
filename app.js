// Requiring Packages
var express         = require("express");
var bodyParser      = require("body-parser");
var mongoose        = require("mongoose");
var passport        = require("passport");
var localStrategy   = require("passport-local");
var methodOverride  = require("method-override");
var flash           = require("connect-flash");

// Requiring Models
var User = require("./models/user.js");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");

// Requiring Modules
var seedDb = require("./seeds.js");
var campgroundRoutes = require("./routes/campgrounds.js");
var commentRoutes = require("./routes/comments.js");
var indexRoutes = require("./routes/index.js");

var url = process.env.DATABASEURL || "mongodb://localhost/yelpCamp";
mongoose.connect(url, {useMongoClient: true});

// Configuring application
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

// Passport Configuration
app.use(require("express-session")({
    secret: "yelpCampSecret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//seedDb();

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// ==================================

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server is runing ...");
});