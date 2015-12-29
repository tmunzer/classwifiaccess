var User = require(appRoot + "/models/user");
var api = require(appRoot + '/bin/ah_api/req');
var Classroom = require(appRoot + '/models/classroom');
var School = require(appRoot + "/models/school");
var Lesson = require(appRoot + "/models/lesson");
var apiReq = require(appRoot + '/bin/ah_api/req_device');
var Api = require(appRoot + "/models/api");
var Error = require(appRoot + '/routes/error');


//======================= RENDER CLASSROOMS =======================//
function renderClassroom(filterString, schoolList, req, res){
    Classroom.findAll(filterString, null, function (err, classroomList) {
        if (err) {
            Error.render(err, "classroom", req);
        } else {
            res.render('classroom', {
                user: req.user,
                current_page: 'classroom',
                classroomList: classroomList,
                schoolList: schoolList,
                session: req.session,
                user_button: req.translationFile.user_button,
                classroom_page: req.translationFile.classroom_page,
                buttons: req.translationFile.buttons
            });
        }
    });
}

module.exports = function (router, isAuthenticated) {
    //===============================================================//
    //============================ ROUTES ===========================//
    //===============================================================//

    //======================= LIST CLASSROOMS =======================//
    router.get('/classroom/$', isAuthenticated, function (req, res, next) {
        School.getAll(null, function (err, schoolList) {
            if (err){
                Error.render(err, "classroom", req, res);
            } else {
                // Filter the classroom view based on the current School
                var filterString = {SchoolId: req.session.SchoolId};
                Api.findAll({SchoolId: req.session.SchoolId}, null, function (err, apiList) {
                    if (err){
                        Error.render(err, "classroom", req, res);
                    } else if (apiList){
                        var apiNum = 0;
                        var deviceList = [];
                        for (var i = 0; i < apiList.length; i++) {
                            // Update the Device information for devices (request to ALL configured API for this school)
                            apiReq.getDevices(apiList[i], function (err, devices) {
                                if (err) {
                                    Error.render(err, "classroom", req, res);
                                } else {
                                    deviceList = deviceList.concat(devices);
                                    apiNum++;
                                    if (apiNum == apiList.length) {
                                        renderClassroom(filterString, schoolList, req, res);
                                    }
                                }
                            }.bind(this));
                        }
                    } else {
                        renderClassroom(filterString, schoolList, req, res);
                    }
                });
            }
        });
    });
};
