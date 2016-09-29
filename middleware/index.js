//=========================
// MIDDLEWARE LOGIC 
//=========================
var Campground = require("../models/campground");
var Comment = require("../models/comment");




//=======================
// EXPRESS MIDDLEWARE
//=======================

/*  middleware follows the req,res,next pattern
    next() refers to the next argument in the calling function
       ie, the callback.
*/


/*Create empty object to contain our functions*/
var middlewareObject = {};

middlewareObject.checkCampgroundOwnership = function(req, res, next) {
    //Is User logged in?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundcampground) {
            if (err) {
                req.flash('error_messages','Error: Campground not found...');
                console.log("checkCampgroundOwnership Error: " + err);
                res.redirect("back");
            }
            else {
                /*NOTE:  req.user._id is a mongoose object
                        foundcampground.createdBy.id is a string
                        
                        therefore === will not work...
                        can use a mongoose method equals() to help out
                */

                if (foundcampground.createdBy.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash('error_messages','You are not the Campground Owner');
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash('error_messages','You must be logged in first');
        res.redirect("back");
    }
    //does user own the campground?
};

middlewareObject.checkCommentOwnership = function(req,res,next){
    //Is User logged in?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundcomment) {
            if (err) {
                 req.flash('error_messages','Error: Campground not found...');
                console.log("checkCommentOwnership Error: " + err);
                res.redirect("back");
            }
            else {
                /*NOTE:  req.user._id is a mongoose object
                        foundcampground.createdBy.id us a string
                        
                        therefore === will not work...
                        can use a mongoose method equals() to help out
                */

                if (foundcomment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                   req.flash('error_messages','You are not the Comment Owner');
                   res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash('error_messages','You must be logged in first');
        res.redirect("back");
    }

};

middlewareObject.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        /*this meand invoke the callback from
        the route invoking the middleware*/
        return next();
    }

    //otherwise...
    
    /* Put a message on the flash. this wont be displayed
    until next request(page). We use key/value pair.
    */
    req.flash("error_messages","Please Login First");
    res.redirect('/login');
};

module.exports = middlewareObject;