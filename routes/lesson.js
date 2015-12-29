var User = require(appRoot + "/models/user");
var api = require(appRoot + '/bin/ah_api/req');
var Lesson = require(appRoot + "/models/lesson");
var School = require(appRoot + "/models/school");
var Classroom = require(appRoot + "/models/classroom");
var Control = require(appRoot + '/bin/device_control');
var Device = require(appRoot + "/models/device");
var Error = require(appRoot + '/routes/error');

function renderLessons(req, res) {
    var filterString = {SchoolId: req.session.SchoolId};
    if (req.classroomId > 0) {
        filterString = {SchoolId: req.session.SchoolId, ClassroomId: req.classroomId};
    }
    School.getAll(null, function (err, schoolList) {
        Lesson.findAll(filterString, null, function (err, lessonList) {
            if (err) {
                Error.render(err, "classroom", req, res);
            } else {
                res.render('lesson', {
                    user: req.user,
                    current_page: 'lesson',
                    displayedClassroom: req.classroomFromDB,
                    lessonList: lessonList,
                    schoolList: schoolList,
                    session: req.session,
                    classroomId: req.classroomId,
                    lesson_page: req.translationFile.lesson_page,
                    user_button: req.translationFile.user_button,
                    buttons: req.translationFile.buttons
                });
            }
        });
    });
}
function renderActivation(message, activation, currentLesson, req, res) {
    res.render("lesson_activation", {
        user: req.user,
        current_page: "lesson",
        classroomId: req.classroomId,
        message: message,
        activation: activation,
        classroomList: req.classroomListFromDB,
        currentClassroom: req.classroomFromDB,
        currentLesson: currentLesson,
        activation_page: req.translationFile.activation_page,
        user_button: req.translationFile.user_button,
        buttons: req.translationFile.buttons
    })
}


function saveLesson(req, classroomId, LessonId, callback) {
    Classroom.findById(classroomId, {SchoolId: req.session.SchoolId}, null, function (err, classroom) {
        if (err) {
            callback(err);
        } else {
            var lesson = new Lesson();
            lesson.ClassroomId = classroomId;
            lesson.UserId = req.user.id;
            lesson.SchoolId = req.session.SchoolId;
            if (req.body.hasOwnProperty("startDate")) {
                lesson.startDateTs = new Date(req.body.startDate).getTime();
            } else {
                lesson.startDateTs = new Date().getTime();
            }
            switch (req.body.wifiActivation) {
                case "unlimited":
                    lesson.endDateTs = 0;
                    break;
                case "duration":
                    lesson.endDateTs = new Date(lesson.startDateTs + (req.body.duration * 60 * 1000)).getTime();
                    break;
                case "until":
                    lesson.endDateTs = new Date(req.body.endDate).getTime();
                    break;
            }
            var lessonToDb = new Lesson.LessonSeralizer(lesson);
            if (LessonId != null) {
                lessonToDb.updateDB(LessonId, function (err) {
                    if (err) callback(err);
                    else if (lesson.startDateTs > new Date().getTime()) callback(null);
                    else {
                        if (classroom.DeviceId > 0) {
                            Control.enableWiFi(classroom.DeviceId, lesson.SchoolId, LessonId, function (err) {
                                callback(err);
                            })
                        } else {
                            callback(err);
                        }
                    }
                });
            } else {
                lessonToDb.insertDB(function (err, LessonId) {
                    if (err) callback(err);
                    else if (lesson.startDateTs > new Date().getTime()) callback(null);
                    else {
                        if (classroom.DeviceId > 0) {

                            Control.enableWiFi(classroom.DeviceId, lesson.SchoolId, LessonId, function (err) {
                                callback(err);
                            });
                        } else {
                            callback(err);
                        }
                    }
                });
            }
        }
    });
}

function disableLesson(req, lesson, callback) {
    lesson.endDateTs = new Date().getTime();
    var lessonToDB = new Lesson.LessonSeralizer(lesson);
    lessonToDB.updateDB(lesson.id, function (err) {
        if (err) callback(err);
        else {
            Classroom.findById(lesson.ClassroomId, {SchoolId: req.session.SchoolId}, null, function (err, classroom) {
                if (err) callback(err);
                else {
                    Control.disableWiFi(classroom.DeviceId, req.session.SchoolId, lesson.id, function (err) {
                        callback(err);
                    });
                }
            });
        }
    });
}

module.exports = function (router, isAuthenticated) {
    //=========================================================//
    //========================= PARAM =========================//
    //=========================================================//

    router.param("lessonClassroomId", function (req, res, next, lessonClassroomId) {
        if (req.user){
            req.classroomId = lessonClassroomId;
            if (lessonClassroomId > 0) {
                Classroom.findById(lessonClassroomId, {SchoolId: req.session.SchoolId}, null, function (err, classroom) {
                    if (err) Error.render(err, "classroom", req, res);
                    else {
                        req.classroomFromDB = classroom;
                        return next();
                    }
                });
            } else {
                Classroom.findAll({SchoolId: req.session.SchoolId}, null, function (err, classroomList) {
                    if (err) Error.render(err, "classroom", req, res);
                    else {
                        req.classroomListFromDB = classroomList;
                        return next();
                    }
                })
            }
        } else return next();

    });
    router.param("lessonId", function (req, res, next, lessonId) {
        if (req.user) {
            req.lessonId = lessonId;
            Lesson.findById(lessonId, {SchoolId: req.session.SchoolId}, null, function (err, lesson) {
                if (err) Error.render(err, "classroom", req, res);
                else {
                    req.lessonFromDB = lesson;
                    return next();
                }
            });
        } else return next();
    });
    //===============================================================//
    //============================ ROUTES ===========================//
    //===============================================================//

    //========================= LIST LESSON =========================//
    router.get('/classroom/:lessonClassroomId/lesson/$', isAuthenticated, function (req, res) {
        renderLessons(req, res);
    });

    //========================= NEW LESSON > DISPLAY =========================//
    router.get("/classroom/:lessonClassroomId/lesson/new/$", isAuthenticated, function (req, res) {
        var activation = "";
        if (req.query.hasOwnProperty("when")) {
            activation = req.query.when;
        }
        renderActivation(null, activation, null, req, res);
    });
    //========================= NEW LESSON > SAVE =========================//
    router.post("/classroom/:lessonClassroomId/lesson/new/", isAuthenticated, function (req, res) {
        if (req.body.hasOwnProperty("ClassroomId") && req.body.hasOwnProperty('wifiActivation')) {
            saveLesson(req, req.body.ClassroomId, null, function (err) {
                if (err) {
                    Error.render(err, "lesson", req, res);
                } else {
                    res.redirect("/classroom/" + req.classroomId + "/lesson/");
                }
            });
        } else {
            res.redirect("back");
        }
    });

    //========================= ENABLE LESSON =========================//
    router.post("/lesson/enable/", isAuthenticated, function (req, res) {
        if (req.body.hasOwnProperty("ClassroomId") && req.body.hasOwnProperty('wifiActivation')) {
            saveLesson(req, req.body.ClassroomId, null, function (err) {
                if (err) {
                    Error.render(err, "lesson", req, res);
                } else {
                    res.redirect("back");
                }
            });
        } else {
            res.redirect("back");
        }
    });
    //========================= DELETE LESSON =========================//
    router.get("/lesson/delete/", isAuthenticated, function (req, res) {
        if (req.query.hasOwnProperty("LessonId")) {
            Lesson.deleteById(req.query.LessonId, function (err) {
                if (err) {
                    Error.render(err, "lesson", req, res);
                } else {
                    res.redirect('back');
                }
            })
        } else {
            res.redirect('back');
        }
    });

    //========================= EDIT LESSON > DISPLAY =========================//
    router.get("/classroom/:lessonClassroomId/lesson/:lessonId/edit/$", isAuthenticated, function (req, res) {
        renderActivation(null, null, req.lessonFromDB, req, res);
    });
    //========================= EDIT LESSON > SAVE =========================//

    router.post("/classroom/:ClassroomId/lesson/:lessonId/edit/$", isAuthenticated, function (req, res) {
        saveLesson(req, req.body.ClassroomId, req.lessonId, function (err) {
            if (err) Error.render(err, "lesson", req, res);
            else {
                res.redirect("/classroom/" + res.classroomId + "/lesson/");
            }
        });
    });


    //========================= DISABLE LESSON =========================//
    router.post("/lesson/disable/", isAuthenticated, function (req, res, next) {
            // Request from the classroom page (disable a specified classroom)
            if (req.body.hasOwnProperty('ClassroomId')) {
                var classroomId = req.body.ClassroomId;
                Lesson.findActive(classroomId, req.session.SchoolId, function (err, ret) {
                    if (err) {
                        Error.render(err, "classroom", req, res);
                    } else {
                        var lessonCurrent = 0;
                        var errors = [];
                        for (var lessonNum in ret) {
                            var lesson = ret[lessonNum];
                            disableLesson(req, lesson, function (err) {
                                if (err) errors.push(err);
                                lessonCurrent++;
                                if (lessonCurrent == ret.length) {
                                    if (errors.length > 0) {
                                        Error.render(errors, "classroom", req, res);
                                    } else {
                                        res.redirect("back");
                                    }
                                }
                            });
                        }
                    }
                });
            }
            // Request from lessons list page (disable a specified lesson)
            else if (req.query.hasOwnProperty('LessonId')) {
                var lessonId = req.query.LessonId;
                Lesson.findById(lessonId, {SchoolId: req.session.SchoolId}, null, function (err, lesson) {
                    if (err) {
                        Error.render(err, "classroom", req, res);
                    } else {
                        disableLesson(req, lesson, function (err) {
                            if (err) Error.render(err, "lesson", req, res);
                            else res.redirect("back");
                        })
                    }
                })
            } else {
                res.redirect("back");
            }
        }
    );
};
