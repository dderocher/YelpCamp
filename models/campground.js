/*-------------------------------*/
//       CAMPGROUND MODEL
/*-------------------------------*/


var mongoose = require("mongoose");


/*SCHEMA*/
var campgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String,

    createdBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

/*MODEL*/
var Campground = mongoose.model("Campground", campgroundSchema);


module.exports = Campground;