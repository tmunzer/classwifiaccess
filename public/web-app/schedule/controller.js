angular.module('Schedule').controller("ScheduleCtrl", function ($scope, $rootScope, $location, $mdDialog, scheduleService) {

    $scope.requestForSchedule = null;
    var initialized = false;

    $scope.lessons = [];
    $scope.classrooms = [];
    $scope.schedule = [];

    // pagination
    $scope.itemsByPage = 10;
    $scope.currentPage = 1;

    $scope.table = {
        show: false,
        filter: "",
        order: '-startDate'
    };


    $scope.schoolSelected = function(){
        return $rootScope.schoolId >= 2;
    };

    if ($rootScope.schoolId >= 2){
        getSchedule();
    }

    $rootScope.$watch("schoolId", function(){
        if (initialized && $rootScope.schoolId >= 2 && 'schedules' === $location.path().toString().split("/")[1]){
            getSchedule();
        }
    });

    $scope.isLoaded = function(){
        return scheduleService.isLoaded();
    };

    $scope.activation = function(){
        $mdDialog.show({
            controller: "DialogEnableController",
            templateUrl: "modals/modalEnableContent.html",
            locals: {
                items: {
                }
            }
        }).then(function(){
                getSchedule();
        })
    };

    $scope.deactivation = function(lesson){
        $mdDialog.show({
            controller: "DialogConfirmController",
            templateUrl: "modals/modalConfirmContent.html",
            locals: {
                items: {
                    action: 'disableLesson'
                }
            }
        }).then(function(){
            if ($scope.requestForSchedule) $scope.requestForSchedule.abort();
            $scope.requestForSchedule = scheduleService.disableSchedule($rootScope.schoolId, lesson.id);
            $scope.requestForSchedule.then(function (promise) {
                if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
                getSchedule();
            })
        })
    };

    function getSchedule(){
        if ($scope.requestForSchedule) $scope.requestForSchedule.abort();
        $scope.requestForSchedule = scheduleService.getSchedule();
        $scope.requestForSchedule.then(function (promise) {
            if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
            else {
                initialized = true;
                $scope.classrooms = promise.classrooms;
                $scope.lessons = promise.lessons;
                $scope.isLoaded = function () {
                    return scheduleService.isLoaded();
                }
            }
        });
    };

     $scope.deleteSchedule = function(scheduleId){
        $mdDialog.show({
            controller: "DialogConfirmController",
            templateUrl: "modals/modalConfirmContent.html",
            locals: {
                items: {
                    action: 'removeSchedule'
                }
            }
        }).then(function() {
            var requestForSchedule = scheduleService.deleteSchedule(scheduleId);
            requestForSchedule.then(function (promise) {
                if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
                else getSchedule();
            })
        });
    };

    $scope.planSchedule = function() {
        $mdDialog.show({
            controller: "DialogPlanScheduleController",
            templateUrl: "modals/modalPlanScheduleContent.html",
            locals: {
                items: {}
            }
        }).then(function () {
            getSchedule();
        });
    };
    $scope.editSchedule = function(schedule){
        $mdDialog.show({
            controller: "DialogScheduleController",
            templateUrl: "modals/modalScheduleContent.html",
            locals: {
                items: {
                    schedule: schedule
                }
            }
        }).then(function() {
            getSchedule();
        });
    }
});