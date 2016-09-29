/*-------------------------------*/
//       USER MODEL
/*-------------------------------*/


var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

/*SCHEMA*/
var userSchema = mongoose.Schema({
   username: String,
   password: String
});

/*Add in necessary methods for our user in order to
  faciliate sessions/authentication
*/
userSchema.plugin(passportLocalMongoose);

/*MODEL*/
var User = mongoose.model("User",userSchema);

module.exports = User;