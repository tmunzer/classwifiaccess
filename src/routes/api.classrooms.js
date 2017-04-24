var express = require('express');
var router = express.Router();
var refreshDevices = require('../bin/refresh_devices');

var Classroom = require('../bin/models/classroom');

//===============================================================//
//============================ classrooms ===========================//
//===============================================================//
router.get('/', function (req, res, next) {
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
router.post("/", function (req, res, next) {
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
router.delete('/', function (req, res) {
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
module.exports = router;