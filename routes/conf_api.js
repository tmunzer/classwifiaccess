var Api = require("./../models/api");

module.exports = function (router, isAuthenticated, isAdmin) {
    router.get('/conf/api/reg', isAuthenticated, isAdmin, function (req, res) {
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
                            apiReg.SchoolId = 1;
                            apiReg.insertDB(function (err) {
                                res.redirect('/conf');
                            });
                        }
                    } else if (apiDataJSON.hasOwnProperty('error')) {
                        var apiError = new Api.ApiErrorSerializer(apiDataJSON.error);
                        res.render('apiError', {user: req.user, error: apiError});
                    }
                } else {
                    res.render('error', {
                        user: req.user,
                        error: err
                    });
                }
            });
        }
    });

    router.get('/conf/api/delete', isAuthenticated, isAdmin, function (req, res) {
        if (req.query.hasOwnProperty("id")) {
            var apiId = req.query.id;
            Api.deleteById(apiId, function () {
                res.redirect("/conf");
            })

        }
    });

    /* POST - SAVE User Edit page. */
    router.post("/conf/api/update", isAuthenticated, isAdmin, function (req, res, next) {
        var apiIdToEdit = req.query.id;
        // check if requested user to display is the same as the current user
        // or if current user is an admin
        // serialize the user
        Api.findById(apiIdToEdit, null, function (err, apiFromDB) {
            var apiSerializer = new Api.ApiSerializer(apiFromDB);
            apiSerializer.api.SchoolId = req.body.SchoolId;
            // update the user
            apiSerializer.updateDB(apiIdToEdit, function (err) {
                res.redirect('/conf');
            });
        });
    });
};