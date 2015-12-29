var apiDev = require(appRoot + "/bin/ah_api/req_dev").dev;
var Api = require(appRoot + "/models/api");
var School = require(appRoot + "/models/school");
var SSH = require(appRoot + "/bin/ssh/ssh");

module.exports = function (router, isAuthenticated, isAdmin) {
    /* GET Dev tools */

    router.get("/dev/", isAuthenticated, isAdmin, function (req, res, next) {
        if (req.query.hasOwnProperty("ssh")){
            SSH.test();
        } else {
        Api.findAll({SchoolId: req.session.SchoolId}, null, function (err, apiList) {
            School.getAll(null, function (err, schoolList) {
                var apiSecret = Api.getSecret();
                var apiClientId = Api.getClientId();
                res.render('dev', {
                    user: req.user,
                    current_page: 'dev',
                    session: req.session,
                    apiSecret: apiSecret,
                    apiClientId: apiClientId,
                    schoolList: schoolList,
                    apiList: apiList,
                    user_button: req.translationFile.user_button
                })
            });
        });
        }
    })
        .post("/dev/", isAuthenticated, isAdmin, function (req, res, next) {
            var api_req = req.body.api_req;
            var api_uri = req.body.api_uri;
            Api.findAll({SchoolId: req.session.SchoolId}, null, function (err, apiList) {
                School.getAll(null, function (err, schoolList) {
                    Api.findById(api_req, null, null, function (err, api) {
                        if (api) {
                            apiDev(api, api_uri, function (err, result) {
                                if (err) {
                                    res.render("apiError", {
                                        current_page: 'device',
                                        err: err,
                                        user: req.user,
                                        session: req.session,
                                        schoolList: schoolList
                                    });
                                } else {
                                    res.send(result);
                                }
                            });
                        }
                    });
                });
            });
        });
};
