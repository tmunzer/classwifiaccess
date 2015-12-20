var User = require("./../models/user");
var api = require('./../bin/ah_api/req');
var Classroom = require('./../models/classroom');
var School = require("./../models/school");
var Lesson = require("./../models/lesson");
var apiReq = require('./../bin/ah_api/req_device');
var Api = require("./../models/api");
var Error = require('./error');

module.exports = function (router, isAuthenticated) {
    /* GET Home Page */
    router.get('/classroom/', isAuthenticated, function (req, res, next) {
        School.getAll(null, function (err, schoolList) {
            if (err){
                Error.render(err, "classroom", req);
            } else {
                var filterString = {SchoolId: req.session.SchoolId};
                Api.findAll({SchoolId: req.session.SchoolId}, null, function (err, apiList) {
                    if (err){
                        Error.render(err, "classroom", req);
                    } else if (apiList){
                        var apiNum = 0;
                        var deviceList = [];
                        for (var i = 0; i < apiList.length; i++) {
                            apiReq.getDevices(apiList[i], function (err, devices) {
                                if (err) {
                                    Error.render(err, "classroom", req);
                                } else {
                                    deviceList = deviceList.concat(devices);
                                    apiNum++;
                                    if (apiNum == apiList.length) {
                                        Classroom.findAll(filterString, null, function (err, classroomList) {
                                            if (err) {
                                                Error.render(err, "classroom", req);
                                            } else {
                                                res.render('classroom', {
                                                    user: req.user,
                                                    current_page: 'classroom',
                                                    classroomList: classroomList,
                                                    schoolList: schoolList,
                                                    session: req.session,
                                                    user_button: req.translationFile.user_button,
                                                    classroom_page: req.translationFile.classroom_page,
                                                    buttons: req.translationFile.buttons
                                                });
                                            }
                                        });
                                    }
                                }
                            }.bind(this));
                        }
                    } else {
                        res.render('classroom', {
                            user: req.user,
                            current_page: 'classroom',
                            classroomList: null,
                            schoolList: schoolList,
                            session: req.session,
                            user_button: req.translationFile.user_button,
                            classroom_page : req.translationFile.classroom_page,
                            buttons: req.translationFile.buttons
                        });
                    }
                });
            }
        });
    });
};
