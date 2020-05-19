// This file is just for testing purposes about seeding the database, I might leave it if it has to be required to test some functionalities of the web app!!

//requiring variables 
var mongoose = require("mongoose");
var Feedback = require("./models/feedback");
var Comment = require("./models/comment");
// objects
var data = [
	{
	 name: "", 
	 image: "",
	 description: ""
	},
	{
	 name: "", 
	 image: "",
	 description: ""
	},
	{
	 name: "", 
	 image: "",
	 description: ""
	}
]

//If we comment out the feedback.remove below we can remove all the feedbacks from the database 
function seedDB(){
	//Remove all feedbacks
	Feedback.remove({}, function(err){
	if(err){
		console.log(err);
	}
	console.log("removed feedback!");
		//add a few feedbacks
	data.forEach(function(seed){//one seed will represent 1 object which is only one name,image and description, this object is inside the array!
		Feedback.create(seed, function(err, feedback){
			if(err){
				console.log(err)
			} else {	
				
				console.log("add a feedback");
				//create a comment
				Comment.create(
					{
						text: "This is for testing purposes!!",
						author: "Gama"	   
			   }, function(err, comment){//once the comment has being created, we want to associate it with a feedback, so we are gonna change data for feedback inside Feedback.create
				   if(err){
					   console.log(err);
				   } else {
					 feedback.comments.push(comment)//we're pushing the comment inside the function that has the text and author. We're associating with a feedback!
					 feedback.save();
					 console.log("new comment created!");
				   } 
			   });
			}	
		});		
	});
});
	
	
	//add a few comments
}
// exporting the seeds file!!
module.exports = seedDB;
	
	
