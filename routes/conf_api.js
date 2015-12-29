var Api = require(appRoot + "/models/api");
var Error = require(appRoot + '/routes/error');
var apiReq = require(appRoot + '/bin/ah_api/req_device');
var Device = require(appRoot + "/models/device");
var logger = require(appRoot + "/app").logger;

function removeDevicesWhenApiIsUnasigned(api, callback) {
    logger.warn("Removing devices linked to VHM " + api.vhmId);
    Device.findAll({ApiId: api.id}, null, function (err, devices) {
        if (err) callback(err);
        else if (devices == null) callback(null);
        else {
            var deviceNum = 0;
            var errors = [];
            for (var i = 0; i < devices.length; i++) {
                Device.deleteById(devices[i].id, function (err) {
                    deviceNum++;
                    if (err) errors.push(err);
                    if (deviceNum == devices.length) {
                        if (errors.length > 0) callback(errors);
                        else callback(null);
                    }
                })
            }
        }
    });
}


module.exports = function (router, isAuthenticated, isAdmin) {
    //===============================================================//
    //============================ ROUTES ===========================//
    //===============================================================//

    //========================== LIST API ===========================//
    router.get('/conf/api/reg', isAuthenticated, isAdmin, function (req, res) {
        if (req.query.hasOwnProperty('error')) {
            Error.render(err, "conf", req, res);
        } else {
            var authCode = req.query.authCode;
            var api = new Api();
            api.registerApp(authCode, function (apiDataString) {
                if (apiDataString) {
                    var apiDataJSON = JSON.parse(apiDataString);
                    if (apiDataJSON.hasOwnProperty("data")) {
                        for (var owner in apiDataJSON.data) {
                            var apiReg = new Api.ApiSerializer(apiDataJSON.data[owner]);
                            apiReg.SchoolId = 1;
                            apiReg.insertDB(function (err) {
                                if (err) {
                                    Error.render(err, "conf", req, res);
                                } else {
                                    res.redirect('/conf');
                                }
                            });
                        }
                    } else if (apiDataJSON.hasOwnProperty('error')) {
                        var apiError = new Api.ApiErrorSerializer(apiDataJSON.error);
                        Error.render(apiError, "conf", req);
                    }
                } else {
                    Error.render(err, "conf", req, res);
                }
            });
        }
    });

    //========================== DELETE API ===========================//
    router.get('/conf/api/delete', isAuthenticated, isAdmin, function (req, res) {
        if (req.query.hasOwnProperty("id")) {
            var apiId = req.query.id;
            Api.deleteById(apiId, function () {
                res.redirect("/conf");
            })

        }
    });

    //========================== UPDATE API ===========================//
    //===   Called when a API configuration is assigned to a School ===//
    router.post("/conf/api/update", isAuthenticated, isAdmin, function (req, res, next) {
        var apiIdToEdit = req.query.id;
        Api.findById(apiIdToEdit, null, null, function (err, apiFromDB) {
            if (err) {
                Error.render(err, "conf", req, res);
            } else {
                var apiSerializer = new Api.ApiSerializer(apiFromDB);
                if (apiSerializer.api.SchoolId == 1) apiSerializer.api.SchoolId = "";
                apiSerializer.api.SchoolId = req.body.SchoolId;
                // update the user
                apiSerializer.updateDB(apiIdToEdit, function (err) {
                    // If error
                    if (err) Error.render(err, "conf", req, res);
                    // If the API is assigned to a new School
                    else if (apiSerializer.api.SchoolId > 1) {
                        // Removing all the devices linked to this API and assigned to this school
                        removeDevicesWhenApiIsUnasigned(apiFromDB, function (err) {
                            if (err) Error.render(err, "conf", req, res);
                            else {
                                // Retrieve the devices linked to this API and assigned them to the new school
                                logger.warn("Retrieving devices linked to VHM " + apiFromDB.vhmId);
                                apiReq.getDevices(apiFromDB, function (err) {
                                    if (err) Error.render(err, "conf", req, res);
                                    else res.redirect('/conf');
                                });
                            }
                        });
                    } else {
                        // Removing all the devices linked to this API and assigned to this school
                        removeDevicesWhenApiIsUnasigned(apiFromDB, function (err) {
                                if (err) Error.render(err, "conf", req, res);
                                else res.redirect("/conf/")
                            }
                        )
                    }
                });
            }
        });
    });
};