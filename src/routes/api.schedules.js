var express = require('express');
var router = express.Router();

var Error = require('../routes/error');
var Classroom = require('../bin/models/classroom');
var Lesson = require("../bin/models/lesson");
var Control = require('../bin/device_control');


//===============================================================//
//============================ schedule ===========================//
//===============================================================//

//========================== GET schedule ===========================//
router.get("/schedule", function (req, res, next) {
    if (req.session.passport) {
        if (req.query.schoolId) {
            var filterString;
            //if user is not an admin (only admin can view all schools)
            if (req.session.passport.user.GroupId > 1) filterString = {SchoolId: req.session.passport.user.SchoolId};
            // else if request is filtered on a school
            else if (req.query.schoolId && req.query.schoolId > 1) filterString = {SchoolId: req.query.schoolId};

            if (req.query.classroomId && req.query.classroomId > 0) {
                Classroom.findById(req.query.classroomId, filterString, null, function (err, classroom) {
                    if (err) res.json({error: err});
                    else {
                        filterString.ClassroomId = req.query.classroomId;
                        Lesson.findAll(filterString, null, function (err, lessons) {
                            if (err) res.json({error: err});
                            else {
                                res.json({
                                    classrooms: [classroom],
                                    lessons: lessons
                                });
                            }
                        });
                    }
                });
            } else {
                Classroom.findAll(filterString, null, function (err, classrooms) {
                    if (err) Error.render(err, "classroom", req, res);
                    else {
                        Lesson.findAll(filterString, null, function (err, lessons) {
                            if (err) res.json({error: err});
                            else {
                                res.json({
                                    classrooms: classrooms,
                                    lessons: lessons
                                });
                            }
                        });
                    }
                })
            }
        } else res.json({error: "schoolId is missing"});
    } else res.status(403).send('Unknown session');
});
//========================== SAVE schedule===========================//
function saveLesson(req, classroomId, LessonId, callback) {
    Classroom.findById(classroomId, {SchoolId: req.body.SchoolId}, null, function (err, classroom) {
        if (err) {
            callback(err);
        } else {
            var lesson = new Lesson();
            lesson.ClassroomId = classroomId;
            lesson.UserId = req.user.id;
            lesson.SchoolId = req.body.SchoolId;
            if (req.body.startDate) {
                lesson.startDateTs = new Date(req.body.startDate).getTime();
            } else {
                lesson.startDateTs = new Date().getTime();
            }
            switch (req.body.activation) {
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

//========================= DELETE LESSON =========================//
router.delete("/schedule", function (req, res) {
    if (req.session.passport) {
        if (req.query.LessonId) {
            Lesson.deleteById(req.query.LessonId, function (err) {
                if (err) res.json({error: err});
                else res.json({});
            })
        } else res.json({error: "LessonId is missing"});
    } else res.status(403).send('Unknown session');
});

router.post("/schedule", function (req, res) {
    if (req.session.passport) {
        // Create the lesson from the "Classroom Page"
        if (req.body.schoolId) {
            if (req.session.passport.user.GroupId == 1 || req.session.passport.user.SchoolId == req.body.SchoolId) {
                if (req.body.action) {
                    if (req.body.action == 'enable') {

                        if (req.body.ClassroomId) {
                            saveLesson(req, req.body.ClassroomId, null, function (err) {
                                if (err) res.json({error: err});
                                else res.json({});
                            });
                        } else res.json({error: "classroomId is missing"});


                    } else if (req.body.action == "disable") {
                        if (req.body.ClassroomId) {
                            Lesson.findActive(req.body.ClassroomId, req.body.SchoolId, function (err, ret) {
                                if (err) res.json({error: err});
                                else {
                                    var lessonCurrent = 0;
                                    var errors = [];
                                    for (var lessonNum in ret) {
                                        var lesson = ret[lessonNum];
                                        disableLesson(req, lesson, function (err) {
                                            if (err) errors.push(err);
                                            lessonCurrent++;
                                            if (lessonCurrent == ret.length) {
                                                if (errors.length > 0) res.json({error: errors});
                                                else res.json({});
                                            }
                                        });
                                    }
                                }
                            });
                        }

                        // Request from lessons list page (disable a specified lesson)
                        else if (req.body.LessonId) {
                            Lesson.findById(req.body.LessonId, {SchoolId: req.body.SchoolId}, null, function (err, lesson) {
                                if (err) {
                                    Error.render(err, "classroom", req, res);
                                } else {
                                    disableLesson(req, lesson, function (err) {
                                        if (err) res.json({error: errors});
                                        else res.json({});
                                    })
                                }
                            })
                        } else res.json({error: "classroomId or LessonId is missing"});

                    } else res.json({error: "Unknown action"});
                } else res.json({error: "missing action"});

            } else res.json({error: "You don't have enough permission to create a schedule for this school"});

            // Edit the lesson
        } else if (req.body.lesson && req.body.LessonId) {
            var LessonToDb = new Lesson.LessonSeralizer(req.body.lesson);
            LessonToDb.updateDB(req.body.lessonId, function (err) {
                if (err) res.json({error: err});
                else res.json({});
            });
        } else res.json({error: "SchoolId, lesson or lessonId are missing"});
    } else res.status(403).send('Unknown session');
});

module.exports = router;