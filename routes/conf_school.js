var School = require('./../models/school');
var Error = require('./error');

module.exports = function (router, isAuthenticated, isAdmin) {
    /* GET User Display page. */
    router.get("/conf/school/", isAuthenticated, isAdmin, function (req, res, next) {
        // save the schoolID requested
        var schoolIdToEdit = req.query.id;
        // get the school to edit in the DB
        School.findById(schoolIdToEdit, null, function (err, schoolToEdit) {
            if (err){
                Error.render(err, "conf", req);
            } else {
                // render the page
                res.render('conf_schoolDisplay', {
                    user: req.user,
                    current_page: 'conf',
                    user_button: req.translationFile.user_button,
                    schoolToEdit: schoolToEdit,
                    school_page: req.translationFile.config_school_page,
                    buttons: req.translationFile.buttons
                });
            }
        });
    });

    /* GET User Edit page. */
    router.get('/conf/school/edit', isAuthenticated, isAdmin, function (req, res, next) {
        var schoolIdToEdit = req.query.id;
        // get the school to edit in the DB
        School.findById(schoolIdToEdit, null, function (err, schoolToEdit) {
            if (err){
                Error.render(err, "conf", req);
            } else {
                // render the page
                res.render('conf_schoolEdit', {
                    user: req.user,
                    current_page: 'conf',
                    user_button: req.translationFile.user_button,
                    schoolToEdit: schoolToEdit,
                    school_page: req.translationFile.config_school_page,
                    buttons: req.translationFile.buttons
                });
            }
        });
    });
    /* POST - SAVE User Edit page. */
    router.post("/conf/school/edit", isAuthenticated, isAdmin, function (req, res, next) {
        var schoolIdToEdit = req.query.id;
        // serialize the school
        var SchoolSerializer = new School.SchoolSerializer(req.body);
        // update the user
        SchoolSerializer.updateDB(schoolIdToEdit, function (err) {
            if (err){
                Error.render(err, "conf", req);
            } else {
                res.redirect('/conf/school?id=' + schoolIdToEdit);
            }
        });
    });

    /* GET New User page. */
    router.get("/conf/school/new/", isAuthenticated, isAdmin, function (req, res, next) {
        // Find the language for this user
        // render the page
        res.render('conf_schoolEdit', {
            user: req.user,
            current_page: 'conf',
            user_button: req.translationFile.user_button,
            schoolToEdit: new School(),
            school_page: req.translationFile.config_school_page,
            buttons: req.translationFile.buttons
        });
    });
    /* POST - SAVE New User Edit . */
    router.post("/conf/school/new/", isAuthenticated, isAdmin, function (req, res, next) {
        // serialize the user
        var schoolToDB = new School.SchoolSerializer(req.body);
        // update the school
        schoolToDB.insertDB(function (err) {
            if (err){
                Error.render(err, "conf", req);
            } else {
                res.redirect('/conf');
            }
        });
    });
    router.get('/conf/school/delete', isAuthenticated, isAdmin, function (req, res) {
        if (req.query.hasOwnProperty("id")) {
            var schoolId = req.query.id;
            School.deleteById(schoolId, function () {
                res.redirect("/conf");
            })

        }
    })
};
