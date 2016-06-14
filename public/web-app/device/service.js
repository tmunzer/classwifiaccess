angular.module('Device').factory("deviceService", function ($http, $q, $rootScope) {
    var devices = [];
    var isLoaded = false;
    var promise = null;


    function getDevices() {
        isLoaded = false;

        var canceller = $q.defer();
        var request = $http({
            url: "/api/devices",
            method: "GET",
            params: {schoolId: $rootScope.schoolId},
            timeout: canceller.promise
        });

        if (promise) promise.abort();
        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else {
                    devices = response.data;
                    isLoaded = true;
                    return devices;
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
        getDevices: getDevices,
        isLoaded: function () {
            return isLoaded;
        }
    }
});

