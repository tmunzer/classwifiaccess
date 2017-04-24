var https = require('https');

module.exports.getPermanentToken = function (authCode, redirectUrl, secret, clientId, callback) {
    var options = {
        host: 'cloud.aerohive.com',
        port: 443,
        path: '/services/acct/thirdparty/accesstoken?authCode=' + authCode + '&redirectUri=' + redirectUrl,
        method: 'POST',
        headers: {
            'X-AH-API-CLIENT-SECRET': secret,
            'X-AH-API-CLIENT-ID': clientId,
            'X-AH-API-CLIENT-REDIRECT-URI': redirectUrl
        }
    };
    console.log(options);
    var req = https.request(options, function (res) {
        console.info("\x1b[32minfo\x1b[0m:",'STATUS: ' + res.statusCode);
        console.info("\x1b[32minfo\x1b[0m:",'HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (data) {
            callback(data);
        });
    });


    req.on('error', function (err) {
        callback(err);
    });

    // write data to request body
    req.write('data\n');
    req.end();
};

module.exports.refreshToken = function (refreshToken, redirectUrl, clientSecret, clientId, callback) {
    const options = {
        host: 'cloud.aerohive.com',
        port: 443,
        path: '/services/oauth2/token',
        method: 'POST',
        headers: {
            'content-type': "application/x-www-form-urlencoded",
            "cache-control": "no-cache"
        }
    };
    const body = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_secret: clientSecret,
        client_id: clientId
    };

    let chunks = [];
    const req = https.request(options, function (res) {
        console.info('\x1b[34mREQUEST QUERY\x1b[0m:', options.path);
        console.info('\x1b[34mREQUEST STATUS\x1b[0m:', res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function (data) {
            callback(JSON.parse(data));
        });
    });

    req.on('error', function (err) {
        console.error("\x1b[31mREQUEST QUERY\x1b[0m:", options.path);
        console.error("\x1b[31mREQUEST ERROR\x1b[0m:", JSON.stringify(err));
        callback(err, null);
    });

    // write data to request body
    req.write(qs.stringify(body));
    req.end();
}