var ssh = require('./ssh/ssh');
var Classroom = require("./../models/classroom");
var Device = require("./../models/device");

module.exports.disableWiFi = function(DeviceId, SchoolId){
    Classroom.findActiveByDevice(DeviceId, SchoolId, function(err, ret){
        if (ret.length == 0){
            Device.findById(DeviceId, null, function(err, device){
                ssh.execute(device.ip, ['disableWiFi']);
            })
        }
    })
};
module.exports.enableWiFi = function(DeviceId){
    Device.findById(DeviceId, null, function(err, device) {
        ssh.execute(device.ip, ['enableWiFi']);
    });
};