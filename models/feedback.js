var mongoose = require("mongoose");//requiring mongoose, completing data persistence


var feedbackSchema = new mongoose.Schema({//defining the schema for the feedback model
	//defining the strings
	name: String,
	feeling: String,
	image: String,
	description: String,
	author: {
		id: {//objects
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},	
	comments: [//it should be an array of comment id's, we're not embedding the actual comments in here, we're embedding an id or reference to the comments!
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});	
//compile to the model, we're gonna export the feedbackSchema
module.exports = mongoose.model("Feedback", feedbackSchema);