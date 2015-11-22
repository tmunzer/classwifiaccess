var https = require('https');

var apiDB = require('./../../models/api');
var www = require('./../www');

var Device = require("./../../models/device");

function apiRequest(api, path, callback) {
    var result = {};
    result.request = {};
    result.result = {};
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
    result.request.options = options;
    var req = https.request(options, function (res) {
        result.result.status = res.statusCode;
        console.log('STATUS: ' + result.result.status);
        result.result.headers = JSON.stringify(res.headers);
        console.log('HEADERS: ' + result.result.headers);
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            console.log(data);
            var dataJSON = JSON.parse(data);
            console.log(dataJSON);
            result.data = dataJSON.data;
            switch (result.result.status) {
                case 200:
                    callback(null, result);
                    break;
                default:
                    callback(result, null);
                    break;

            }
        });
        req.on('error', function (err) {
            console.log("=====ERROR=====");
            console.log(err);
        });
    });



// write data to request body
    req.write('data\n');
    req.write('data\n');
    req.end();


}

module.exports.getDevices = function (api, callback) {

    var path = '/xapi/v1/monitoring/devices?ownerId=#{ownerId}';

    // send the API request
    apiRequest(api, path, function (err, result) {
        if (err){
            callback(err, null);
        }
        if (result){
            var devicesFromAPI = result.data;
            var deviceList = [];
            var processed = 0;

            // for each device from the API response
            for (var i = 0; i < devicesFromAPI.length; i++) {

                var device = devicesFromAPI[i];
                device.SchoolId = api.SchoolId;
                Device.findOne({deviceId: device.deviceId}, null, function (err, deviceToDB) {
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

module.exports.dev = function (apiId, path, callback) {
    apiRequest(apiId, path, function (err, result) {
        if (err){
            callback(err, null);
        } else if (result){
            callback(null, result);
        } else {
            callback(null, null);
        }
    })
};