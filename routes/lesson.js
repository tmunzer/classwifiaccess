var User = require("./../models/user");
var api = require('./../bin/ah_api/req');
var Lesson = require("./../models/lesson");
var School = require("./../models/school");


module.exports = function (router, isAuthenticated) {
    /* GET Home Page */
    router.get('/lesson/', isAuthenticated, function (req, res) {
        School.getAll(null, function (err, schoolList) {
            var filterString = null;
            if (req.session.SchoolId =! 1){
                filterString = {SchoolId: req.session.SchoolId}
            }
            Lesson.getAll(filterString, function (err, lessonList) {
                res.render('lesson', {
                    user: req.user,
                    current_page: 'lesson',
                    lessonList: lessonList,
                    schoolList: schoolList,
                    session: req.session,
                    user_button: req.translationFile.user_button
                });
            });
        });

    });
};


