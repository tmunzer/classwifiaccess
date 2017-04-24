var express = require('express');
var router = express.Router();

var apiReq = require('../bin/ah_api/req_device');
var Api = require("../bin/models/account");



//===============================================================//
//============================ devices ===========================//
//===============================================================//
router.get('/', function (req, res, next) {
    if (req.session.passport) {
        var filterString;
        //if user is not an admin (only admin can view all schools)
        if (req.session.passport.user.GroupId > 1) filterString = {SchoolId: req.session.passport.user.SchoolId};
        // else if request is filtered on a school
        else if (req.query.schoolId && req.query.schoolId > 1) filterString = {SchoolId: req.query.schoolId};

        Api.findAll(filterString, null, function (err, apiList) {
            if (err) res.json({error: err});
            else if (apiList) {
                var apiNum = 0;
                var deviceList = [];
                for (var i = 0; i < apiList.length; i++) {
                    apiReq.getDevices(apiList[i], function (err, devices) {
                        if (err) res.json({error: err});
                        else {
                            deviceList = deviceList.concat(devices);
                            apiNum++;
                            if (apiNum == apiList.length) {
                                res.json({devices: deviceList});
                            }
                        }
                    }.bind(this));
                }
            } else {
                res.json({});
            }
        });
    } else res.status(403).send('Unknown session');
});

module.exports = router;