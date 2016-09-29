/*-------------------------------*/
//       COMMENT ROUTES
/*-------------------------------*/

var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var Comment = require("../models/comment");

/* Any directory you require will automatically include 
  a index.js file if present, So you don’t have to specify 
  index here...
*/
var middleware = require('../middleware');


//=========================
// Comment routes
//=========================

//NEW ROUTE
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {

    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", {
                campground: foundCampground
            });
        }
    });
});

//CREATE
router.post("/campgrounds/:id/comments/", middleware.isLoggedIn, function(req, res) {

    /*We must be loggind in if we get to this point due to isLoggedIn Middlware
      which means we have access to req.user via 
        express-session and passport-local 
    */
    // var newComment = {
    //     text: req.body.comment.text,
    //     author: {
    //         id: req.user._id,
    //         username: req.user.username
    //     }
    // };

    var newComment = new Comment();
    newComment.text = req.body.comment.text;
    newComment.author.id = req.user._id;
    newComment.author.username = req.user.username;

    Comment.create(newComment, function(err, savedComment) {
        if (err) {
            console.log("Error in Comment Create: " + err);
            res.send(err);
        }
        else {
            Campground.findByIdAndUpdate(req.params.id, {
                $push: {
                    comments: savedComment
                }
            }, function(err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    //console.log(data);
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

/*EDIT COMMENTS ROUTE*/
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {

    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log("Edit COMMENTS ROUTE Error finding campground: " + err);
            res.redirect("back");
        }
        else {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if (err) {
                    console.log("Edit COMMENTS ROUTE Error finding comment: " + err);
                    res.redirect("back");
                }
                else {
                    res.render("comments/edit", {
                        campground: foundCampground,
                        comment: foundComment
                    });
                }
            });
        }
    });

});

/*UPDATE COMMENT ROUTE*/
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            console.log("PUT COMMENTS ROUTE Error finding updating comment: " + err);
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });

});

/* DELETE COMMENT ROUTE */
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {

    Comment.findByIdAndRemove(req.params.comment_id, function(err, data) {
        if (err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            //console.log("success" + data);
            req.flash('error_messages','Comment Deleted');
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;