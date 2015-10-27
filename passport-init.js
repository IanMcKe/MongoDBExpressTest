var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        //tell passport which id to use for user
        console.log('serializing user:', user.username);
        return done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {

        User.findById(id, function(err, user) {
          //if a user is found provide the user object back to passport
          console.log('deserializing user', user.username)
          return done(err, user);
        })
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {

            User.findOne({'username': username}, function(err, user) {
              if(err) {
                return done(err);
              }

              if(!user) {
                console.log('User not found with username' + username);
                return done(null, false);
              }

              if(!isValidPassword(user, password)){
                console.console.log('invalid password');
                return done(null, false);
              }

              console.log('successfully signed in');
              return done(null, user);
            })
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

          User.findOne({'username': username}, function(err, user){
            if(err) {
              console.log('Error with signup' +err);
              return done(err);
            }
            //check if user already exists
            if(user) {
              console.log('username already taken');
              return done(null, false);
            } else {

              //add user to db
                var newUser = new User();
                newUser.username = username;
                newUser.password = createHash(password);
                newUser.save(function(err) {
                  if(err){
                    console.log('Error in saving user:' + err);
                    throw err;
                  }
                  console.log('successfully signed up user ' + newUser.username);

                  return done(null, newUser);
                });
              }
          });
        })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};
