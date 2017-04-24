const mongoose = require('mongoose');

const Api = require("../aerohive/api/main");
const devAccount = require("./../../config").devAccount;
const Account = require('./account');

const DeviceSchema = new mongoose.Schema({
    accountId: {type: mongoose.Schema.ObjectId, ref:"Account", required: true },
    macAddress: { type: String, required: true },
    hostName: { type: String, required: true },
    serialId: { type: String, required: true },
    model: { type: String, required: true },
    ip: { type: String, required: true },
    simType: { type: String, required: true },
    locations: { type: String, required: true },
    connected: { type: String, required: true },
    created_at: { type: Date },
    updated_at: { type: Date }
});


const Device = mongoose.model('Device', DeviceSchema);
Device.prototype.refresh = function (api, callback) {
    // send the API request
    Api.monitor.devices.devices(api, devAccount, function (err, result) {
        if (err) {
            callback(err, result);
        }
        else if (result) {
            var devicesFromAPI = result.data;
            var deviceList = [];
            var processed = 0;

            // remove devices no more present
            this.findAll({ SchoolId: api.SchoolId }, null, function (err, devices) {
                if (devices) {
                    devices.forEach(function (device) {
                        var isPresent = false;
                        devicesFromAPI.forEach(function (deviceFromAPI) {
                            if (device.id == deviceFromAPI.deviceId) isPresent = true;
                        });
                        if (!isPresent) Device.find({ accountId: device.id }, function (err) {
                            if (err) console.log(err);
                        })
                    });
                }

                // for each device from the API response
                devicesFromAPI.forEach(function (device) {
                    device.SchoolId = api.SchoolId;
                    device.ApiId = api.id;
                    this.findOne({ serialId: device.serialId }, function (err, deviceToDB) {
                        if (deviceToDB)
                            this.update({ _id: deviceToDB._id }, { $set: device }, function (err) {
                                deviceList.push(this.device);
                                processed++;
                                if (processed == devicesFromAPI.length) {
                                    callback(null, deviceList)
                                }
                            });
                        else {
                            this(device).save(function (err) {
                                deviceList.push(device);
                                processed++;
                                if (processed == devicesFromAPI.length) {
                                    callback(null, deviceList)
                                }
                            });
                        }
                    });
                })
            });
        } else callback(null, []);
    })
};

// Pre save
DeviceSchema.pre('save', function (next) {
    const now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

module.exports = Device;


