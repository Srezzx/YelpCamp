//All the middleware goes here
var middlewareObj ={};
var Campground = require("../models/campground");
var Comment = require("../models/comment");
//CAMPGROUND AUTHENTICATION CHECK
middlewareObj.checkCampgroundOwnership =function(req,res,next)
{
	if(req.isAuthenticated())
		{
			Campground.findById(req.params.id,function(err,foundCampground){
			if(err)
				{
					res.redirect("back");
				}
			else
				{
					//does the user own the campground
					if(foundCampground.author.id.equals(req.user._id))
						{
							next();
						}
					else
						{
							res.redirect("back");
						}
				}
		});
		}
	else
		{
			res.redirect("back");
		}
}
//COMMENT AUTHENTICATION CHECK
middlewareObj.checkCommentOwnership = function(req,res,next)
{
	if(req.isAuthenticated())
		{
			Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err)
				{
					res.redirect("back");
				}
			else
				{
					//does the user own the comment
					if(foundComment.author.id.equals(req.user._id))
						{
							next();
						}
					else
						{
							res.redirect("back");
						}
				}
		});
		}
	else
		{
			res.redirect("back");
		}
}

//Is LOGGED IN AUTHENTICATION CHECK
middlewareObj.isLoggedIn = function(req,res,next)
{
	if(req.isAuthenticated()){
	   return next();
	   }
	req.flash("error","Please login or Sign Up First!!");
	res.redirect("/login");
}

module.exports =middlewareObj ;