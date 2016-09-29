var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require('../models/user');



/*Root Path - Landing Page*/
router.get("/", function(req, res) {
    //res.send('hello - you made it...');
    res.render("landing");
})



//=========================
// Authentication routes
//=========================

/*Register Routes*/
router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', function(req, res) {

    var newUser = new User({
        username: req.body.username
    });
    /* User.register()
         provided by userSchema.plugin(passportLocalMongoose)
         Creates a new user object but does not save to database
         Password is passed to second argument and a which creates a 'hash'
             It is the hash that is saved to the database.
     */
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            req.flash('error_messages', err.message);
            /*return here is nice way to just bail*/
            return res.redirect('register');
        }

        console.log(user);
        passport.authenticate('local')(req, res, function() {
            req.flash('success_messages', 'Welcome ' + user.username);
            res.redirect('/');
        });
    });
});

/*Login Routes*/

//show login form
router.get("/login", function(req, res) {
    res.render('login');
});

// perform actual login using passport.authenticate MIDDLEWARE

/*
Login route needs to implement flash message.  I called passport.authenticate 
 a little differently in this route, so need to figure out how to detect 
 error success.  Good link here to work with:  
    http://passportjs.org/docs
*/
router.post('/login', passport.authenticate('local', {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }),
    function(req, res) {
        //console.log(req.body.username);
    });

/*Logout Routes*/
router.get('/logout', function(req, res) {
    req.logout();
    req.flash("success_messages", "Logged You Out!");
    res.redirect('/campgrounds');
});



//=======================
// EXPRESS MIDDLEWARE
//=======================

/*  middleware follows the req,res,next pattern
    next() refers to the next argument in the calling function
       ie, the callback.
*/

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        /*this meand invoke the callback from
        the route invoking the middleware*/
        return next();
    }

    //otherwise...
    res.redirect('/login');
}


module.exports = router;