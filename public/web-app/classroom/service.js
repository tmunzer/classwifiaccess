angular.module('Classroom').factory("classroomService", function ($http, $q, $rootScope) {
    var classrooms = [];
    var isLoaded = false;
    var promise = null;


    function getClassroomDevices() {
        isLoaded = false;
        if (promise) promise.abort();

        var canceller = $q.defer();
        var request = $http({
            url: "/api/classrooms",
            method: "GET",
            params: {schoolId: $rootScope.schoolId},
            timeout: canceller.promise
        });

        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else {
                    classrooms = response.data;
                    isLoaded = true;
                    return classrooms;
                }
            },
            function (response) {
                if (response.status && response.status >= 0) {
                    $rootScope.$broadcast('serverError', response);
                    return ($q.reject("error"));
                }
            });

        promise.abort = function () {
            canceller.resolve();
        };
        promise.finally(function () {
            //console.info("Cleaning up object references.");
            promise.abort = angular.noop;
            canceller = request = promise = null;
        });

        return promise;
    }

    return {
        getClassroomDevices: getClassroomDevices,
        isLoaded: function () {
            return isLoaded;
        }
    }
});
