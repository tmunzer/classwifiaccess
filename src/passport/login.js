var LocalStrategy = require('passport-local').Strategy;
var User = require('../bin/models/user');
var bCrypt = require('bcryptjs');

module.exports = function (passport) {

    passport.use('login', new LocalStrategy({
        passReqToCallback: true
    },
        function (req, username, password, done) {
            // check in mongo if a user with username exists or not
            User.newLogin(username, password, function (err, user) {
                // In case of any error, return using the done method
                if (err)
                    return done(err);
                // Username does not exist, log the error and redirect back
                else if (!user) {
                    console.info("\x1b[32minfo\x1b[0m:", "User " + username + ': Wrong login or password');
                    return done(null, false, req.flash('message', "error_login_password"));
                }
                else if (user.userEnable == "false") {
                    console.info("\x1b[32minfo\x1b[0m:", "User " + username + ": User disabled");
                    return done(null, false, req.flash("message", "error_login_password"));
                }
                else return done(null, user);
            }
            );

        })
    );

};
