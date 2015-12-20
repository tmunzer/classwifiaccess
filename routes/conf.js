var User = require("./../models/user");
var Group = require("./../models/group");
var Api = require("./../models/api");
var Classroom = require('./../models/classroom');
var School = require('./../models/school');
var Error = require('./error');

module.exports = function (router, isAuthenticated, isAdmin) {
    router.get('/conf/', isAuthenticated, isAdmin, function (req, res, next) {
        User.getAll(null, function (err, userList) {
            if (err){
                Error.render(err, "conf", req);
            } else {
                Api.getAll(null, function (err, apiList) {
                    if (err){
                        Error.render(err, "conf", req);
                    } else {
                        Classroom.getAll(null, function (err, classList) {
                            if (err){
                                Error.render(err, "conf", req);
                            } else {
                                School.getAll(null, function (err, schoolList) {
                                    if (err){
                                        Error.render(err, "conf", req);
                                    } else {
                                        res.render('conf', {
                                            user: req.user,
                                            current_page: 'conf',
                                            user_button: req.translationFile.user_button,
                                            config_page: req.translationFile.config_page,
                                            user_page: req.translationFile.config_user_page,
                                            classroom_page: req.translationFile.config_classroom_page,
                                            school_page: req.translationFile.config_school_page,
                                            buttons: req.translationFile.buttons,
                                            userList: userList,
                                            apiList: apiList,
                                            schoolList: schoolList,
                                            redirectUrl: Api.getRedirectUrl(),
                                            clientId: Api.getClientId(),
                                            classList: classList
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
};

