var User = require(appRoot + "/models/user");
var Group = require(appRoot + "/models/group");
var Api = require(appRoot + "/models/api");
var Classroom = require(appRoot + '/models/classroom');
var School = require(appRoot + '/models/school');
var Error = require(appRoot + '/routes/error');

module.exports = function (router, isAuthenticated, isAdmin) {
    router.get('/conf/', isAuthenticated, isAdmin, function (req, res, next) {
        User.getAll(null, function (err, userList) {
            if (err){
                Error.render(err, "conf", req, res);
            } else {
                Api.getAll(null, function (err, apiList) {
                    if (err){
                        Error.render(err, "conf", req, res);
                    } else {
                        Classroom.getAll(null, function (err, classList) {
                            if (err){
                                Error.render(err, "conf", req, res);
                            } else {
                                School.getAll(null, function (err, schoolList) {
                                    if (err){
                                        Error.render(err, "conf", req, res);
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

