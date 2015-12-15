var User = require("./../models/user");
var api = require('./../bin/ah_api/req');
var Classroom = require('./../models/classroom');
var School = require("./../models/school");
var Lesson = require("./../models/lesson");
var apiReq = require('./../bin/ah_api/req_device');
var Api = require("./../models/api");

module.exports = function (router, isAuthenticated) {
    /* GET Home Page */
    router.get('/classroom/', isAuthenticated, function (req, res, next) {
        School.getAll(null, function (err, schoolList) {
            var filterString = {SchoolId: req.session.SchoolId};
            Api.findAll({SchoolId: req.session.SchoolId}, null, function (err, apiList) {
                if (apiList){
                    var apiNum = 0;
                    var deviceList = [];
                    for (var i = 0; i < apiList.length; i++) {
                        apiReq.getDevices(apiList[i], function (err, devices) {
                            if (err) {
                                res.render("apiError", {
                                    current_page:'device',
                                    err: err,
                                    user: req.user,
                                    session: req.session,
                                    schoolList: schoolList,
                                    user_button: req.translationFile.user_button
                                });
                            } else {
                                deviceList = deviceList.concat(devices);
                                apiNum++;
                                if (apiNum == apiList.length) {
                                    Classroom.findAll(filterString, null, function (err, classroomList) {
                                        res.render('classroom', {
                                            user: req.user,
                                            current_page: 'classroom',
                                            classroomList: classroomList,
                                            schoolList: schoolList,
                                            session: req.session,
                                            user_button: req.translationFile.user_button,
                                            classroom_page : req.translationFile.classroom_page,
                                            buttons: req.translationFile.buttons
                                        });
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
        });
    });
};
