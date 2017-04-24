angular.module("Settings").filter("schoolDisplay", function () {
    return function (input) {
        if (!input || input.length === 0) return "None";
        else return input
    }
});

angular.module('Settings').controller("SettingsCtrl", function ($scope, $rootScope, $mdDialog, settingsUsersService, settingsClassroomsService, settingsSchoolsService, settingsApisService) {



    var requestForUsers = null;
    $scope.users;

    $scope.lessons = [];
    $scope.classrooms = [];
    $scope.schedule = [];

    // pagination
    $scope.userItemsByPage = 10;
    $scope.userCurrentPage = 1;
    $scope.userTable = {
        show: false,
        filter: "",
        order: 'username'
    };


    var requestForClassrooms = null;
    $scope.classrooms;

    $scope.classroomItemsByPage = 10;
    $scope.classroomCurrentPage = 1;
    $scope.classroomTable = {
        show: false,
        filter: "",
        order: '-startDate'
    };

    var requestForSchools = null;
    $scope.schools;

    $scope.schoolItemsByPage = 10;
    $scope.schoolCurrentPage = 1;
    $scope.schoolTable = {
        show: false,
        filter: "",
        order: '-startDate'
    };

    var requestForApis = null;
    $scope.apis;

    $scope.apiItemsByPage = 10;
    $scope.apiCurrentPage = 1;
    $scope.apiTable = {
        show: false,
        filter: "",
        order: '-startDate'
    };


    $scope.registerLink = 'https://cloud.aerohive.com/thirdpartylogin?client_id=' + $rootScope.clientId + '&redirect_uri=' + $rootScope.redirectUrl;

    function getUsers() {
        requestForUsers = settingsUsersService.getUsers();
        requestForUsers.then(function (promise) {
            if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
            else {
                $scope.users = promise.users;
            }
        });
    }
    $scope.newUser = function(){
        $mdDialog.show({
            controller: 'DialogUserController',
            templateUrl: 'modals/modalUserContent.html',
            locals: {
                items: {}
            }
        }).then(function () {
            getUsers();
        });
    };
    $scope.editUser = function(user){
        $mdDialog.show({
            controller: 'DialogUserController',
            templateUrl: 'modals/modalUserContent.html',
            locals: {
                items: {
                    userId: user.id,
                    user: user
                }
            }
        }).then(function () {
            getUsers();
        });
    };
    $scope.deleteUser = function(userId){
        $mdDialog.show({
            controller: "DialogConfirmController",
            templateUrl: "modals/modalConfirmContent.html",
            locals: {
                items: {
                    action: 'removeUser'
                }
            }
        }).then(function(){
            var requestForUser = settingsUsersService.deleteUser(userId);
            requestForUser.then(function (promise) {
                if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
                else getUsers();
            })
        })
    };


    function getClassrooms() {
        requestForClassrooms = settingsClassroomsService.getClassrooms();
        requestForClassrooms.then(function (promise) {
            if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
            else {
                $scope.classrooms = promise.classrooms;
            }
        })
    }
    $scope.newClassroom = function(){
        $mdDialog.show({
            controller: 'DialogClassroomController',
            templateUrl: 'modals/modalClassroomContent.html',
            locals: {
                items: {}
            }
        }).then(function () {
            getClassrooms();
        });
    };
    $scope.editClassroom = function (classroom) {
        $mdDialog.show({
            controller: 'DialogClassroomController',
            templateUrl: 'modals/modalClassroomContent.html',
            locals: {
                items: {
                    classroomId: classroom.id,
                    classroom: classroom
                }
            }
        }).then(function () {
            getClassrooms();
        });
    };
    $scope.deleteClassroom = function(classroomId){
        $mdDialog.show({
            controller: "DialogConfirmController",
            templateUrl: "modals/modalConfirmContent.html",
            locals: {
                items: {
                    action: 'removeClassroom'
                }
            }
        }).then(function(){
            requestForClassrooms = settingsClassroomsService.deleteClassroom(classroomId);
            requestForClassrooms.then(function (promise) {
                if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
                else getClassrooms();
            })
        })
    };

    function getSchools() {
        requestForSchools = settingsSchoolsService.getSchools();
        requestForSchools.then(function (promise) {
            if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
            else {
                $scope.schools = promise.schools;
                $rootScope.schools = promise.schools;
            }
        })
    }
    $scope.newSchool = function(){
        $mdDialog.show({
            controller: 'DialogSchoolController',
            templateUrl: 'modals/modalSchoolContent.html',
            locals: {
                items: {
                    school: {}
                }
            }
        }).then(function () {
            getSchools();
        });
    };
    $scope.deleteSchool = function (schoolId) {
        $mdDialog.show({
            controller: "DialogConfirmController",
            templateUrl: "modals/modalConfirmContent.html",
            locals: {
                items: {
                    action: 'removeSchool'
                }
            }
        }).then(function(){
            requestForSchools = settingsSchoolsService.deleteSchool(schoolId);
            requestForSchools.then(function (promise) {
                if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
                else getSchools();
            })
        })
    };
    $scope.editSchool = function (school) {
        $mdDialog.show({
            controller: 'DialogSchoolController',
            templateUrl: 'modals/modalSchoolContent.html',
            locals: {
                items: {
                    schoolId: school.id,
                    school: school
                }
            }
        }).then(function () {
            getSchools();
        });
    };


    function getApis() {
        requestForApis = settingsApisService.getApis();
        requestForApis.then(function (promise) {
            if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
            else {
                $scope.apis = promise.apis;
            }
        })
    }

    $scope.deleteApi = function (accountId) {
        $mdDialog.show({
            controller: "DialogConfirmController",
            templateUrl: "modals/modalConfirmContent.html",
            locals: {
                items: {
                    action: 'removeApi'
                }
            }
        }).then(function(){
            requestForApis = settingsApisService.deleteApi(accountId);
            requestForApis.then(function (promise) {
                if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
                else getApis();
            })
        })
    };

    $scope.editApi = function (api) {
        $mdDialog.show({
            controller: 'DialogApiController',
            templateUrl: 'modals/modalApiContent.html',
            locals: {
                items: {
                    accountId: api.id,
                    schoolId: api.SchoolId,
                    schools: $scope.schools
                }
            }
        }).then(function () {
            getApis();
        });
    };

    $rootScope.$watch("schoolId", function () {
        getUsers();
        getApis();
        getClassrooms();
        getSchools();
    });


});