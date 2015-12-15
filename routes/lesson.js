var User = require("./../models/user");
var api = require('./../bin/ah_api/req');
var Lesson = require("./../models/lesson");
var School = require("./../models/school");
var Classroom = require("./../models/classroom");


function renderLessons(req, res, displayedClassroom, currentClassroom) {
    var filterString = {SchoolId: req.session.SchoolId};
    if (displayedClassroom > 0) {
        filterString = {SchoolId: req.session.SchoolId, ClassroomId: displayedClassroom};
    }
    School.getAll(null, function (err, schoolList) {
        Lesson.findAll(filterString, null, function (err, lessonList) {
            if (err) {
                res.render("error");
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
};

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
};


function saveLesson(req, LessonId, callback) {
    var lesson = new Lesson();
    lesson.ClassroomId = req.body.ClassroomId;
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
            callback(err);
        });
    } else {
        lessonToDb.insertDB(function (err) {
            callback(err);
        });
    }
};

module.exports = function (router, isAuthenticated) {
    /* GET Home Page */
    router.get('/classroom/:ClassroomId/lesson/', isAuthenticated, function (req, res) {
        var filterString = {};
        var displayedClassroom = req.params.ClassroomId;
        if (displayedClassroom > 0) {
            Classroom.findById(displayedClassroom, null, function (err, currentClassroom) {
                renderLessons(req, res, displayedClassroom, currentClassroom);
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
                renderActivation(req, res, displayedClassroom, activation, null, currentClassroom);
            })
        } else {
            Classroom.findAll({SchoolId: req.session.SchoolId}, null, function (err, classroomList) {
                renderActivation(req, res, displayedClassroom, activation, classroomList, null);
            })

        }
    });
    router.post("/classroom/:ClassroomId/lesson/new/", isAuthenticated, function (req, res) {
        var displayedClassroom = req.params.ClassroomId;
        if (req.body.hasOwnProperty('wifiActivation')) {
            saveLesson(req, null, function (err) {
                if (err) {
                    res.render("error");
                } else {
                    res.redirect("/classroom/" + displayedClassroom + "/lesson/");
                }
            });
        } else {
            res.redirect("/classroom/" + displayedClassroom + "/lesson/");
        }
    });

    //========================= DELETE LESSON =========================//
    router.get("/lesson/delete/", isAuthenticated, function (req, res) {
        if (req.query.hasOwnProperty("LessonId")) {
            Lesson.deleteById(req.query.LessonId, function (err) {
                if (err) {
                    res.render("error");
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
                    res.render("error");
                } else {
                    Classroom.findById(currentLesson.ClassroomId, null, function (err, currentClassroom) {
                        if (err) {
                            res.render("error");
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
            saveLesson(req, req.query.LessonId, function (err) {
                if (err) {
                    res.render("error");
                } else {
                    res.redirect("/classroom/" + displayedClassroom + "/lesson/");
                }
            });
        } else {
            res.redirect("/classroom/" + displayedClassroom + "/lesson/");
        }
    });


    //========================= ENABLE LESSON =========================//
    router.post("/lesson/enable/", isAuthenticated, function (req, res) {
        if (req.body.hasOwnProperty('wifiActivation')) {
            saveLesson(req, null, function (err) {
                if (err) {
                    res.render("error");
                } else {
                    res.redirect("back");
                }
            });
        } else {
            res.redirect("back");
        }
    });

    //========================= DISABLE LESSON =========================//
    router.post("/lesson/disable/", isAuthenticated, function (req, res, next) {
        if (req.body.hasOwnProperty('ClassroomId')) {
            var classroomId = req.body.ClassroomId;
            Lesson.findActive(classroomId, req.session.SchoolId, function (err, ret) {
                if (err) {
                    res.render('error');
                } else {
                    var lesson = ret[0];
                    lesson.endDateTs = new Date().getTime();
                    var lessontToDB = new Lesson.LessonSeralizer(lesson);
                    lessontToDB.updateDB(lesson.id, function (err) {
                        res.redirect("back");
                    });
                }
            })
        } else if (req.query.hasOwnProperty('LessonId')) {
            var lessonId = req.query.LessonId;
            Lesson.findById(lessonId, null, function (err, lesson) {
                if (err) {
                    res.render("error");
                } else {
                    lesson.endDateTs = new Date().getTime();
                    var lessonToDB = new Lesson.LessonSeralizer(lesson);
                    lessonToDB.updateDB(lessonId, function (err) {
                        if (err) {
                            res.render("error");
                        } else {
                            res.redirect('back');
                        }
                    })
                }
            })
        } else {
            res.redirect("back");
        }
    });
};


