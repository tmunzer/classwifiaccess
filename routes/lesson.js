var User = require(appRoot + "/models/user");
var api = require(appRoot + '/bin/ah_api/req');
var Lesson = require(appRoot + "/models/lesson");
var School = require(appRoot + "/models/school");
var Classroom = require(appRoot + "/models/classroom");
var Control = require(appRoot + '/bin/device_control');
var Device = require(appRoot + "/models/device");
var Error = require(appRoot + '/routes/error');

function renderLessons(req, res, displayedClassroom, currentClassroom) {
    var filterString = {SchoolId: req.session.SchoolId};
    if (displayedClassroom > 0) {
        filterString = {SchoolId: req.session.SchoolId, ClassroomId: displayedClassroom};
    }
    School.getAll(null, function (err, schoolList) {
        Lesson.findAll(filterString, null, function (err, lessonList) {
            if (err) {
                Error.render(err, "classroom", req, res);
            } else {
                res.render('lesson', {
                    user: req.user,
                    current_page: 'lesson',
                    displayedClassroom: displayedClassroom,
                    lessonList: lessonList,
                    schoolList: schoolList,
                    session: req.session,
                    currentClassroom: currentClassroom,
                    lesson_page: req.translationFile.lesson_page,
                    user_button: req.translationFile.user_button,
                    buttons: req.translationFile.buttons
                });
            }
        });
    });
}

function renderActivation(req, res, displayedClassroom, activation, classroomList, currentClassroom, currentLesson) {
    res.render("lesson_activation", {
        user: req.user,
        current_page: "lesson",
        displayedClassroom: displayedClassroom,
        activation: activation,
        classroomList: classroomList,
        currentClassroom: currentClassroom,
        currentLesson: currentLesson,
        activation_page: req.translationFile.activation_page,
        user_button: req.translationFile.user_button,
        buttons: req.translationFile.buttons
    })
}


function saveLesson(req, classroomId, LessonId, callback) {
    Classroom.findById(classroomId, null, function (err, classroom) {
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
                        Control.enableWiFi(classroom.DeviceId, lesson.SchoolId, LessonId, function (err) {
                            callback(err);
                        })
                    }
                });
            } else {
                lessonToDb.insertDB(function (err, LessonId) {
                    if (err) callback(err);
                    else if (lesson.startDateTs > new Date().getTime()) callback(null);
                    else {
                        Control.enableWiFi(classroom.DeviceId, lesson.SchoolId, LessonId, function (err) {
                            callback(err);
                        });
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
            Classroom.findById(lesson.ClassroomId, null, function (err, classroom) {
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
    /* GET Home Page */
    router.get('/classroom/:ClassroomId/lesson/', isAuthenticated, function (req, res) {
        var displayedClassroom = req.params.ClassroomId;
        if (displayedClassroom > 0) {
            Classroom.findById(displayedClassroom, null, function (err, currentClassroom) {
                if (err) {
                    Error.render(err, "classroom", req, res);
                } else {
                    renderLessons(req, res, displayedClassroom, currentClassroom);
                }
            });
        } else {
            renderLessons(req, res, displayedClassroom, null);
        }
    });

    //========================= NEW LESSON =========================//
    router.get("/classroom/:ClassroomId/lesson/new/", isAuthenticated, function (req, res) {
        var activation = "";
        var displayedClassroom = req.params.ClassroomId;
        if (req.query.hasOwnProperty("when")) {
            activation = req.query.when;
        }
        if (displayedClassroom > 0) {
            Classroom.findById(displayedClassroom, null, function (err, currentClassroom) {
                if (err) {
                    Error.render(err, "classroom", req, res);
                } else {
                    renderActivation(req, res, displayedClassroom, activation, null, currentClassroom);
                }
            })
        } else {
            Classroom.findAll({SchoolId: req.session.SchoolId}, null, function (err, classroomList) {
                if (err) {
                    Error.render(err, "classroom", req, res);
                } else {
                    renderActivation(req, res, displayedClassroom, activation, classroomList, null);
                }
            })

        }
    });
    router.post("/classroom/:ClassroomId/lesson/new/", isAuthenticated, function (req, res) {
        var displayedClassroomId = req.params.ClassroomId;
        if (req.body.hasOwnProperty("ClassroomId")) {
            var classroomId = req.body.ClassroomId;
            if (req.body.hasOwnProperty('wifiActivation')) {
                saveLesson(req, classroomId, null, function (err) {
                    if (err) {
                        Error.render(err, "classroom", req, res);
                    } else {
                        res.redirect("/classroom/" + displayedClassroomId + "/lesson/");
                    }
                });
            } else {
                res.redirect("/classroom/" + displayedClassroomId + "/lesson/");
            }
        } else {
            Error.render(null, "classroom", req, res);
        }
    });

    //========================= ENABLE LESSON =========================//
    router.post("/lesson/enable/", isAuthenticated, function (req, res) {
        if (req.body.hasOwnProperty("ClassroomId")) {
            var classroomId = req.body.ClassroomId;
            if (req.body.hasOwnProperty('wifiActivation')) {
                saveLesson(req, classroomId, null, function (err) {
                    if (err) {
                        Error.render(err, "classroom", req, res);
                    } else {
                        res.redirect("back");
                    }
                });
            } else {
                res.redirect("back");
            }
        } else {
            Error.render(null, "classroom", req, res);
        }
    });
    //========================= DELETE LESSON =========================//
    router.get("/lesson/delete/", isAuthenticated, function (req, res) {
        if (req.query.hasOwnProperty("LessonId")) {
            Lesson.deleteById(req.query.LessonId, function (err) {
                if (err) {
                    Error.render(err, "classroom", req, res);
                } else {
                    res.redirect('back');
                }
            })
        } else {
            res.redirect('back');
        }
    });

    //========================= EDIT LESSON =========================//
    router.get("/classroom/:ClassroomId/lesson/edit/", isAuthenticated, function (req, res) {
        var displayedClassroom = req.params.ClassroomId;
        if (req.query.hasOwnProperty('LessonId')) {
            Lesson.findById(req.query.LessonId, null, function (err, currentLesson) {
                if (err) {
                    Error.render(err, "classroom", req, res);
                } else {
                    Classroom.findById(currentLesson.ClassroomId, null, function (err, currentClassroom) {
                        if (err) {
                            Error.render(err, "classroom", req, res);
                        } else {
                            renderActivation(req, res, displayedClassroom, null, null, currentClassroom, currentLesson);
                        }
                    })
                }
            })
        }
    });
    router.post("/classroom/:ClassroomId/lesson/edit/", isAuthenticated, function (req, res) {
        var displayedClassroom = req.params.ClassroomId;
        if (req.query.hasOwnProperty('LessonId')) {
            saveLesson(req, displayedClassroom, req.query.LessonId, function (err) {
                if (err) {
                    Error.render(err, "classroom", req, res);
                } else {
                    res.redirect("/classroom/" + displayedClassroom + "/lesson/");
                }
            });
        } else {
            res.redirect("/classroom/" + displayedClassroom + "/lesson/");
        }
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
                Lesson.findById(lessonId, null, function (err, lesson) {
                    if (err) {
                        Error.render(err, "classroom", req, res);
                    } else {
                        disableLesson(req, lesson, function (err) {
                            if (err) Error.render(err, "classroom", req);
                            else res.redirect("back");
                        })
                    }
                })
            } else {
                res.redirect("back");
            }
        }
    )
    ;
}
;
