var User = require("./../models/user");
var Group = require("./../models/group");
var Api = require("./../models/api");
var translate = require('./../translate/translate');

module.exports = function(router, isAuthenticated){
    router.get('/conf/', isAuthenticated, function(req, res, next) {
        if (req.user.userGroup == 1) {
            translate(req.user.language, req, function (translationFile) {
                User.getAll(null, function(err, userList){
                    Group.getAll(null, function(err, groupList){
                        Api.getAll(null, function(err, ApiList) {
                            res.render('conf', {
                                user: req.user,
                                user_button: translationFile.user_button,
                                config_page: translationFile.config_page,
                                user_page: translationFile.user_page,
                                userList: userList,
                                groupList: groupList,
                                apiList: ApiList,
                                redirectUrl: Api.getRedirectUrl(),
                                clientId: Api.getClientId()
                            });
                        });
                    });
                });
            });
        } else {
            res.redirect('/');
        }
    });
};

