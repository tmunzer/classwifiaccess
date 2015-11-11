var User = require("./../models/user");
var api = require('./../bin/ah_api/req');
var School = require('./../models/school');
module.exports = function(router, isAuthenticated){
    /* GET Home Page */
    router.get('/home', isAuthenticated, function(req, res) {
        User.findById(req.query.id, null, function (err, user) {
            School.getAll(null, function (err, schools) {
                res.render('index', {
                    user: req.user,
                    schoolList: schools,
                    session: req.session,
                    user_button: req.translationFile.user_button
                });
            });
        });
    });
};


