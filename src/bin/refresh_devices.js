
var Api = require("../bin/models/api");

var apiReq = require('../bin/ah_api/req_device');


module.exports = function refreshDevices(filterString, callback) {
    Api.findAll(filterString, null, function (err, apiList) {
        if (err) {
            callback(err);
        } else if (apiList) {
            var apiNum = 0;
            var deviceList = [];
            for (var i = 0; i < apiList.length; i++) {
                // Update the Device information for devices (request to ALL configured API for this school)
                apiReq.getDevices(apiList[i], function (err, devices) {
                    if (err) {
                        callback(err);
                    } else {
                        deviceList = deviceList.concat(devices);
                        apiNum++;
                        if (apiNum == apiList.length) {
                            callback();
                        }
                    }
                }.bind(this));
            }
        } else {
            callback();
        }
    });
}
