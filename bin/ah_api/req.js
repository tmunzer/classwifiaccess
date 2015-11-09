var https = require('https');

var apiDB = require('./../../models/api');
var www = require('./../www');

var Device = require("./../../models/device");

function apiRequest(apiId, path, callback, dev){

    apiDB.findById(apiId, function(err, api) {
        console.log(api);
        path = path.replace('#{ownerId}', api.ownerId);
        var host = api.vpcUrl.replace('https://',"");
        var options = {
            host: host,
            port: 443,
            path: path,
            method: 'GET',
            headers: {
                'X-AH-API-CLIENT-SECRET': apiDB.getSecret(),
                'X-AH-API-CLIENT-ID': apiDB.getClientId(),
                'X-AH-API-CLIENT-REDIRECT-URI': apiDB.getRedirectUrl(),
                'Authorization': "Bearer "+api.accessToken
            }
        };
        console.log(options);
        var req = https.request(options, function (res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (data) {
                var dataJSON = JSON.parse(data);
                for (var entry in dataJSON.data){
                    callback(dataJSON.data[entry]);
                }
            });
        });
        if (dev){
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
)}

module.exports.getDevices = function (apiIds){
    var path = '/xapi/v1/monitoring/devices?ownerId=#{ownerId}';
    for (var apiId in apiIds){
        apiRequest(apiId, path, function(device){
            var deviceSerialized = new Device.DeviceSerializer(device);
            Device.findOne({"deviceId": device.deviceId}, null, function(err, deviceToDB) {
                if (deviceToDB) {
                    deviceSerialized.updateDB(deviceToDB.id, null);
                } else {
                    deviceSerialized.insertDB(null);
                }
                www.messenger.emit("device", device);
            });
        })
    }
};

module.exports.dev = function(apiId, path){
    apiRequest(path, function(res){
        www.messenger.emit("dev", res);
    })
};