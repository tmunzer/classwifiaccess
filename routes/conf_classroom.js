var Classroom = require(appRoot + '/models/classroom');
var Device = require(appRoot + "/models/device");
var School = require(appRoot + "/models/school");
var Error = require(appRoot + '/routes/error');


function renderEditClassroom(message, classroomToEdit, req, res) {
    var filterString = null;
    var filterSchoolString = null;
    if (req.user.GroupId != 1) {
        filterString = {SchoolId: req.user.SchoolId};
        filterSchoolString = {id: req.user.SchoolId};
    }
    School.findAll(filterSchoolString, null, function (err, schoolList) {
        if (err) Error.render(err, "conf", req, res);
        else {
            Device.findAll(filterString, null, function (err, deviceList) {
                if (err) Error.render(err, "conf", req, res);
                else {
                    res.render('conf_classroomEdit', {
                        user: req.user,
                        current_page: 'conf',
                        user_button: req.translationFile.user_button,
                        message: message,
                        classroomToEdit: classroomToEdit,
                        schoolList: schoolList,
                        deviceList: deviceList,
                        classroom_page: req.translationFile.config_classroom_page,
                        buttons: req.translationFile.buttons
                    });
                }
            });
        }
    });
}


module.exports = function (router, isAuthenticated, isAtLeastOperator) {
    //=========================================================//
    //========================= PARAM =========================//
    //=========================================================//
    router.param("classroomId", function (req, res, next, classroomId) {
        if (req.user){
            var filterString = null;
            // if user is not admin (ie if user is operator)
            if (req.user.GroupId != 1) {
                filterString = {SchoolId: req.user.SchoolId};
            }
            Classroom.findById(classroomId, filterString, null, function (err, classroom) {
                if (err) {
                    Error.render(err, "conf", req, res);
                }
                else {
                    req.classroomFromDB = classroom;
                    return next();
                }
            })
        } else return next();
    });


    //===============================================================//
    //============================ ROUTES ===========================//
    //===============================================================//

    //====================== DISPLAY CLASSROOM ======================//
    router.get("/conf/classroom/:classroomId(\\d+)/$", isAuthenticated, isAtLeastOperator, function (req, res, next) {
        // render the page
        res.render('conf_classroomDisplay', {
            user: req.user,
            current_page: 'conf',
            user_button: req.translationFile.user_button,
            classroomToEdit: req.classroomFromDB,
            classroom_page: req.translationFile.config_classroom_page,
            buttons: req.translationFile.buttons
        });
    });

    //====================== EDIT CLASSROOM > DISPLAY ======================//
    router.get('/conf/classroom/:classroomId(\\d+)/edit/$', isAuthenticated, isAtLeastOperator, function (req, res, next) {
        renderEditClassroom(null, req.classroomFromDB, req, res)
    });
    //====================== EDIT CLASSROOM > SAVE ======================//
    router.post("/conf/classroom/:classroomId(\\d+)/edit/$", isAuthenticated, isAtLeastOperator, function (req, res, next) {
        // serialize the classroom
        var ClassroomSerializer = new Classroom.ClassroomSeralizer(req.body);
        // update the user
        ClassroomSerializer.updateDB(req.classroomFromDB.id, function (err) {
            if (err) renderEditClassroom(err, ClassroomSerializer.school, req, res);
            else {
                res.redirect('/conf/classroom/' + req.classroomFromDB.id + "/");
            }
        });
    });

    //====================== NEW CLASSROOM > DISPLAY======================//
    router.get("/conf/classroom/new/$", isAuthenticated, isAtLeastOperator, function (req, res, next) {
        // render the page
        renderEditClassroom(null, new Classroom(), req, res);
    });

    //====================== NEW CLASSROOM > SAVE ======================//
    router.post("/conf/classroom/new/$", isAuthenticated, isAtLeastOperator, function (req, res, next) {
        // serialize the user
        var ClassroomSerializer = new Classroom.ClassroomSeralizer(req.body);
        // update the classroom
        ClassroomSerializer.insertDB(function (err) {
            if (err) renderEditClassroom(err, ClassroomSerializer.school, req, res);
            else {
                res.redirect('/conf');
            }
        });
    });

    //====================== DELETE CLASSROOM ======================//
    router.get('/conf/classroom/delete/$', isAuthenticated, isAtLeastOperator, function (req, res) {
        if (req.query.hasOwnProperty("id")) {
            var classroomId = req.query.id;
            Classroom.deleteById(classroomId, function () {
                res.redirect("/conf");
            })

        }
    })

};
