var User = require("./../models/user");
var Group = require("./../models/group");
var Api = require("./../models/api");
var Classroom = require('./../models/classroom');
var School = require('./../models/school');

module.exports = function (router, isAuthenticated, isAdmin) {
    router.get('/conf/', isAuthenticated, isAdmin, function (req, res, next) {
        User.getAll(null, function (err, userList) {
            Api.getAll(null, function (err, apiList) {
                Classroom.getAll(null, function (err, classList) {
                    School.getAll(null, function (err, schoolList) {
                        res.render('conf', {
                            user: req.user,
                            current_page: 'conf',
                            user_button: req.translationFile.user_button,
                            config_page: req.translationFile.config_page,
                            user_page: req.translationFile.user_page,
                            classroom_page: req.translationFile.classroom_page,
                            school_page: req.translationFile.school_page,
                            buttons: req.translationFile.buttons,
                            userList: userList,
                            apiList: apiList,
                            schoolList: schoolList,
                            redirectUrl: Api.getRedirectUrl(),
                            clientId: Api.getClientId(),
                            classList: classList
                        });
                    });
                });
            });
        });
    });
};

