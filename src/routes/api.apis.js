var express = require('express');
var router = express.Router();
var api = require('../bin/ah_api/req');
var apiReq = require('../bin/ah_api/req_device');
var Api = require("../bin/models/account");
var Device = require("../bin/models/device");

//===============================================================//
//============================ settings API===========================//
//===============================================================//
function removeDevicesWhenApiIsUnasigned(api, callback) {
    console.info("\x1b[32minfo\x1b[0m:","Removing devices linked to VHM " + api.vhmId);
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

//========================== GET API ===========================//
router.get("/", function (req, res, next) {
    if (req.session.passport) {
        var filterString;
        //if user is not an admin (only admin can view all schools)
        if (req.session.passport.user.GroupId > 1) filterString = {SchoolId: req.session.passport.user.SchoolId};
        // else if request is filtered on a school
        else if (req.query.schoolId && req.query.schoolId > 1) filterString = {SchoolId: req.query.schoolId};
        Api.findAll(filterString, null, function (err, apis) {
            if (err) res.json({error: err});
            else res.json({apis: apis});
        });
    } else res.status(403).send('Unknown session');
});
//========================== DELETE API ===========================//
router.delete('/', function (req, res) {
    if (req.session.passport) {
        if (req.query.id) {
            var apiId = req.query.id;
            Api.deleteById(apiId, function (err) {
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
        var apiIdToEdit = req.query.id;
        Api.findById(apiIdToEdit, null, null, function (err, apiFromDB) {
            if (err) res.json({error: err});
            else {
                var apiSerializer = new Api.ApiSerializer(apiFromDB);
                if (apiSerializer.api.SchoolId == 1) apiSerializer.api.SchoolId = "";
                apiSerializer.api.SchoolId = req.query.schoolId;
                // update the user
                apiSerializer.updateDB(apiIdToEdit, function (err) {
                    // If error
                    if (err) res.json({error: err});
                    // If the API is assigned to a new School
                    else if (apiSerializer.api.SchoolId > 1) {
                        // Removing all the devices linked to this API and assigned to this school
                        removeDevicesWhenApiIsUnasigned(apiFromDB, function (err) {
                            if (err) res.json({error: err});
                            else {
                                // Retrieve the devices linked to this API and assigned them to the new school
                                console.info("\x1b[32minfo\x1b[0m:","Retrieving devices linked to VHM " + apiFromDB.vhmId);
                                apiReq.getDevices(apiFromDB, function (err) {
                                    if (err) res.json({error: err});
                                    else res.json({});
                                });
                            }
                        });
                    } else {
                        // Removing all the devices linked to this API and assigned to this school
                        removeDevicesWhenApiIsUnasigned(apiFromDB, function (err) {
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