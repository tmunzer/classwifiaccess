var Classroom = require('./../models/classroom');
var Device = require("./../models/device");
var School = require("./../models/school");

module.exports = function (router, isAuthenticated) {
    /* GET User Display page. */
    router.get("/classroom/", isAuthenticated, function (req, res, next) {
        // save the classroomID requested
        var classroomIdToEdit = req.query.id;
        // check if current user is an admin
        if (req.session.isAdmin) {
            // get the classroom to edit in the DB
            Classroom.findById(classroomIdToEdit, null, function (err, classroomToEdit) {
                // render the page
                res.render('classroomDisplay', {
                    user: req.user,
                    user_button: req.translationFile.user_button,
                    classroomToEdit: classroomToEdit,
                    classroom_page: req.translationFile.classroom_page,
                    buttons: req.translationFile.buttons
                });
            });
        } else {
            res.redirect('/');
        }
    });

    /* GET User Edit page. */
    router.get('/classroom/edit', isAuthenticated, function (req, res, next) {
        var classroomIdToEdit = req.query.id;
        // check if current user is an admin
        if (req.session.isAdmin) {
            Device.getAll(null, function (err, deviceList) {
                // get the classroom to edit in the DB
                Classroom.findById(classroomIdToEdit, null, function (err, classroomToEdit) {
                    School.getAll(null, function (err, schoolList) {
                        // render the page
                        res.render('classroomEdit', {
                            user: req.user,
                            user_button: req.translationFile.user_button,
                            classroomToEdit: classroomToEdit,
                            schoolList: schoolList,
                            deviceList: deviceList,
                            classroom_page: req.translationFile.classroom_page,
                            buttons: req.translationFile.buttons
                        });
                    });
                });
            });
        } else {
            res.redirect('/');
        }
    });
    /* POST - SAVE User Edit page. */
    router.post("/classroom/edit", isAuthenticated, function (req, res, next) {
        var classroomIdToEdit = req.query.id;
        // check if current user is an admin
        if (req.session.isAdmin) {
            // serialize the classroom
            var ClassroomSerializer = new Classroom.ClassroomSeralizer(req.body);
            // update the user
            ClassroomSerializer.updateDB(classroomIdToEdit, function (err) {
                res.redirect('/classroom?id=' + classroomIdToEdit);
            });
        } else {
            res.redirect('/');
        }
    });

    /* GET New User page. */
    router.get("/classroom/new/", isAuthenticated, function (req, res, next) {
        // check if current user is an admin
        if (req.session.isAdmin) {
            // Find the language for this user
            Device.getAll(null, function (err, deviceList) {
                School.getAll(null, function (err, schoolList){
                    // render the page
                    res.render('classroomEdit', {
                        user: req.user,
                        user_button: req.translationFile.user_button,
                        classroomToEdit: new Classroom(),
                        schoolList: schoolList,
                        deviceList: deviceList,
                        classroom_page: req.translationFile.classroom_page,
                        buttons: req.translationFile.buttons
                    });
                });
            });

        } else {
            res.redirect('/');
        }
    });
    /* POST - SAVE New User Edit . */
    router.post("/classroom/new/", isAuthenticated, function (req, res, next) {
        // check if current user is an admin
        if (req.session.isAdmin) {
            // serialize the user
            var classroomToDB = new Classroom.ClassroomSeralizer(req.body);
            // update the classroom
            classroomToDB.insertDB(function (err) {
                res.redirect('/conf');
            });
        } else {
            res.redirect('/');
        }
    });
    router.get('/classroom/delete', isAuthenticated, function (req, res) {
        if (req.session.isAdmin) {
            if (req.query.hasOwnProperty("id")) {
                var classroomId = req.query.id;
                Classroom.deleteById(classroomId, function () {
                    res.redirect("/conf");
                })

            }
        } else {
            res.redirect("/conf");
        }
    })
};
