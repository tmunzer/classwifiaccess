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
                user_button: req.translationFile.user_button
            });
        });
    });
}

function renderActication(req, res, activation, classroomList, currentClassroom){
    res.render("lesson_activation", {
        user: req.user,
        current_page: "lesson",
        activation: activation,
        classroomList: classroomList,
        currentClassroom: currentClassroom,
        activation_page: req.translationFile.activation_page,
        user_button: req.translationFile.user_button,
        buttons: req.translationFile.buttons
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
    router.get("/lesson/activate/", isAuthenticated, function(req, res) {
        var activation = "";
        if (req.query.hasOwnProperty("when")) {
            activation = req.body.when;
        }
        if (req.query.hasOwnProperty("ClassroomId")){
            Classroom.findById(req.query.ClassroomId, null, function(err, currentClassroom) {
                renderActication(req, res, activation, null, currentClassroom);
            })
        } else {
            Classroom.findAll({SchoolId: req.session.SchoolId}, null, function(err, classroomList) {
                renderActication(req, res, activation, classroomList, null);
            })

        }
    });
    router.post("/lesson/activate", isAuthenticated, function(req, res) {
        console.log(req.body);
        res.redirect("back");
    })
};


