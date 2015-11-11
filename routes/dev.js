var apiReq = require("./../bin/ah_api/req");
var api = require("./../models/api");

module.exports = function(router, isAuthenticated){
    /* GET Dev tools */

    router.get("/dev/", isAuthenticated, function(req, res, next) {
        if (req.session.isAdmin) {
            api.getAll(null, function(err, apis){
                var apiSecret = api.getSecret();
                var apiClientId = api.getClientId();
                console.log(apiSecret);
                console.log(apiClientId);
                res.render('dev', {
                    user: req.user,
                    session: req.session,
                    apiSecret: apiSecret,
                    apiClientId: apiClientId,
                    apis: apis,
                    user_button: req.translationFile.user_button
                })
            });
        }
    })
        .get("/dev/req", isAuthenticated, function(req, res, next){
        if (req.isAdmin) {
            var api_req = req.query.api_req;
            var api_uri = req.query.api_uri;
            api.findById(api_req, null, function(err, res) {

                })
        }
    })
};
