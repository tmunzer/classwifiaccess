var express = require('express');
var router = express.Router();

//===============================================================//
//============================ OAUTH ===========================//
//===============================================================//
router.get('/oauth/reg', function (req, res) {
    if (req.session.passport) {
        if (req.query.error) {
            Error.render(req.query.error, "conf", req, res);
        } else {
            var authCode = req.query.authCode;
            api.registerApp(authCode, function (apiDataString) {
                if (apiDataString) {
                    var apiDataJSON = JSON.parse(apiDataString);
                    if (apiDataJSON.data) {
                        for (var owner in apiDataJSON.data) {
                            var apiReg = new Api.ApiSerializer(apiDataJSON.data[owner]);
                            apiReg.SchoolId = 1;
                            apiReg.insertDB(function (err) {
                                if (err) {
                                    Error.render(err, "conf", req, res);
                                } else {
                                    res.redirect('web-app/#!/settings');
                                }
                            });
                        }
                    } else if (apiDataJSON.error) {
                        var apiError = new Api.ApiErrorSerializer(apiDataJSON.error);
                        Error.render(apiError, "conf", req);
                    }
                } else {
                    Error.render(err, "conf", req, res);
                }
            });
        }
    } else res.status(403).send('Unknown session');
});

module.exports = router;