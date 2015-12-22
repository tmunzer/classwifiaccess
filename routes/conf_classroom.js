var Classroom = require('./../models/classroom');
var Device = require("./../models/device");
var School = require("./../models/school");
var Error = require('./error');


module.exports = function (router, isAuthenticated, isAdmin) {
    /* GET User Display page. */
    router.get("/conf/classroom/", isAuthenticated, isAdmin, function (req, res, next) {
        // save the classroomID requested
        var classroomIdToEdit = req.query.id;
        // check if current user is an admin
        // get the classroom to edit in the DB
        Classroom.findById(classroomIdToEdit, null, function (err, classroomToEdit) {
            if (err){
                Error.render(err, "conf", req, res);
            } else {
                // render the page
                res.render('conf_classroomDisplay', {
                    user: req.user,
                    current_page: 'conf',
                    user_button: req.translationFile.user_button,
                    classroomToEdit: classroomToEdit,
                    classroom_page: req.translationFile.config_classroom_page,
                    buttons: req.translationFile.buttons
                });
            }
        });
    });

    /* GET User Edit page. */
    router.get('/conf/classroom/edit', isAuthenticated, isAdmin, function (req, res, next) {
        var classroomIdToEdit = req.query.id;
        Device.getAll(null, function (err, deviceList) {
            if (err){
                Error.render(err, "conf", req, res);
            } else {
                // get the classroom to edit in the DB
                Classroom.findById(classroomIdToEdit, null, function (err, classroomToEdit) {
                    if (err){
                        Error.render(err, "conf", req, res);
                    } else {
                        School.getAll(null, function (err, schoolList) {
                            if (err){
                                Error.render(err, "conf", req, res);
                            } else {
                                // render the page
                                res.render('conf_classroomEdit', {
                                    user: req.user,
                                    current_page: 'conf',
                                    user_button: req.translationFile.user_button,
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
        });
    });
    /* POST - SAVE User Edit page. */
    router.post("/conf/classroom/edit", isAuthenticated, isAdmin, function (req, res, next) {
        var classroomIdToEdit = req.query.id;
        // serialize the classroom
        var ClassroomSerializer = new Classroom.ClassroomSeralizer(req.body);
        // update the user
        ClassroomSerializer.updateDB(classroomIdToEdit, function (err) {
            if (err){
                Error.render(err, "conf", req, res);
            } else {
                res.redirect('/conf/classroom?id=' + classroomIdToEdit);
            }
        });
    });

    /* GET New User page. */
    router.get("/conf/classroom/new/", isAuthenticated, isAdmin, function (req, res, next) {
        // Find the language for this user
        Device.getAll(null, function (err, deviceList) {
            if (err){
                Error.render(err, "conf", req, res);
            } else {
                School.getAll(null, function (err, schoolList) {
                    if (err) {
                        // render the page
                        res.render('conf_classroomEdit', {
                            user: req.user,
                            current_page: 'conf',
                            user_button: req.translationFile.user_button,
                            classroomToEdit: new Classroom(),
                            schoolList: schoolList,
                            deviceList: deviceList,
                            classroom_page: req.translationFile.config_classroom_page,
                            buttons: req.translationFile.buttons
                        });
                    }
                });
            }
        });
    });
    /* POST - SAVE New User Edit . */
    router.post("/conf/classroom/new/", isAuthenticated, isAdmin, function (req, res, next) {
        // serialize the user
        var classroomToDB = new Classroom.ClassroomSeralizer(req.body);
        // update the classroom
        classroomToDB.insertDB(function (err) {
            if (err){
                Error.render(err, "conf", req, res);
            } else {
                res.redirect('/conf');
            }
        });
    });
    router.get('/conf/classroom/delete', isAuthenticated, isAdmin, function (req, res) {
        if (req.query.hasOwnProperty("id")) {
            var classroomId = req.query.id;
            Classroom.deleteById(classroomId, function () {
                res.redirect("/conf");
            })

        }
    })
};
