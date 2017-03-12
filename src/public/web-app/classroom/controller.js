angular.module('Classroom').controller("ClassroomCtrl", function ($scope, $rootScope, $location, $mdDialog, classroomService, scheduleService) {
    var requestForClassrooms = null;
    $scope.classrooms = [];
    $scope.classroomsFiltered = [];
    $scope.schoolSelected = function () {
        return $rootScope.schoolId >= 2;
    };

    $scope.showNotConfigured = false;
    $scope.showNotConnected = false;
    $scope.table = {
        filter: ""
    };

    $scope.changeFilter = function () {
        $scope.classroomsFiltered = [];
        $scope.classrooms.forEach(function (classroom) {
            if (classroom.classroomName.indexOf($scope.table.filter) >= 0) {
                if ($scope.showNotConfigured && $scope.showNotConnected) $scope.classroomsFiltered.push(classroom);
                else if ($scope.showNotConfigured && classroom.deviceConnected != "false") $scope.classroomsFiltered.push(classroom);
                else if (classroom.DeviceId != "" && $scope.showNotConnected) $scope.classroomsFiltered.push(classroom);
                else if (classroom.deviceConnected == "true") $scope.classroomsFiltered.push(classroom);
            }
        });
    };

    $rootScope.$watch("schoolId", function () {
        if ($rootScope.schoolId >= 2 && 'classroom' === $location.path().toString().split("/")[1]) {
            getClassrooms();
        }
    });

    $scope.isLoaded = function () {
        return classroomService.isLoaded();
    };

    $scope.activation = function(classromm){
        $mdDialog.show({
            controller: 'DialogEnableController',
            templateUrl: 'modals/modalEnableContent.html',
            locals: {
                items: {
                    classroom: classromm
                }
            }
        }).then(function () {
            getClassrooms();
        });
    };

    $scope.deactivation = function(classroom){
        $mdDialog.show({
            controller: "DialogConfirmController",
            templateUrl: "modals/modalConfirmContent.html",
            locals: {
                items: {
                    action: 'disableWifiForClassroom'
                }
            }
        }).then(function(){
            getClassrooms();
            var disableSchedule = scheduleService.disableScheduleForClassroom($rootScope.schoolId, classroom.id);
            disableSchedule.then(function (promise) {
                if (promise && promise.error) $scope.$broadcast("apiError", promise.error);

            })
        })
    };
    function getClassrooms() {
        requestForClassrooms = classroomService.getClassroomDevices();
        requestForClassrooms.then(function (promise) {
            if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
            else {
                $scope.classrooms = promise.classrooms;
                $scope.isLoaded = function () {
                    return classroomService.isLoaded();
                };
                $scope.changeFilter();
            }
        });
    }
});