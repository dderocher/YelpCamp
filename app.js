var serverVersion = '10';

/*-------------------------------*/
// INITIALIZE EXPRESS
/*-------------------------------*/
var express        = require("express"),
    mongoose       = require("mongoose"),
    bodyParser     = require("body-parser"),
    methodOverride = require("method-override")
;

/*SESSION/Auth requirements*/
var passport              = require("passport"),
    localStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
;

/* REQUIRE ROUTE FILES*/
var indexRoutes      = require("./routes/index.js"),
    campGroundRoutes = require("./routes/campgrounds.js"),
    commentRoutes    = require("./routes/comments.js");


//--------------------------------------------
// Setup config vars from environment
//---------------------------------------------
var envPath= process.env.APP_ENVFILE_DIR + '/YelpCamp/.env';

require('dotenv').config({silent: true, path: envPath  });

/* Env var need setup here */
var dbURI            = process.env.DATABASEURL,
    sessionSecretKey = process.env.SESSIONSECRETKEY,
    envTestData      = process.env.CREATETESTDATA
;


/*Test Data requirements*/
var createTestData = false,
    seedDB         = require("./seeds");

if (envTestData === 'YES')
{
    createTestData = true;
}



//--------------------------------------------
// Application Setup/initialize
//---------------------------------------------
// app comes first
var app = express();

/* Template Engine*/
/* EJS - Tell express the file extension of your view/template engine so 
you don’t have to type .ejs all the time*/
app.set("view engine", "ejs");

/* body-parser - for html-form post routes*/
app.use(bodyParser.urlencoded({
    extended: true
}));

/* Tell express to serve the contents of the public directory */
app.use(express.static(__dirname + "/public"));

/*mehtod-override middleware to allow put/delete routes from form*/
app.use(methodOverride("_method"));

//--------------------------------------------
// Authentication/Session Setup/initialize
//---------------------------------------------
/*Require user model*/
var User = require("./models/user");

/*Require express-session*/
var expressSession = require("express-session");

/* Plug express-session into express*/
app.use(expressSession({
    secret: sessionSecretKey,
    resave: false,
    saveUninitialized: false
}));

/*Plug passport Middleware into express*/
app.use(passport.initialize());
app.use(passport.session());

/* Plug passport-local Middleware into passport 
   Calls the plugin from passportLocalMongoose from User file
*/
passport.use(new localStrategy(User.authenticate()));

/*These two methods really important to passport
  We aquired these by adding in userSchema.plugin(passportLocalMongoose)
  in the user.js file.
*/
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//--------------------------------------------
// Flash message middleware
//---------------------------------------------
/*Flash messages are stored in the session. First, setup 
  session middleware like express-session above
  With the flash middleware in place, all requests will 
  have a req.flash() function that can be used for flash messages.
  
*/
var flash = require("connect-flash");
app.use(flash());


//--------------------------------------------
// General middleware
//---------------------------------------------
/* Stick in some middleware 
  whatever function we provide here will be called
  on every route...
*/
app.use(function(req, res, next) {
    /*   whateve we put in res.locals is made available 
        to all of our our templates...
        saves us from having to pass this on every routes render.
    */
    /* Note: It is important to put req.user after the passport 
       middleware is enabled or req.user will not be available.
    */
    res.locals.userLoggedIn = req.user;
   
    /* Setup Flash Message Vars here, so they will be defined for
      all route/templates.
    */
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages   = req.flash('error_messages');
    
    /* Important to conclude with with this, so following callback
      will continue*/
    next();
});



/*-------------------------------*/
// DATABASE
//   Put this in separate file
/*-------------------------------*/
/*Require Main dbase Models*/
// var Campground = require("./models/campground"),
//     Comment = require("./models/comment");

// Build the connection string 
//var dbURI = 'mongodb://localhost/yelpcamp-v' + serverVersion;


// Create the database connection
mongoose.connect(dbURI);

//***** CONNECTION EVENTS 
// When successfully connected...
mongoose.connection.on('connected', function() {
    console.log('Mongoose default connection open...');
});

// If the connection throws an error
mongoose.connection.on('error', function(err) {
    console.log('Mongoose default connection error: ' + err);

});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose default connection disconnected');
});

/*Test data setup*/

if (createTestData) {
    //given to us by requiring seeds file
    seedDB();
}

/*-------------------------------*/
// SETUP ROUTES
/*-------------------------------*/
/*Add in our ROUTES via Express Router
  Had some trouble with these. They need to go after
  the passport intitializations.  specifically I had trouble with 
  the res.locals.userLoggedIn middle ware I create above.
*/
app.use(indexRoutes);
app.use(campGroundRoutes);
app.use(commentRoutes);

// INITIALIZE SERVER
/*-------------------------------*/
/*-------------------------------*/
/* Cloud9 specific settings 
   https://udemy-webdevbootcamp-dderocher.c9users.io
	process.env.PORT, process.env.IP,
*/

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Version: " + serverVersion + " of Yelp Camp server has started...");
});
