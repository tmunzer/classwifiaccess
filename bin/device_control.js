var ssh = require('./ssh/ssh');
var Classroom = require("./../models/classroom");
var School = require("./../models/school");
var Device = require("./../models/device");
var Lesson = require("./../models/lesson");


function lessonDisableDone(LessonId, callback){
    Lesson.findById(LessonId, null, function(err, lesson){
        if (err) callback(err);
        else {
            lesson.endDone = "true";
            var lessonToDb = new Lesson.LessonSeralizer(lesson);
            lessonToDb.updateDB(lesson.id, function(err){
                callback(err);
            })
        }
    })
}
function lessonEnableDone(LessonId, callback){
    Lesson.findById(LessonId, null, function(err, lesson){
        if (err) callback(err);
        else {
            lesson.startDone = "true";
            var lessonToDb = new Lesson.LessonSeralizer(lesson);
            lessonToDb.updateDB(lesson.id, function(err){
                callback(err);
            })
        }
    })
}
function disableWiFi (DeviceId, SchoolId, LessonId, callback) {
    // check if other classrooms are using this device
    Classroom.findActiveByDevice(DeviceId, SchoolId, function (err, ret) {
        if (err) callback(err);
        else {
            // if no more classroom are using this device, disable the Wi-Fi
            if (ret.length == 0) {
                // retrive the device's information
                Device.findById(DeviceId, null, function (err, device) {
                    if (err) callback(err);
                    // retrieve the school's information
                    School.findById(SchoolId, null, function (err, school) {
                        if (err) callback(err);
                        //TODO sent a error message telling SSH is not configured for this school
                        else if (school == null) callback(null);
                        else try {
                                if (device && device.hasOwnProperty("ip")){
                                    ssh.execute(device.ip, ['disableWiFi'], school.sshAdmin, school.sshPassword, function (err) {
                                        if (err) callback(err);
                                        else lessonDisableDone(LessonId, function(err){
                                            callback(err);
                                        });
                                    });
                                } else {
                                    callback(null);
                                }
                            } catch (e) {
                                callback(e);
                            }
                    });
                })
            } else {
                lessonDisableDone(LessonId, function (err) {
                    callback(err);
                });
            }
        }
    })
}
function enableWiFi(DeviceId, SchoolId, LessonId, callback) {
    Device.findById(DeviceId, null, function (err, device) {
        if (err) callback(err);
        School.findById(SchoolId, null, function (err, school) {
            if (err) callback(err);
            //TODO sent a error message telling SSH is not configured for this school
            else if (school == null) callback(null);
            else try {
                    if (device && device.hasOwnProperty("ip")) {
                        ssh.execute(device.ip, ['enableWiFi'], school.sshAdmin, school.sshPassword, function (err) {
                            if (err) callback(err);
                            else lessonEnableDone(LessonId, function(err){
                                callback(err);
                            });
                        });
                    } else {
                        callback(null);
                    }
                } catch (e) {
                    callback(e);
                }
        });
    });
}
function checkLessons(){
    console.log("check lessons");
    School.getAll(null, function(err, schools){
        if (err) console.log("===== CRON ERROR #1: "+err);
        else {
            for (var snum in schools){
                var schoolId = schools[snum].id;

                Lesson.findActiveButNotEnabled(schoolId, function (err, lessons){
                    if (err) console.log("===== CRON ERROR #2.1: "+err);
                    for (var lnum in lessons){
                        var lesson = lessons[lnum];
                        enableWiFi(lesson.DeviceId, this.schoolId, lesson.id, function(err){
                            if (err) console.log("===== CRON ERROR #2.2: "+err);
                        }.bind({lesson: lesson}))
                    }
                }.bind({schoolId:schoolId}));


                Lesson.findPassedButNotDisabled(schoolId, function (err, lessons){
                    if (err) console.log("===== CRON ERROR #3.1: "+err);
                    for (var lnum in lessons){
                        var lesson = lessons[lnum];
                        disableWiFi(lesson.DeviceId, this.schoolId, lesson.id, function(err){
                            if (err) console.log("===== CRON ERROR #3.2: "+err);
                        }.bind({lesson: lesson, schoolId: this.schoolId}))
                    }
                }.bind({schoolId:schoolId}));
            }

        }
    });
}

module.exports.enableWiFi = enableWiFi;
module.exports.disableWiFi = disableWiFi;
module.exports.checkLessons = checkLessons;