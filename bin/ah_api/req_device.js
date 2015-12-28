var apiRequest = require(appRoot + "/bin/ah_api/req").apiRequest;
var Device = require(appRoot + "/models/device");


module.exports.getDevices = function (api, callback) {

    var path = '/xapi/v1/monitor/devices?ownerId=#{ownerId}';

    // send the API request
    apiRequest(api, path, function (err, result) {
        if (err){
            callback(err, result);
        }
        else if (result){
            var devicesFromAPI = result.data;
            var deviceList = [];
            var processed = 0;

            // for each device from the API response
            for (var i = 0; i < devicesFromAPI.length; i++) {

                var device = devicesFromAPI[i];
                device.SchoolId = api.SchoolId;
                Device.findOne({serialId: device.serialId, SchoolId: api.SchoolId}, null, function (err, deviceToDB) {
                    if (deviceToDB) {
                        var deviceSerialized = new Device.DeviceSerializer(this.device);
                        deviceSerialized.updateDB(deviceToDB.id, function(err) {
                            deviceList.push(this.device);
                            processed++;
                            if (processed == devicesFromAPI.length) {
                                callback(null, deviceList)
                            }
                        }.bind({device:this.device}));
                    } else {
                        var deviceSerialized = new Device.DeviceSerializer(this.device);
                        deviceSerialized.insertDB(function(err){
                            deviceList.push(this.device);
                            processed++;
                            if (processed == devicesFromAPI.length) {
                                callback(deviceList)
                            }
                        }.bind({device:this.device}));
                    }
                }.bind({device:device}));
            }
        } else {
            callback(null, []);
        }

    })
};