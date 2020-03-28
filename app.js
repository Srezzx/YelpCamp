var express =require("express");
var app=express();
var seedDB = require("./seeds");
var Comment = require("./models/comment");// Comments - SCHEMA setup 
 //seedDB();//function in seeds.js
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");// Users - SCHEMA setup
Campground = require("./models/campground")// Campground - SCHEMA Setup

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/index");

//FLASH MESSAGES
var flash = require("connect-flash");
app.use(flash());

var methodOverride = require("method-override");
app.use(methodOverride("_method"));
//configuration of mongoose(mongoDB)
var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
//mongoose.connect("mongodb://localhost/YelpCamp"); //-- for local database
mongoose.connect("mongodb+srv://Srezz:E0Y550F4bZhiXLeX@cluster0-oshu0.mongodb.net/test?retryWrites=true&w=majority",{
	useNewUrlParser :true,
	useCreateIndex :true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('Error' , err.message);
});

//Configuration of Body Parser 
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//Configuration of ejs
app.set("view engine","ejs");

 //To inherit the page main.css
app.use(express.static(__dirname+ "/public")); 

//PASSPORT Configuration
app.use(require("express-session")({
	secret:"Demons run when a good man goes to war",
	resave:false,
	saveUninitialie:false
}));

app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT || 3000 , process.env.ID,function(req,res){
	console.log("Server has started");
});
