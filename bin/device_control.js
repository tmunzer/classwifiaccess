var ssh = require('./ssh/ssh');
var Classroom = require("./../models/classroom");
var School = require("./../models/school");
var Device = require("./../models/device");

module.exports.disableWiFi = function (DeviceId, SchoolId, callback) {
    Classroom.findActiveByDevice(DeviceId, SchoolId, function (err, ret) {
        if (ret.length == 0) {
            Device.findById(DeviceId, null, function (err, device) {
                if (err) callback(err);
                School.findById(SchoolId, null, function (err, school) {
                    if (err) callback(err);
                    //TODO sent a error message telling SSH is not configured for this school
                    else if (school == null) callback(null);
                    else try {
                            ssh.execute(device.ip, ['disableWiFi'], school.sshAdmin, school.sshPassword, function (err) {
                                callback(err)
                            });
                        } catch (e) {
                            callback(e);
                        }
                });
            })
        } else {
            callback(null);
        }
    })
};
module.exports.enableWiFi = function (DeviceId, SchoolId, callback) {
    Device.findById(DeviceId, null, function (err, device) {
        if (err) callback(err);
        School.findById(SchoolId, null, function (err, school) {
            if (err) callback(err);
            //TODO sent a error message telling SSH is not configured for this school
            else if (school == null) callback(null);
            else try {
                    ssh.execute(device.ip, ['enableWiFi'], school.sshAdmin, school.sshPassword, function (err) {
                        callback(err)
                    });
                } catch (e) {
                    callback(e);
                }
        });
    });
};