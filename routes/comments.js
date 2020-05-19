/*requiring the variables*/
var express = require("express");
var router =  express.Router({mergeParams: true});//merging the params from the "feedback" and the "comments" together, so from the comments.js file we can access the app.js file.
var Feedback = require("../models/feedback");
var Comment = require("../models/comment");

//The following is for the comments new
//I am using "isLoggedIn", where if a user is not logged in, is not going to be possible to add a new comment and then the user will be redirected to the login page
router.get("/new", isLoggedIn, function(req, res){
		//find feedback by id
	Feedback.findById(req.params.id, function(err, feedback){
		if(err){
			console.log(err);
		} else {
		res.render("comments/new", {feedback: feedback});
		}
	})
})
//The following is for the comments create
router.post("/", isLoggedIn, function(req, res){
	//lookup feedback using ID
	Feedback.findById(req.params.id, function(err, feedback){//finding the correct feedback
		if(err){
			console.log(err);
			res.redirect("/feedbacks");
	} else {
		Comment.create(req.body.comment, function(err, comment){//creating a comment
		if(err){
			console.log(err);
	} else {
		//adding username and id to comment
		comment.author.id = req.user._id;
		comment.author.username = req.user.username;
		//save comment
		comment.save();
		feedback.comments.push(comment);//pushing the comment into the feedback
		feedback.save();//saving the feedback
		//    /feedbacks/:id ---> below we need to redirect this which is the show page of the feedback//
		console.log(comment);
		res.redirect('/feedbacks/' + feedback._id);
		}
	  });				
	}
	})
	
});

//This is the middleware!
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
	return next();
	}
	res.redirect("/login");//if isn't logged in then the user will be redirected to the login page
};

//exporting the file!
module.exports = router;
