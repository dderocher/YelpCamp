/* Auto create some test data...*/

var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user");


var passport = require("passport");

/* can do one at a time or pass in array*/
var campgroundTestData = [{
    name: "Salmon Creek",
    image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
    description: "Sushi! Watch out for the bears! ",
 }, {
    name: "Granite Hill",
    image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
    description: "Granite as far as the eye can see"
}, {
    name: "Mountain Goat's Rest",
    image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg",
    description: "Lots of Goat Cheese posibilites... -          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta, obcaecati officia consequatur libero commodi esse veniam placeat voluptates fugit repudiandae reiciendis quaerat dignissimos minima voluptatem magnam doloribus illo assumenda reprehenderit.   "
}, {
    name: 'Abol',
    image: 'http://haulihuvila.com/wp-content/uploads/2012/09/hauli-huvila-campgrounds-lg.jpg',
    description: 'Abol Campground, just outside of Baxter State Park -          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta, obcaecati officia consequatur libero commodi esse veniam placeat voluptates fugit repudiandae reiciendis quaerat dignissimos minima voluptatem magnam doloribus illo assumenda reprehenderit.   '
}];


var commentTestData = [{
        text: "Test Comment 1",
        author: "Shazam"
    }, {
        text: "Test Comment 2",
        author: "Shazam"
    }, {
        text: "Test Comment 3",
        author: "Shazam"
    }, {
        text: "Test Comment 4",
        author: "Shazam"
    }

];

/* Todo:  Rewrite this with promises to see if we can get away with all the nutty
nesting...

*/
function seedDB() {
    Campground.remove({}, function(err) {

            if (err) {
                console.log(err);
            }
            else {

                console.log("Removed all CampGround Data...");

                Comment.remove({}, function(err) {
                        if (err) {
                            console.log(err);
                        }
                        else {

                            console.log("Removed all Comment Data...");

                            User.remove({}, function(err) {
                                if (err) {
                                    console.log(err);
                                }else {
                                    console.log("Removed all User Data...");
                                    populateDB();
                    
                                } //if (err)
                            }); //User.remove
                        }//if (err) 
                }); // Comment.remove
        }//if (err)
    }); //Campground.remove
} //function seedDB()

function populateDB() {

    Campground.create(campgroundTestData, function(err, savedCampgrounds) {
        if (err) {
            console.log("Error creating New Campground Data...");
            console.log(err);
        }
        else {
            console.log("SUCCESS creating New Campground Data...");
            //console.log(savedCampgrounds);

            Comment.create(commentTestData, function(err, savedComments) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("SUCCESS creating New Comment Data...");

                    assignComments(savedCampgrounds, savedComments);
                    
                    var newUser = createUser(savedCampgrounds, savedComments);
                    
                }
            });
        }
    });
}

function assignComments(campgrounds, comments) {

    for (var i = 0; i < campgrounds.length; i++) {
        campgrounds[i].comments.push(comments[i]);
        campgrounds[i].save(function(err, data) {
            if (err) {
                console.log(err);
                return;
            }
            
        });
    }
   
    console.log("SUCCESS - assigning comments to campgrounds");

}


function createUser(campgrounds, comments){
   var newUser = new User({username:'dave'});
   /* User.register()
        provided by userSchema.plugin(passportLocalMongoose)
        Creates a new user object but does not save to database
        Password is passed to second argument and a which creates a 'hash'
            It is the hash that is saved to the database.
    */
    User.register(newUser, 'dave', function(err, user) {
        if (err) {
            console.log(err);
            
            /*return here is nice way to just bail*/
            return undefined;
        } 
        
        console.log("SUCCESS creating New User Data...")
        
        return assignUser(user, campgrounds, comments);
    });
    
}

function assignUser(user, campgrounds, comments){
   
     var userInfo = {
        id: user._id,
        username: user.username
    };
    
    campgrounds.forEach(function(campground){
       
       campground.createdBy = userInfo; 
       campground.save(function(err) {
           if (err) {
               console.log('Error Assigning User to Campground: ' + err);
               return;
           }
       });
       
    });
    
    console.log("SUCCESS - assigning users to campgrounds");

    comments.forEach(function(comment){
       
       comment.author = userInfo; 
       comment.save(function(err) {
           if (err) {
               console.log('Error Assigning User to comments: ' + err);
               return;
           }
          
       });
       
    });
    
    console.log("SUCCESS - assigning users to comments");
    
}


module.exports = seedDB;
