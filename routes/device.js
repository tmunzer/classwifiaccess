var User = require("./../models/user");
var apiReq = require('./../bin/ah_api/req_device');
var Api = require("./../models/api");
var School = require("./../models/school");

module.exports = function (router, isAuthenticated, isAdmin) {
    /* GET Home Page */
    router.get('/device/', isAuthenticated, isAdmin, function (req, res, next) {
        School.getAll(null, function (err, schoolList) {
            Api.findAll({SchoolId: req.session.SchoolId}, null, function (err, apiList) {
                 if (apiList){
                    var apiNum = 0;
                    var deviceList = [];
                    for (var i = 0; i < apiList.length; i++) {
                        apiReq.getDevices(apiList[i], function (err, devices) {
                            if (err) {
                                res.render("apiError", {
                                    current_page:'device',
                                    err: err,
                                    user: req.user,
                                    session: req.session,
                                    schoolList: schoolList
                                });
                            } else {
                                deviceList = deviceList.concat(devices);
                                apiNum++;
                                if (apiNum == apiList.length) {
                                    res.render('device', {
                                        current_page: 'device',
                                        deviceList: deviceList,
                                        user: req.user,
                                        session: req.session,
                                        schoolList: schoolList,
                                        user_button: req.translationFile.user_button
                                    });
                                }
                            }
                        }.bind(this));
                    }
                } else {
                    res.render('device', {
                        deviceList: null,
                        user: req.user,
                        current_page:'device',
                        session: req.session,
                        schoolList: schoolList,
                        user_button: req.translationFile.user_button
                    });
                }
            });
        });
    });
};


