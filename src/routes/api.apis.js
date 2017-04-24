var express = require('express');
var router = express.Router();
var api = require('../bin/ah_api/req');
var apiReq = require('../bin/ah_api/req_device');
var Error = require('../routes/error');
var User = require("../bin/models/user");
var Group = require("../bin/models/group");
var Classroom = require('../bin/models/classroom');
var School = require("../bin/models/school");
var Lesson = require("../bin/models/lesson");
var Api = require("../bin/models/api");
var Device = require("../bin/models/device");
var Control = require('../bin/device_control');

function refreshDevices(filterString, callback) {
    Api.findAll(filterString, null, function (err, apiList) {
        if (err) {
            callback(err);
        } else if (apiList) {
            var apiNum = 0;
            var deviceList = [];
            for (var i = 0; i < apiList.length; i++) {
                // Update the Device information for devices (request to ALL configured API for this school)
                apiReq.getDevices(apiList[i], function (err, devices) {
                    if (err) {
                        callback(err);
                    } else {
                        deviceList = deviceList.concat(devices);
                        apiNum++;
                        if (apiNum == apiList.length) {
                            callback();
                        }
                    }
                }.bind(this));
            }
        } else {
            callback();
        }
    });
}

//===============================================================//
//============================ OAUTH ===========================//
//===============================================================//
router.get('/oauth/reg', function (req, res) {
    if (req.session.passport) {
        if (req.query.error) {
            Error.render(req.query.error, "conf", req, res);
        } else {
            var authCode = req.query.authCode;
            var api = new Api();
            api.registerApp(authCode, function (apiDataString) {
                if (apiDataString) {
                    var apiDataJSON = JSON.parse(apiDataString);
                    if (apiDataJSON.data) {
                        for (var owner in apiDataJSON.data) {
                            var apiReg = new Api.ApiSerializer(apiDataJSON.data[owner]);
                            apiReg.SchoolId = 1;
                            apiReg.insertDB(function (err) {
                                if (err) {
                                    Error.render(err, "conf", req, res);
                                } else {
                                    res.redirect('web-app/#!/settings');
                                }
                            });
                        }
                    } else if (apiDataJSON.error) {
                        var apiError = new Api.ApiErrorSerializer(apiDataJSON.error);
                        Error.render(apiError, "conf", req);
                    }
                } else {
                    Error.render(err, "conf", req, res);
                }
            });
        }
    } else res.status(403).send('Unknown session');
});
//===============================================================//
//============================ classrooms ===========================//
//===============================================================//
router.get('/classrooms', function (req, res, next) {
    if (req.session.passport) {
        var filterString;
        //if user is not an admin (only admin can view all schools)
        if (req.session.passport.user.GroupId > 1) filterString = {SchoolId: req.session.passport.user.SchoolId};
        // else if request is filtered on a school
        else if (req.query.schoolId && req.query.schoolId > 1) filterString = {SchoolId: req.query.schoolId};

        refreshDevices(filterString, function (err) {
            if (err) res.json({error: err});
            else
                Classroom.findAll(filterString, null, function (err, classroomList) {
                    if (err) res.json({error: err});
                    else
                        res.json({classrooms: classroomList});
                });
        })

    } else res.status(403).send('Unknown session');
});
//========================== CREATE/UPDATE classrooms ===========================//
router.post("/settings/classroom", function (req, res, next) {
    var ClassroomSerializer;
    if (req.session.passport) {
        if (req.body.ClassroomId && req.body.classroomId > 0 && req.body.classroom) {
            ClassroomSerializer = new Classroom.ClassroomSeralizer(req.body.classroom);
            //if user is not an admin (only admin can edit all schools)
            if (req.session.passport.user.GroupId > 1) ClassroomSerializer.SchoolId = req.session.passport.user.SchoolId;
            // update the classroom
            ClassroomSerializer.updateDB(req.body.classroomId, function (err) {
                if (err) res.json({error: err});
                else res.json({});
            });
        } else if (req.body.classroom) {
            // serialize the classroom
            ClassroomSerializer = new Classroom.ClassroomSeralizer(req.body.classroom);
            //if user is not an admin (only admin can edit all schools)
            if (req.session.passport.user.GroupId > 1) ClassroomSerializer.SchoolId = req.session.passport.user.SchoolId;
            // update the classroom
            ClassroomSerializer.insertDB(function (err) {
                if (err) res.json({error: err});
                else res.json({});
            });
        }
    } else res.status(403).send('Unknown session');
});
//========================== DELETE classrooms ===========================//
router.delete('/settings/classroom', function (req, res) {
    if (req.session.passport) {
        if (req.query.id) {
            var classroomId = req.query.id;
            Classroom.deleteById(classroomId, function (err) {
                if (err) res.json({error: err});
                else res.json({});
            })
        }
    } else res.status(403).send('Unknown session');
});
//===============================================================//
//============================ devices ===========================//
//===============================================================//
router.get('/devices', function (req, res, next) {
    if (req.session.passport) {
        var filterString;
        //if user is not an admin (only admin can view all schools)
        if (req.session.passport.user.GroupId > 1) filterString = {SchoolId: req.session.passport.user.SchoolId};
        // else if request is filtered on a school
        else if (req.query.schoolId && req.query.schoolId > 1) filterString = {SchoolId: req.query.schoolId};

        Api.findAll(filterString, null, function (err, apiList) {
            if (err) res.json({error: err});
            else if (apiList) {
                var apiNum = 0;
                var deviceList = [];
                for (var i = 0; i < apiList.length; i++) {
                    apiReq.getDevices(apiList[i], function (err, devices) {
                        if (err) res.json({error: err});
                        else {
                            deviceList = deviceList.concat(devices);
                            apiNum++;
                            if (apiNum == apiList.length) {
                                res.json({devices: deviceList});
                            }
                        }
                    }.bind(this));
                }
            } else {
                res.json({});
            }
        });
    } else res.status(403).send('Unknown session');
});
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


//===============================================================//
//============================ settings USERS===========================//
//===============================================================//

//========================== GET info for the current connected user ===========================//

router.get("/settings/self", function (req, res, next) {
    if (req.session.passport) {
        res.json({
            uid: req.session.passport.user.id,
            gid: req.session.passport.user.GroupId
        });
    } else res.status(403).send('Unknown session');
});
//========================== GET my account info ===========================//
router.get("/settings/myAccount", function (req, res, next) {
    if (req.session.passport) {
            User.findOne({id: req.session.passport.user.id}, null, function (err, myAccount) {
                if (err) res.json({error: err});
                else res.json({myAccount: myAccount});
            });
    } else res.status(403).send('Unknown session');
});
//========================== GET USERS list ===========================//
router.get("/settings/users", function (req, res, next) {
    if (req.session.passport) {
        var filterString;
        //if user is not an admin (only admin can view all schools)
        if (req.session.passport.user.GroupId > 1) filterString = {SchoolId: req.session.passport.user.SchoolId};
        // else if request is filtered on a school
        else if (req.query.schoolId && req.query.schoolId > 1) filterString = {SchoolId: req.query.schoolId};
        User.findAll(filterString, null, function (err, users) {
            if (err) res.json({error: err});
            else res.json({users: users});
        });
    } else res.status(403).send('Unknown session');
});

//========================== GET GROUPS list ===========================//
router.get("/settings/groups", function (req, res, next) {
    if (req.session.passport) {
        Group.findAll({id: [">=", req.session.passport.user.GroupId]}, null, function (err, groups) {
            if (err) res.json({error: err});
            else res.json({groups: groups});
        });
    } else res.status(403).send('Unknown session');
});

//========================= NEW USER > SAVE =========================//
router.post("/settings/user", function (req, res, next) {
    var userToDB;
    if (req.session.passport && req.body.user) {
        if (req.body.userId && req.body.userId > 1) {
            if ((req.session.passport.user.id == req.body.userId) || (req.session.passport.user.GroupId <= 2)) {
                // serialize the user
                userToDB = new User.UserSerializer(req.body.user);
                // if user is not admin (ie if user is operator), force the SchoolId
                if (req.session.passport.user.GroupId != 1) userToDB.user.SchoolId = req.session.passport.user.SchoolId;
                // update the user
                userToDB.updateDB(req.body.userId, function (err) {
                    if (err) res.json({error: err});
                    else res.json({});
                });
            }
            else res.json({error: "You don't have enough privilege"});
        } else {
            // serialize the user
            userToDB = new User.UserSerializer(req.body.user);
            // if user is not admin (ie if user is operator)
            if (req.session.passport.user.GroupId != 1) userToDB.user.SchoolId = req.session.passport.user.SchoolId;
            userToDB.user.LanguageId = "0";
            // update the user
            userToDB.insertDB(function (err) {
                if (err) res.json({error: err});
                else res.json({});
            });
        }
    }
});

//========================= DELETE USER =========================//
router.delete('/settings/user', function (req, res) {
    if (req.session.passport) {
        if (req.query.id) {
            var userId = req.query.id;
            User.deleteById(userId, function (err) {
                if (err) res.json({error: err});
                else res.json({});
            })
        }
    } else res.status(403).send('Unknown session');
});

//===============================================================//
//============================ settings CLASS===========================//
//===============================================================//
router.get("/settings/classrooms", function (req, res, next) {
    if (req.session.passport) {
        var filterString;
        //if user is not an admin (only admin can view all schools)
        if (req.session.passport.user.GroupId > 1) filterString = {SchoolId: req.session.passport.user.SchoolId};
        // else if request is filtered on a school
        else if (req.query.schoolId && req.query.schoolId > 1) filterString = {SchoolId: req.query.schoolId};
        Classroom.findAll(filterString, null, function (err, classrooms) {
            if (err) res.json({error: err});
            else res.json({classrooms: classrooms});
        });
    } else res.status(403).send('Unknown session');
});
//===============================================================//
//============================ settings SCHOOLS===========================//
//===============================================================//

//========================== GET SCHOOLS ===========================//
router.get("/settings/schools", function (req, res, next) {
    if (req.session.passport) {
        var filterString;
        //if user is not an admin (only admin can view all schools)
        if (req.session.passport.user.GroupId > 1) filterString = {id: req.session.passport.user.SchoolId};
        // else if request is filtered on a school
        else if (req.query.schoolId && req.query.schoolId > 1) filterString = {id: req.query.schoolId};
        School.findAll(filterString, null, function (err, schools) {
            if (err) res.json({error: err});
            else res.json({schools: schools});
        });
    } else res.status(403).send('Unknown session');
});
//========================== CREATE/UPDATE SCHOOL ===========================//
router.post("/settings/school", function (req, res, next) {
    var SchoolSerializer;
    if (req.session.passport) {
        if (req.body.schoolId && req.body.schoolId > 1 && req.body.school) {
            SchoolSerializer = new School.SchoolSerializer(req.body.school);
            //if user is not an admin (only admin can edit all schools)
            if (req.session.passport.user.GroupId > 1) SchoolSerializer.SchoolId = req.session.passport.user.SchoolId;
            // update the user
            SchoolSerializer.updateDB(req.body.schoolId, function (err) {
                if (err) res.json({error: err});
                else res.json({});
            });
        } else if (req.body.school) {
            // serialize the school
            SchoolSerializer = new School.SchoolSerializer(req.body.school);
            //if user is not an admin (only admin can edit all schools)
            if (req.session.passport.user.GroupId > 1) SchoolSerializer.SchoolId = req.session.passport.user.SchoolId;
            // update the school
            SchoolSerializer.insertDB(function (err) {
                if (err) res.json({error: err});
                else res.json({});
            });
        }
    } else res.status(403).send('Unknown session');
});
//========================== DELETE SCHOOL ===========================//
router.delete('/settings/school', function (req, res) {
    if (req.session.passport) {
        if (req.query.id) {
            var schoolId = req.query.id;
            School.deleteById(schoolId, function (err) {
                if (err) res.json({error: err});
                else res.json({});
            })
        }
    } else res.status(403).send('Unknown session');
});

//===============================================================//
//============================ settings API===========================//
//===============================================================//
function removeDevicesWhenApiIsUnasigned(api, callback) {
    console.info("\x1b[32minfo\x1b[0m:","Removing devices linked to VHM " + api.vhmId);
    Device.findAll({ApiId: api.id}, null, function (err, devices) {
        if (err) callback(err);
        else if (devices == null) callback(null);
        else {
            var deviceNum = 0;
            var errors = [];
            for (var i = 0; i < devices.length; i++) {
                Device.deleteById(devices[i].id, function (err) {
                    deviceNum++;
                    if (err) errors.push(err);
                    if (deviceNum == devices.length) {
                        if (errors.length > 0) callback(errors);
                        else callback(null);
                    }
                })
            }
        }
    });
}

//========================== GET API ===========================//
router.get("/settings/apis", function (req, res, next) {
    if (req.session.passport) {
        var filterString;
        //if user is not an admin (only admin can view all schools)
        if (req.session.passport.user.GroupId > 1) filterString = {SchoolId: req.session.passport.user.SchoolId};
        // else if request is filtered on a school
        else if (req.query.schoolId && req.query.schoolId > 1) filterString = {SchoolId: req.query.schoolId};
        Api.findAll(filterString, null, function (err, apis) {
            if (err) res.json({error: err});
            else res.json({apis: apis});
        });
    } else res.status(403).send('Unknown session');
});
//========================== DELETE API ===========================//
router.delete('/settings/api', function (req, res) {
    if (req.session.passport) {
        if (req.query.id) {
            var apiId = req.query.id;
            Api.deleteById(apiId, function (err) {
                if (err) res.json({error: err});
                else res.json({});
            })
        }
    } else res.status(403).send('Unknown session');
});
//========================== UPDATE API ===========================//
//===   Called when a API configuration is assigned to a School ===//
router.put("/settings/api", function (req, res, next) {
    if (req.session.passport) {
        var apiIdToEdit = req.query.id;
        Api.findById(apiIdToEdit, null, null, function (err, apiFromDB) {
            if (err) res.json({error: err});
            else {
                var apiSerializer = new Api.ApiSerializer(apiFromDB);
                if (apiSerializer.api.SchoolId == 1) apiSerializer.api.SchoolId = "";
                apiSerializer.api.SchoolId = req.query.schoolId;
                // update the user
                apiSerializer.updateDB(apiIdToEdit, function (err) {
                    // If error
                    if (err) res.json({error: err});
                    // If the API is assigned to a new School
                    else if (apiSerializer.api.SchoolId > 1) {
                        // Removing all the devices linked to this API and assigned to this school
                        removeDevicesWhenApiIsUnasigned(apiFromDB, function (err) {
                            if (err) res.json({error: err});
                            else {
                                // Retrieve the devices linked to this API and assigned them to the new school
                                console.info("\x1b[32minfo\x1b[0m:","Retrieving devices linked to VHM " + apiFromDB.vhmId);
                                apiReq.getDevices(apiFromDB, function (err) {
                                    if (err) res.json({error: err});
                                    else res.json({});
                                });
                            }
                        });
                    } else {
                        // Removing all the devices linked to this API and assigned to this school
                        removeDevicesWhenApiIsUnasigned(apiFromDB, function (err) {
                                if (err) res.json({error: err});
                                else res.json({});
                            }
                        )
                    }
                });
            }
        });
    } else res.status(403).send('Unknown session');
});

module.exports = router;