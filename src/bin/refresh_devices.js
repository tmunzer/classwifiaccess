const Device = require("./models/device");


module.exports = function refreshDevices(filterString, callback) {
    Api.findAll(filterString, null, function (err, apiList) {
        if (err) callback(err);
        else if (apiList) {
            var apiNum = 0;
            var deviceList = [];
            apiList.forEach(function (api) {
                Device.refresh(api, function (err, devices) {
                    if (err) callback(err);
                    else {
                        deviceList = deviceList.concat(devices);
                        apiNum++;
                        if (apiNum == apiList.length) {
                            callback();
                        }
                    }
                })
            })
        } else callback();
    });
}
