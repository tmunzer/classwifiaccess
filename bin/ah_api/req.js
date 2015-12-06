var https = require('https');
var apiDB = require('./../../models/api');


module.exports.apiRequest = function (api, path, callback) {
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
            if (data!=''){
                console.log(data);
                var dataJSON = JSON.parse(data);
                console.log(dataJSON);
                result.data = dataJSON.data;
            }
            switch (result.result.status) {
                case 200:
                    callback(null, result);
                    break;
                default:
                    console.log("=====ERROR=====");
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


};
