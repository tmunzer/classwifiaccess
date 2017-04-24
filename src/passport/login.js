var LocalStrategy = require('passport-local').Strategy;
var User = require(appRoot + '/bin/models/user');
var bCrypt = require('bcryptjs');
var logger = require(appRoot + "/app").logger;

module.exports = function(passport){

    passport.use('login', new LocalStrategy({
                passReqToCallback : true
            },
            function(req, username, password, done) {
                // check in mongo if a user with username exists or not
                User.findOneForLogin({ 'username' :  username }, null,
                    function(err, user) {
                        // In case of any error, return using the done method
                        if (err)
                            return done(err);
                        // Username does not exist, log the error and redirect back
                        if ((!user) || (!isValidPassword(user, password))) {
                            logger.warn("User "+ username + ': Wrong login or password');
                            return done(null, false, req.flash('message', "error_login_password"));
                        }
                        if (user.userEnable == "false") {
                            logger.warn("User " + username + ": User disabled");
                            return done(null, false, req.flash("message", "error_login_password"));
                        }
                        // User and password both match, return user from done method
                        // which will be treated like success
                        logger.info("User " + user.username + " is now logged in");
                        User.newLogin(user.id, function (err) {
                            if (err) {
                                console.log(err);
                                return done(err);
                            }
                            else {
                                return done(null, user);
                            }
                        })
                    }
                );

            })
    );


    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }

};
