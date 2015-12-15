var User = require("./../models/user");
var api = require('./../bin/ah_api/req');
var Lesson = require("./../models/lesson");
var School = require("./../models/school");
var Classroom = require("./../models/classroom");


function renderLessons(req, res, filterString, currentClassroom) {
    School.getAll(null, function (err, schoolList) {
        Lesson.findAll(filterString, null, function (err, lessonList) {
            res.render('lesson', {
                user: req.user,
                current_page: 'lesson',
                lessonList: lessonList,
                schoolList: schoolList,
                session: req.session,
                currentClassroom: currentClassroom,
                lesson_page: req.translationFile.lesson_page,
                user_button: req.translationFile.user_button,
                buttons: req.translationFile.buttons
            });
        });
    });
}

function renderActivation(req, res, activation, classroomList, currentClassroom, currentLesson){
    res.render("lesson_activation", {
        user: req.user,
        current_page: "lesson",
        activation: activation,
        classroomList: classroomList,
        currentClassroom: currentClassroom,
        currentLesson: currentLesson,
        activation_page: req.translationFile.activation_page,
        user_button: req.translationFile.user_button,
        buttons: req.translationFile.buttons
    })
}


function newActivaton(req, res, redirectUrl){
    console.log(req.body);
    var lesson = new Lesson();
    lesson.ClassroomId = req.body.ClassroomId;
    lesson.UserId = req.user.id;
    lesson.SchoolId = req.session.SchoolId;
    if (req.body.hasOwnProperty("startDate")){
        lesson.startDate = new Date(req.body.startDate).getTime();
    } else {
        lesson.startDate = new Date().getTime();
    }
    switch(req.body.wifiActivation){
        case "unlimited":
            lesson.endDate = 0;
            break;
        case "duration":
            lesson.endDate = new Date(lesson.startDate + (req.body.duration * 60 * 1000)).getTime();
            break;
        case "until":
            lesson.endDate = new Date(req.body.endDate).getTime();
            break;
    }
    var lessonToDb = new Lesson.LessonSeralizer(lesson);
    lessonToDb.insertDB(function(err){
        if (err){
            res.render("error");
        } else {
            res.redirect(redirectUrl);
        }
    })
}

module.exports = function (router, isAuthenticated) {
    /* GET Home Page */
    router.get('/lesson/', isAuthenticated, function (req, res) {
        var filterString = {};
        if (req.query.hasOwnProperty('ClassroomId')) {
            Classroom.findById(req.query.ClassroomId, null, function(err, currentClassroom){
                filterString = {SchoolId: req.session.SchoolId, ClassroomId: req.query.ClassroomId};
                renderLessons(req, res, filterString, currentClassroom);
            });
        } else {
            filterString = {SchoolId: req.session.SchoolId};
            renderLessons(req, res, filterString, null);
        }
    });

    //========================= NEW LESSON =========================//
    router.get("/lesson/new/", isAuthenticated, function(req, res) {
        var activation = "";
        if (req.query.hasOwnProperty("when")) {
            activation = req.query.when;
        }
        if (req.query.hasOwnProperty("ClassroomId")){
            Classroom.findById(req.query.ClassroomId, null, function(err, currentClassroom) {
                renderActivation(req, res, activation, null, currentClassroom);
            })
        } else {
            Classroom.findAll({SchoolId: req.session.SchoolId}, null, function(err, classroomList) {
                renderActivation(req, res, activation, classroomList, null);
            })

        }
    });
    router.post("/lesson/new/", isAuthenticated, function(req, res){
        if (req.body.hasOwnProperty('wifiActivation')){
            newActivaton(req, res, "/lesson");
        } else {
            res.redirect("/lesson");
        }
    });

    //========================= DELETE LESSON =========================//
    router.get("/lesson/delete/", isAuthenticated, function(req, res) {
        if (req.query.hasOwnProperty("id")){
            Lesson.deleteById(req.query.id, function(err){
                if (err){
                    res.render("error");
                } else {
                    res.redirect('back');
                }
            })
        }
    });

    //========================= EDIT LESSON =========================//
    router.get("/lesson/edit/", isAuthenticated, function(req, res){
        if (req.query.hasOwnProperty('id')){
            Lesson.findById(req.query.id, null, function(err, currentLesson){
                if (err){
                    res.render("error");
                } else {
                    Classroom.findById(currentLesson.ClassroomId, null, function(err, currentClassroom){
                        if (err){
                            res.render("error");
                        } else {
                            renderActivation(req, res, null, null, currentClassroom, currentLesson);
                        }
                    })
                }
            })
        }
    });
    router.post("/lesson/edit/", isAuthenticated, function(req, res){
        if (req.body.hasOwnProperty('LessonId')){
            var lesson = new Lesson.LessonSeralizer(req.body);
            lesson.updateDB(req.body.LessonId);
            renderLessons(req, res, null, null);
        }
    });

    //========================= ENABLE LESSON =========================//
    router.post("/lesson/enable/", isAuthenticated, function(req, res) {
        if (req.body.hasOwnProperty('wifiActivation')){
            newActivaton(req, res, "back");
        } else {
            res.redirect("back");
        }
    });

    //========================= DISABLE LESSON =========================//
    router.post("/lesson/disable/", isAuthenticated, function(req, res, next) {
        if (req.body.hasOwnProperty('ClassroomId')){
            var classroomId = req.body.ClassroomId;
            Lesson.findActive(classroomId, req.session.SchoolId, function(err, ret){
                if (err){
                    res.render('error');
                } else {
                    var lesson = ret[0];
                    lesson.endDate = new Date().getTime();
                    var lessontToDB = new Lesson.LessonSeralizer(lesson);
                    lessontToDB.updateDB(lesson.id, function(err){
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
                    lesson.endDate = new Date().getTime();
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
        } else{
            res.redirect("back");
        }
    })
};


