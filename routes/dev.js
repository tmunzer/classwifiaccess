var translate = require('./../translate/translate');
var apiReq = require("./../bin/ah_api/req");
var api = require("./../models/api");

module.exports = function(router, isAuthenticated){
    /* GET Dev tools */

    router.get("/dev/", isAuthenticated, function(req, res, next) {
        if (req.user.userGroup == 1) {
                translate(req.user.language, req, function (translationFile) {
                    api.getAll(null, function(err, apis){
                        var apiSecret = api.getSecret();
                        var apiClientId = api.getClientId();
                        console.log(apiSecret);
                        console.log(apiClientId);
                        res.render('dev', {
                            user: req.user,
                            apiSecret: apiSecret,
                            apiClientId: apiClientId,
                            apis: apis,
                            user_button: translationFile.user_button
                        })
                    })

                });
        }
    });
};
