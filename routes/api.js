

module.exports = function(router, isAuthenticated){
    router.get('/reg/app', isAuthenticated, function(req, res) {
        if (req.user.userGroup == 1) {
            var authCode = req.query.authCode;
            var api = new Api();
            api.registerApp(authCode, function(apiDataString){
                var apiDataJSON = JSON.parse(apiDataString);
                for (var owner in apiDataJSON.data){
                    console.log(apiDataJSON.data);
                    var apiReg = new Api.ApiToDB(apiDataJSON.data[owner]);
                    apiReg.insertDB(function(err){
                        res.redirect('/conf');
                    });
                }
            });
        }
    });
};