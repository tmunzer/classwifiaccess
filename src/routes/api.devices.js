const express = require('express');
const router = express.Router();
const Device = require("../bin/models/device");
const Account = require("../bin/models/account");

//===============================================================//
//============================ devices ===========================//
//===============================================================//
router.get('/', function (req, res, next) {
    if (req.session.passport) {
        var filterString;
        //if user is not an admin (only admin can view all schools)
        if (req.session.passport.user.GroupId.value > 1) filterString = { SchoolId: req.session.passport.user.SchoolId };
        // else if request is filtered on a school
        else if (req.query.schoolId && req.query.schoolId > 1) filterString = { SchoolId: req.query.schoolId };

        Account.find(filterString, function (err, accounts) {
            if (err) res.json({ error: err });
            else if (accounts) {
                var apiNum = 0;
                var deviceList = [];
                accounts.forEach(function (account) {
                    Device.refresh(account, function (err, devices) {
                        if (err) callback(err);
                        else {
                            deviceList = deviceList.concat(devices);
                            apiNum++;
                            if (apiNum == accounts.length) {
                                res.json({ devices: deviceList });
                            }
                        }
                    })
                })
            } else res.json({});
        })
    } else res.status(403).send('Unknown session');
});

module.exports = router;