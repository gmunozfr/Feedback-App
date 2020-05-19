/*requiring variables*/
var express = require("express");
var router =  express.Router();
var Feedback = require("../models/feedback");

// INDEX - This Route will show you all the feedbacks!
router.get("/", function(req, res){
	// 	the 2nd feedbacks is the data we are passing in and the 1st feedback is the name we are giving to
	//Here we need to get all the feedbacks from the db
	Feedback.find({}, function(err, allFeedbacks){
		if(err){
			console.log(err);
		} else {
			res.render("feedbacks/index",{feedbacks: allFeedbacks, currentUser: req.user});	//I actually don't need here this "currentUser:req.user" because is already defined as a middleware on top!
		}
	});
  });
// And this is the route where we can create a new feedback!
router.post("/", isLoggedIn, function(req, res){           //add new feedback to DB!
	//get data from form and add to feedbacks array
    var	name = req.body.name;
    var feeling = req.body.feeling;
	var	image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	//We need to push a new feedback to the feedback array
	//This is the object we create and use to push below
	var newFeedback = {name: name, feeling: feeling, image: image, description: desc, author:author}
	//create a new feedback and save to the db
	Feedback.create(newFeedback, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to feedbacks page
			res.redirect("/feedbacks");
		}
	});
	
	//NOTE: feedbacks.push(newFeedback);//we don't need this cus we deleted on top, we are adding feedbacks from the db now
	
});
// this Route is gonna show the form that will send the data to the post route:"/feedbacks"
router.get("/new", isLoggedIn, function(req, res){//shows form to create a new feedback!
	res.render("feedbacks/new");
});

//we need to put this route at the very end cus ":id" means that anything you put after the feedbacks/ goes there
//show more info about each feedback
router.get("/:id", function(req, res){
	//find the feedback with provided id
	Feedback.findById(req.params.id).populate("comments").exec(function(err, foundFeedback){
		if(err){
			console.log(err);
		} else {
			console.log(foundFeedback);
	 //render show template with that feedback
	//we're gonna pass in the found feedback under the name "feedback" and use it inside the template,so inside the show template we acces feedback and we'll have the value with the id
	 res.render("feedbacks/show", {feedback: foundFeedback});
	}		
  });		
});

//Edit feedback route
//with checkFeedbackOwnership we protect who edits the feedback
router.get("/:id/edit", checkFeedbackOwnership, function(req, res){			
		Feedback.findById(req.params.id, function(err, foundFeedback){
			res.render("feedbacks/edit", {feedback: foundFeedback});
		});
	});

//Update feedback route
//whit checkFeedbackOwnership we protect who updates the feedback
router.put("/:id", checkFeedbackOwnership, function(req, res){
	//find and update the correct feedback
	Feedback.findByIdAndUpdate(req.params.id, req.body.feedback, function(err, updatedFeedback){
		if(err){
		res.redirect("/feedbacks");
	} else {
		//redirect somewhere(show page)
		res.redirect("/feedbacks/" + req.params.id);
	}
  });
});
//Destroy feedback route
//whit checkFeedbackOwnership we protect who deletes the feedback
router.delete("/:id", checkFeedbackOwnership, function(req, res){
	Feedback.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/feedbacks");
	} else {
		res.redirect("/feedbacks");
     }
   });
});

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
	   return next();
	}
	res.redirect("/login");//if isn't logged in then the user will be redirected to the login page
}
//checking if the user is logged in
//middleware to protect who is editing, updating and deleting a comment. Authorization
function checkFeedbackOwnership(req, res, next){
	if(req.isAuthenticated()){				
		Feedback.findById(req.params.id, function(err, foundFeedback){
			if (err){
				res.redirect("back");
			} else {
				//cheking if the user owns the feedback
				if(foundFeedback.author.id.equals(req.user._id)){ //checking if the author owns that found feedback
					next();
				} else  {
					res.redirect("back");
				}
			}	
		});
	} else {
		res.redirect("back");//takes the user back to the previous page
	}
}
//exporting the feedbacks file
module.exports = router;