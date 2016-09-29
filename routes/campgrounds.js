//=========================
// Campground routes
//=========================

var express = require("express");
var router = express.Router();

var Campground = require('../models/campground');
var Comment = require('../models/comment');

/* Any directory you require will automatically include 
  a index.js file if present, So you don’t have to specify 
  index here...
*/
var middleware = require('../middleware');

/*Route Parameters 
  this allows a specific pattern to be routed
  in this example the pattern is /r/ followed by a variable.
  
  example:  www.somewebsite/r/someparameter.
*/


/**
 * Camp Grounds Routing
 *
 */

// INDEX Restful Route - view all campgrounds
router.get("/campgrounds", function(req, res) {

    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log("Error!: " + err);
        }
        else {
            res.render("campgrounds/index", {
                campgrounds: campgrounds
            });
            //console.log(campgrounds);
        }
    });
});

//NEW Restful form route
// display form page to add a new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//CREATE restful route
// Create a new camp ground and redirect
router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {


    // Get Data From form and add to campgrounds data
    // var newCampName = req.body.campname;
    // var newImageUrl = req.body.imageurl;
    // var newDescription = req.body.description;

    // Wrap it up into a nice ojbect
    // var newCampground = {
    //         name: newCampName,
    //         image: newImageUrl,
    //         description: newDescription
    //     };
    //campgrounds.push({name:campName, image:imageUrl});

    // Create new campground object
    var newCampground = new Campground();

    var userInfo = {
        id: req.user._id,
        username: req.user.username
    };

    // Get Data From form and add to campgrounds data
    newCampground.name = req.body.campname;
    newCampground.image = req.body.imageurl;
    newCampground.description = req.body.description;
    newCampground.createdBy = userInfo;

    Campground.create(newCampground, function(err, campground) {
        if (err) {
            console.log("ERROR! : " + err);
        }
        else {
            console.log("Campground Create SUCCESS ! : " + campground);
        }
    });

    //Re-direct back to campgrounds page - default is get
    res.redirect("/campgrounds");
});


//SHOW restful route
/* Be careful of your route order here. If /:id is first, then it would
   override the /new route...
*/
router.get("/campgrounds/:id", function(req, res) {

    var id = req.params.id;

    //find campground with passed in ID
    /*  Had trouble here doing a find({_id:id}).  finds it but ejs has a
        problem passing the object via render.
     */
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundcampground) {
        if (err) {
            console.log("Error! : " + err);
        }
        else {
            //console.log("Found Campgrounds: " + foundcampground);
            //check here to see if actually found...
            var isOwner = false;
            
            if (req.isAuthenticated()){
                isOwner = foundcampground.createdBy.id.equals(req.user._id);
            }
           
            res.render("campgrounds/show", {
                campground: foundcampground,
                isOwner: isOwner
            });
        }
    });
    //Rendern Show template with the matching campground
});


/*EDIT CAMPGROUND ROUTE*/
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {

    Campground.findById(req.params.id, function(err, foundcampground) {
        if (err) {
            console.log("Campground Edit Route Error: " + err);
            res.redirect("back");
        }
        else {
            res.render("campgrounds/edit", {
                campground: foundcampground
            });
        }
    });
});

/*UPDATE CAMPGROUND ROUTE*/
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {

    Campground.findByIdAndUpdate(req.params.id, req.body.edit_campground,
        function(err, updatedCampground) {
            if (err) {
                console.log("Campground PUT Route Error: " + err);
                res.redirect("/campgrounds");
            }
            else {
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
});

/*DELETE CAMPGROUND ROUTE*/
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {

    Campground.findByIdAndRemove(req.params.id, function(err, removedCampground) {
        if (err) {
            console.log("DELETE ROUTE ERROR: " + err);
            //res.redirect()
        }
        else {
            removedCampground.comments.forEach(function(comment) {
                Comment.findByIdAndRemove(comment, function(err, data) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("success" + data);

                    }
                });
            });

        }
        //console.log("Deleted Campground: " + removedCampground);
        res.redirect("/campgrounds");
    });

});


module.exports = router;