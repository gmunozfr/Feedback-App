var mongoose = require("mongoose");//requiring mongoose, completing data persistence
var passportLocalMongoose = require("passport-local-mongoose");//requiring passport-local-mongoose

var UserSchema = new mongoose.Schema({//defining the schema for the user model
	username : String,
	password : String
});

UserSchema.plugin(passportLocalMongoose)//starts adding helful methods and important functionality to the user model

//compile to the model, we're gonna export the userSchema
module.exports = mongoose.model("User", UserSchema);