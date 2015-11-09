var Api = require("./../models/api");

module.exports = function(router, isAuthenticated, isAdmin, translationFile){
    router.get('/api/reg', isAuthenticated, isAdmin, translationFile, function(req, res) {
        if (req.isAdmin) {
            if (req.query.hasOwnProperty('error')) {
                var error = {status: req.query.error, stack: ""};
                res.render('error', {user: req.user, error: error});
            } else {
                var authCode = req.query.authCode;
                var api = new Api();
                api.registerApp(authCode, function (apiDataString) {
                    if (apiDataString) {
                        var apiDataJSON = JSON.parse(apiDataString);
                        if (apiDataJSON.hasOwnProperty("data")) {
                            for (var owner in apiDataJSON.data) {
                                var apiReg = new Api.ApiSerializer(apiDataJSON.data[owner]);
                                apiReg.insertDB(function (err) {
                                    res.redirect('/conf');
                                });
                            }
                        } else if (apiDataJSON.hasOwnProperty('error')) {
                            var apiError = new Api.ApiErrorSerializer(apiDataJSON.error);
                            res.render('apiError', {user: req.user, error: apiError});
                        }
                    } else {
                        res.render('error', {user: req.user, error: err});
                    }
                });
            }
        }
    });
    router.get('/api/delete', isAuthenticated, isAdmin, translationFile, function(req, res) {
        if (req.isAdmin) {
            if (req.query.hasOwnProperty("id")){
                var apiId = req.query.id;
                Api.deleteByID(apiId, function(){
                    res.redirect("/conf");
                })

            }
        } else {
            res.redirect("/conf");
        }
    })
};