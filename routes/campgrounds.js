var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

var middleware = require("../middleware/index.js");


//***************************************************
// CAMPGROUND Routes
//***************************************************




router.get("/campgrounds",function(req,res){
    // get all campgrounds and then render the file
	
	Campground.find({},function(err,allcampgrounds){
		if(err)
			{
				console.log("Error is found");
			}
		else
			{
				res.render("campgrounds/index.ejs",{campgrounds:allcampgrounds, currentUser:req.user});
			}
	});
	
});

router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
	res.send("You hit the post route");
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author=	{
		id:req.user._id,
		username : req.user.username
				}
	var newcampground = {name :name, image:image , description:desc, author:author};
	
	//ceate a new campground and save to database
	
	Campground.create(newcampground,function(err,newlycreated){
		if(err)
			{
				console.log(err);
			}
		else
			{
				console.log("Hi i am sriesh");
				console.log(newlycreated)
				res.redirect("/campgroundss");
			}
	});
	//get data from form and add , redirect to campgrounds page
});

router.get("/campgroundss",function(req,res){
	res.redirect("/campgrounds");
})
//NEW Route

router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new.ejs");
});

//SHOW Route

router.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
	if(err)
		{
			console.log(err);
		}
	else
		{
				res.render("campgrounds/show.ejs",{campground:foundCampground});
		}
	});
});

//EDIT CAMPGROUND Route
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
			if(err)
				{
					res.redirect("/campgrounds");
				}
			else
				{
					res.render("campgrounds/edit",{campground:foundCampground});
				}
		});	
});


//UPDATE CAMPGROUND Route
//find and update the correct campground
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground ,function(err,updatedCanpground){
		if(err)
			{
				res.redirect("/campgrounds");
			}
		else
			{
				res.redirect("/campgrounds/"+req.params.id);
			}
	});
  });

//DESTROY CAMPGROUND Route
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err)
			{
				res.redirect("/campgrounds");
			}
		else
			{
				res.redirect("/campgrounds");
			}
	});
});


module.exports  = router;