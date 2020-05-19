// requiring variables

var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
	mongoose   = require("mongoose"),
	passport   = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Feedback = require("./models/feedback"),//we don't have to put .js,is implicit	
	Comment    = require("./models/comment"),
	User	   = require("./models/user"),
	seedDB    = require("./seeds")

	//here I am importing/requiring the 3 files which are the routes
var commentRoutes = require("./routes/comments"),
	feedbackRoutes = require("./routes/feedbacks"),
	authRoutes = 	require("./routes/auth")

mongoose.connect("mongodb://localhost/AppEx_V2");//  // FDBK_Api, moving to another folder version afterwards 
mongoose.set('useFindAndModify', false);//to get rid of the warning while compiling
mongoose.connection.on('error', (err) => { 
console.log('Mongodb Error: ', err);//handling errors
	process.exit();
	});
mongoose.connection.on('connected', () => {
	 console.log('MongoDB is successfully connected');//establishing connection to MongoDB Atlas
	});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));//"__dirname" help us to be safer and call the public directory. It always will be the directory where the scripts lives in. 
app.use(methodOverride("_method"));

//Passport configuration
app.use(require("express-session")({
	secret: "Li-Fi uses visible light to transfer data!!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//The middleware is calling this authenticate method in this route (app.post("/login", passport.authenticate("local")
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this is a middleware that will run for every single route
app.use(function(req, res, next){//this is a middleware
	res.locals.currentUser = req.user;
	next();//to move to the next middleware, which is going to be the route handler
});
 
//
app.use("/", authRoutes);	
app.use("/feedbacks/:id/comments", commentRoutes);
app.use("/feedbacks", feedbackRoutes);//allow us to only use "/" for the routes in the feedbacks.js file in order to show and create the feedbacks and also to send data 
//to the post route

app.listen(3000, function(){//conecting to the port
 console.log("The Li-Fi Share App is running!! ");
});   

