var ssh = require('./ssh/ssh');
var Classroom = require("./../models/classroom");
var Device = require("./../models/device");

module.exports.disableWiFi = function(DeviceId, SchoolId, callback){
    Classroom.findActiveByDevice(DeviceId, SchoolId, function(err, ret){
        if (ret.length == 0){
            Device.findById(DeviceId, null, function(err, device){
                try {
                    ssh.execute(device.ip, ['disableWiFi'], function(err){
                        callback(err)
                    });
                } catch (e) {
                    callback(e);
                }
            })
        } else {
            callback(null);
        }
    })
};
module.exports.enableWiFi = function(DeviceId, callback){
    Device.findById(DeviceId, null, function(err, device) {
        try {
            ssh.execute(device.ip, ['enableWiFi'], function(err){
                callback(err)
            });
        } catch (e) {
            callback(e);
        }
    });
};