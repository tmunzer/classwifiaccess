var express = require('express');
var router = express.Router();
var Account = require("../bin/models/account");
var Device = require("../bin/models/device");

//===============================================================//
//============================ settings API===========================//
//===============================================================//
function removeDevicesWhenApiIsUnasigned(api, callback) {
    console.info("\x1b[32minfo\x1b[0m:","Removing devices linked to VHM " + api.vhmId);
    Device.find({accountId: api._id}, function (err, devices) {
        if (err) callback(err);
        else if (devices == null) callback(null);
        else {
            var deviceNum = 0;
            var errors = [];
            for (var i = 0; i < devices.length; i++) {
                Device.remove({_id: devices[i]._id}, function (err) {
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

//========================== GET API ===========================//
router.get("/", function (req, res, next) {
    if (req.session.passport) {
        var filterString;
        //if user is not an admin (only admin can view all schools)
        if (req.session.passport.user.GroupId.value > 1) filterString = {SchoolId: req.session.passport.user.SchoolId};
        // else if request is filtered on a school
        else if (req.query.schoolId && req.query.schoolId > 1) filterString = {SchoolId: req.query.schoolId};
        Account.find(filterString, function (err, accounts) {
            if (err) res.json({error: err});
            else res.json({apis: accounts});
        });
    } else res.status(403).send('Unknown session');
});
//========================== DELETE API ===========================//
router.delete('/', function (req, res) {
    if (req.session.passport) {
        if (req.query.id) {
            var accountId = req.query.id;
            Account.remove({_id: accountId}, function (err) {
                if (err) res.json({error: err});
                else res.json({});
            })
        }
    } else res.status(403).send('Unknown session');
});
//========================== UPDATE API ===========================//
//===   Called when a API configuration is assigned to a School ===//
router.put("/", function (req, res, next) {
    if (req.session.passport) {
        var accountIdToEdit = req.query.id;
        Account.findById(accountIdToEdit, function (err, accountFromDB) {
            if (err) res.json({error: err});
            else {
                var apiSerializer = JSON.parse(JSON.stringify(accountFromDB));
                if (apiSerializer.api.SchoolId == 1) apiSerializer.api.SchoolId = "";
                apiSerializer.api.SchoolId = req.query.schoolId;
                // update the user
                Account.update({_id: accountIdToEdit}, {$set: apiSerializer}, function (err, account) {
                    // If error
                    if (err) res.json({error: err});
                    // If the API is assigned to a new School
                    else if (apiSerializer.api.SchoolId) {
                        // Removing all the devices linked to this API and assigned to this school
                        removeDevicesWhenApiIsUnasigned(accountFromDB, function (err) {
                            if (err) res.json({error: err});
                            else {
                                // Retrieve the devices linked to this API and assigned them to the new school
                                console.info("\x1b[32minfo\x1b[0m:","Retrieving devices linked to VHM " + accountFromDB.vhmId);
                                Device.refresh(function(err, result){
                                    if (err) res.status(500).json({error: err});
                                    else res.json({});
                                });
                            }
                        });
                    } else {
                        // Removing all the devices linked to this API and assigned to this school
                        removeDevicesWhenApiIsUnasigned(accountFromDB, function (err) {
                                if (err) res.json({error: err});
                                else res.json({});
                            }
                        )
                    }
                });
            }
        });
    } else res.status(403).send('Unknown session');
});

module.exports = router;