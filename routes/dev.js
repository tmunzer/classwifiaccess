var apiReq = require("./../bin/ah_api/req");
var Api = require("./../models/api");
var School = require("./../models/school");

module.exports = function (router, isAuthenticated, isAdmin) {
    /* GET Dev tools */

    router.get("/dev/", isAuthenticated, isAdmin, function (req, res, next) {
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
    })
        .post("/dev/", isAuthenticated, isAdmin, function (req, res, next) {
            var api_req = req.body.api_req;
            var api_uri = req.body.api_uri;
            Api.findAll({SchoolId: req.session.SchoolId}, null, function (err, apiList) {
                School.getAll(null, function (err, schoolList) {
                    Api.findById(api_req, null, function (err, api) {
                        if (api) {
                            apiReq.dev(api, api_uri, function (err, result) {
                                if (err) {
                                    res.render("apiError", {
                                        current_page: 'device',
                                        err: err,
                                        user: req.user,
                                        session: req.session,
                                        schoolList: schools,
                                    });
                                } else {
                                    console.log(result);
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
                                        user_button: req.translationFile.user_button,
                                        api_req: api_req,
                                        api_uri: api_uri,
                                        result: result
                                    })
                                }
                            });
                        }
                    });
                });
            });
        });
};
