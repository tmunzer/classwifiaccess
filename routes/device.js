var User = require("./../models/user");
var apiReq = require('./../bin/ah_api/req_device');
var Api = require("./../models/api");
var School = require("./../models/school");
var Error = require('./error');

sortDevices = function (deviceA, deviceB) {
    var a = deviceA.hostName.toLowerCase();
    var b = deviceB.hostName.toLowerCase();
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else {
        return 0;
    }
};

module.exports = function (router, isAuthenticated, isAdmin) {
    /* GET Home Page */
    router.get('/device/', isAuthenticated, isAdmin, function (req, res, next) {
        School.getAll(null, function (err, schoolList) {
            if (err){
                Error.render(err, "device", req);
            } else {
                Api.findAll({SchoolId: req.session.SchoolId}, null, function (err, apiList) {
                    if (err){
                        Error.render(err, "device", req);
                    } else if (apiList) {
                        var apiNum = 0;
                        var deviceList = [];
                        for (var i = 0; i < apiList.length; i++) {
                            apiReq.getDevices(apiList[i], function (err, devices) {
                                if (err) {
                                    Error.render(err, "device", req);
                                } else {
                                    deviceList = deviceList.concat(devices);
                                    apiNum++;
                                    if (apiNum == apiList.length) {
                                        deviceList.sort(sortDevices);
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
                            current_page: 'device',
                            session: req.session,
                            schoolList: schoolList,
                            user_button: req.translationFile.user_button
                        });
                    }
                });
            }
        });
    });
};


