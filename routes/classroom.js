var User = require("./../models/user");
var api = require('./../bin/ah_api/req');
var Classroom = require('./../models/classroom');
var School = require("./../models/school");
var Lesson = require("./../models/lesson");

module.exports = function (router, isAuthenticated) {
    /* GET Home Page */
    router.get('/classroom/', isAuthenticated, function (req, res, next) {
        School.getAll(null, function (err, schoolList) {

            var filterString = {SchoolId: req.session.SchoolId};

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
        });
    });
    router.post("/classroom/activate", isAuthenticated, function(req, res, next) {
       console.log(req.body);
        if (req.body.hasOwnProperty('wifiActivation')){
            var lesson = new Lesson();
            lesson.ClassroomId = req.body.classroomId;
            lesson.userId = req.user.userId;
            lesson.SchoolId = req.session.SchoolId;
            lesson.startDate = new Date().getTime();
            switch(req.body.wifiActivation){
                case "unlimited":
                    lesson.endDate = 0;
                    break;
                case "duration":
                    lesson.endDate = new Date(new Date().getTime() + (req.body.duration * 60 * 1000)).getTime();
                    break;
            }
            var lessonToDb = new Lesson.LessonSeralizer(lesson);
            lessonToDb.insertDB(function(err){
                if (err){
                    res.render("error");
                } else {
                    res.redirect("back");
                }
            })
        } else {
            res.redirect("back");
        }
    });
};
