var https = require('https');

var apiDB = require('./../../models/api');
var www = require('./../www');

var Device = require("./../../models/device");

function apiRequest(api, path, callback, dev) {

    path = path.replace('#{ownerId}', api.ownerId);
    var host = api.vpcUrl.replace('https://', "");
    var options = {
        host: host,
        port: 443,
        path: path,
        method: 'GET',
        headers: {
            'X-AH-API-CLIENT-SECRET': apiDB.getSecret(),
            'X-AH-API-CLIENT-ID': apiDB.getClientId(),
            'X-AH-API-CLIENT-REDIRECT-URI': apiDB.getRedirectUrl(),
            'Authorization': "Bearer " + api.accessToken
        }
    };
    console.log(options);
    var req = https.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (data) {
            var dataJSON = JSON.parse(data);
            callback(dataJSON.data);
        });
    });
    if (dev) {
        www.messenger.emit("dev", req);
    }

    req.on('error', function (err) {
        console.log(err);
    });

// write data to request body
    req.write('data\n');
    req.write('data\n');
    req.end();


}

module.exports.getDevices = function (api, callback) {

    var path = '/xapi/v1/monitoring/devices?ownerId=#{ownerId}';

    // send the API request
    apiRequest(api, path, function (devicesFromAPI) {
        if (devicesFromAPI){

            var deviceList = [];
            var processed = 0;

            // for each device from the API response
            for (var i = 0; i < devicesFromAPI.length; i++) {

                var device = devicesFromAPI[i];
                console.log(device);
                Device.findOne({deviceId: device.deviceId}, null, function (err, deviceToDB) {
                    if (deviceToDB) {
                        var deviceSerialized = new Device.DeviceSerializer(this.device);
                        deviceSerialized.updateDB(deviceToDB.id, function(err) {
                            deviceList.push(this.device);
                            processed++;
                            if (processed == devicesFromAPI.length) {
                                callback(deviceList)
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
            callback([]);
        }

    })
};

module.exports.dev = function (apiId, path) {
    apiRequest(path, function (res) {
        www.messenger.emit("dev", res);
    })
};