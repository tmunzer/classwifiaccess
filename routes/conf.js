var User = require("./../models/user");
var Group = require("./../models/group");
var Api = require("./../models/api");
var Classroom = require('./../models/classroom');

module.exports = function(router, isAuthenticated, isAdmin, translationFile){
    router.get('/conf/', isAuthenticated, isAdmin, translationFile, function(req, res, next) {
        var currentVhm = req.query.vhmId;
        if (req.isAdmin) {
            User.getAll(null, function(err, userList){
                Group.getAll(null, function(err, groupList){
                    Api.getAll(null, function(err, ApiList) {
                        Classroom.getAll(null, function(err, classList){
                            res.render('conf', {
                                user: req.user,
                                user_button: req.translationFile.user_button,
                                config_page: req.translationFile.config_page,
                                user_page: req.translationFile.user_page,
                                classroom_page: req.translationFile.classroom_page,
                                userList: userList,
                                groupList: groupList,
                                apiList: ApiList,
                                redirectUrl: Api.getRedirectUrl(),
                                clientId: Api.getClientId(),
                                classList: classList
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

