/*requiring the variables*/
var express = require("express");
var router =  express.Router();
var passport = require("passport");
var User = require("../models/user");

//This is the root route
router.get("/", function(req, res){
  res.render("landing");	
});
// WE NEED TO USE THE RESTFUL CONVENTION, SO WE'LL USE "FEEDBACKS" ONLY as the noun!



//This is the register form route
router.get("/register", function(req, res){
	res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});//username from the form
	User.register(newUser, req.body.password, function(err, user){//the newly created user, the sign up ocurrs here!!
	if(err){
		console.log(err);//if a problem when signing, 
		return res.render("register")//we render the form again 
		}	
		passport.authenticate("local")(req, res, function(){//log them in, authenticate them
			res.redirect("/feedbacks");//redirect them to /feedbacks
		});
	});//password from the form and we're passing the newUser that only has the username assigned and register is handling the logic of taking the password and stores the hash
});

//show login form route
router.get("/login", function(req, res){
	res.render("login");
});
//This is the handling login form logic
router.post("/login", passport.authenticate("local", //passport.authenticate is the middleware
	{
	successRedirect: "/feedbacks",//here runs the middleware as well
	failureRedirect: "/login"//here runs the middleware as well
    }), function(req, res){//here is the call back!
});
	
//This is the logout logic route
router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/feedbacks");
});

//This is the middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
	return next();
	}
	res.redirect("/login");//if isn't logged in then the user will be redirected to the login page
};
//exporting the file!
module.exports = router;
