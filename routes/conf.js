var User = require(appRoot + "/models/user");
var Group = require(appRoot + "/models/group");
var Api = require(appRoot + "/models/api");
var Classroom = require(appRoot + '/models/classroom');
var School = require(appRoot + '/models/school');
var Error = require(appRoot + '/routes/error');

//======================= RENDER CONF =======================//
function renderConf(req, res){
    var filterString = null;
    var filterStringSchool = null;
    if (req.user.GroupId != 1){
        filterString = {SchoolId: req.user.SchoolId};
        filterStringSchool = {id: req.user.SchoolId};
    }
    User.findAll(filterString, null, function (err, userList) {
        if (err) Error.render(err, "conf", req, res);
        else {
            Api.findAll(filterString, null, function (err, apiList) {
                if (err) Error.render(err, "conf", req, res);
                else {
                    Classroom.findAll(filterString, null, function (err, classList) {
                        if (err) Error.render(err, "conf", req, res);
                        else {
                            School.findAll(filterStringSchool, null, function (err, schoolList) {
                                if (err) Error.render(err, "conf", req, res);
                                else {
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
}

module.exports = function (router, isAuthenticated, isAtLeastOperator) {
    //===============================================================//
    //============================ ROUTES ===========================//
    //===============================================================//

    //========================= CONFIG PAGE =========================//
    router.get('/conf/', [isAuthenticated, isAtLeastOperator], function (req, res, next) {
        if (req.params.hasOwnProperty('tabName')) console.log(req.params.tabName);
        else console.log(req.params);
        renderConf(req, res);
    });
};

