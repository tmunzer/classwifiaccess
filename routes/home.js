var User = require("./../models/user");
var api = require('./../bin/ah_api/req');

module.exports = function(router, isAuthenticated, isAdmin, translationFile){
    /* GET Home Page */
    router.get('/home', isAuthenticated, isAdmin, translationFile, function(req, res) {
        User.findById(req.query.id, null, function (err, user) {
                res.render('index', {user: req.user, user_button: req.translationFile.user_button});
        });
    });
};


