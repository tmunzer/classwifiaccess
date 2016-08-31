angular.module('cwa').config(function ($routeProvider) {
    $routeProvider
        .when("/classroom", {
            templateUrl: "/web-app/classroom/classroom.html",
            module: "Classroom",
            controller: "ClassroomCtrl"
        })
        .when("/devices", {
            templateUrl: "/web-app/device/device.html",
            module: "Device",
            controller: "DeviceCtrl"
        })
        .when("/schedules", {
            templateUrl: "/web-app/schedule/schedule.html",
            module: "Schedule",
            controller: "ScheduleCtrl"
        })
        .when("/settings", {
            templateUrl: "/web-app/settings/settings.html",
            module: "Settings",
            controller: "SettingsCtrl"
        })
        .otherwise({
            redirectTo: "/classroom/"
        });
});