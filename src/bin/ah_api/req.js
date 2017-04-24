var https = require('https');
var apiDB = require(appRoot + '/bin/models/api');
var logger = require(appRoot + "/app").logger;


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
            'X-AH-API-CLIENT-REDIRECT-URI': apiDB.getRedirectUrl(),
            'Authorization': "Bearer " + api.accessToken
        }
    };
    logger.info(options);
    result.request.options = options;
    var req = https.request(options, function (res) {
        result.result.status = res.statusCode;
        logger.info('STATUS: ' + result.result.status);
        result.result.headers = JSON.stringify(res.headers);
        logger.info('HEADERS: ' + result.result.headers);
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            if (data != '') {
                var dataJSON = JSON.parse(data);
                result.data = dataJSON.data;
                result.error = dataJSON.error;
            }
            switch (result.result.status) {
                case 200:
                    callback(null, result);
                    break;
                default:
                    logger.error(result);
                    callback(result.error, result);
                    break;

            }
        });
    });
    req.on('error', function (err) {
        callback(err, null);
    });


// write data to request body
    req.write('data\n');
    req.end();


};
