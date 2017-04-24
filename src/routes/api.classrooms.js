const express = require('express');
const router = express.Router();
const refreshDevices = require('../bin/refresh_devices');

const Classroom = require('../bin/models/classroom');

//===============================================================//
//============================ classrooms ===========================//
//===============================================================//
router.get('/', function (req, res, next) {
    if (req.session.passport) {
        let filterString;
        //if user is not an admin (only admin can view all schools)
        if (req.session.passport.user.GroupId.value > 1) filterString = { SchoolId: req.session.passport.user.SchoolId };
        // else if request is filtered on a school
        else if (req.query.schoolId && req.query.schoolId > 1) filterString = { SchoolId: req.query.schoolId };

        refreshDevices(filterString, function (err) {
            if (err) res.json({ error: err });
            else
                Classroom.find(filterString, function (err, classroomList) {
                    if (err) res.json({ error: err });
                    else res.json({ classrooms: classroomList });
                });
        })
    } else res.status(403).send('Unknown session');
});
//========================== CREATE/UPDATE classrooms ===========================//
router.post("/", function (req, res, next) {
    let classroom;
    if (req.session.passport) {
        if (req.body.ClassroomId && req.body.classroomId > 0 && req.body.classroom) {
            classroom = req.body.classroom;
            //if user is not an admin (only admin can edit all schools)
            if (req.session.passport.user.GroupId.value > 1) classroom.SchoolId = req.session.passport.user.SchoolId;
            // update the classroom
            Classroom.update({ _id: req.body.classroomId }, { $set: classroom }, function (err) {
                if (err) res.json({ error: err });
                else res.json({});
            });
        } else if (req.body.classroom) {
            classroom = req.body.classroom;
            //if user is not an admin (only admin can edit all schools)
            if (req.session.passport.user.GroupId.value > 1) ClassroomSerializer.SchoolId = req.session.passport.user.SchoolId;
            // update the classroom
            Classroom(classroom).save(function (err) {
                if (err) res.json({ error: err });
                else res.json({});
            });
        }
    } else res.status(403).send('Unknown session');
});
//========================== DELETE classrooms ===========================//
router.delete('/', function (req, res) {
    if (req.session.passport) {
        if (req.query.id) {
            const classroomId = req.query.id;
            Classroom.delete({ _id: classroomId }, function (err) {
                if (err) res.json({ error: err });
                else res.json({});
            })
        }
    } else res.status(403).send('Unknown session');
});
module.exports = router;