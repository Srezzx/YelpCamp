var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user")
//**************************************************
//AUTH ROUTES
//**************************************************

router.get("/",function(req,res){
res.render("landing.ejs");
});


//Register User Route
router.get("/register",function(req,res){
	res.render("register.ejs");
});

router.post("/register",function(req,res){
	var newUser = new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err)
			{
				console.log(err)
				return res.render("register.ejs");
			}
		else
			{
				passport.authenticate("local")(req,res,function(){
					res.redirect("/campgrounds");
				});
			}
	});
});

//Login User Route
router.get("/login",function(req,res){
	res.render("login.ejs");
});

//app.post(route,middleware,callback) - format
router.post("/login",passport.authenticate("local",
		{								
	successRedirect:"/campgrounds", 	
	failureRedirect:"/login"												
		}),function(req,res){
	
});


//Logout Route
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged You Out");
	res.redirect("/campgrounds");
});

//Middle ware for authentication that user can only use if he is logged in
function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated()){
	   return next();
	   }
	res.redirect("/login");
}

module.exports = router;