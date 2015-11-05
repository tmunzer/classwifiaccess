var User = require("./../models/user");
var translate = require('./../translate/translate');
var api = require('./../bin/ah_api/req');

module.exports = function(router, isAuthenticated){
    /* GET Home Page */
    router.get('/device/', isAuthenticated, function(req, res) {
        User.findById(req.query.id, null, function (err, user) {
            translate(user, req, function (translationFile) {
                api.getDevices();
                res.render('device', {user: req.user, user_button: translationFile.user_button});
            });
        });
    });
};


