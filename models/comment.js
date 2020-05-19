var mongoose = require("mongoose");//requiring mongoose, completing data persistence

var commentSchema = mongoose.Schema({//implementing the schema for the comments model
    text: String,
    author: {
		id: {//objects
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Comment", commentSchema);//compile to the model, we're gonna export the commentSchema