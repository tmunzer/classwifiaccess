angular.module('Settings').factory("settingsUsersService", function ($http, $q, $rootScope) {
    var isLoaded = false;
    var promise = null;

    function getGroups (){
        isLoaded = false;
        if (promise) promise.abort();

        var canceller = $q.defer();
        var request = $http({
            url: "/api/users/groups",
            method: "GET",
            timeout: canceller.promise
        });

        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else {
                    isLoaded = true;
                    return response.data;
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

    function getUsers() {
        isLoaded = false;
        if (promise) promise.abort();

        var canceller = $q.defer();
        var request = $http({
            url: "/api/users",
            method: "GET",
            params: {schoolId: $rootScope.schoolId},
            timeout: canceller.promise
        });

        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else {
                    isLoaded = true;
                    return response.data;
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

    function getMyAccount() {
        isLoaded = false;
        if (promise) promise.abort();

        var canceller = $q.defer();
        var request = $http({
            url: "/api/users/myAccount",
            method: "GET",
            timeout: canceller.promise
        });

        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else {
                    isLoaded = true;
                    return response.data;
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

    function deleteUser(id) {
        if (promise) promise.abort();

        var canceller = $q.defer();
        var request = $http({
            url: "/api/users",
            method: "DELETE",
            params: {id: id},
            timeout: canceller.promise
        });

        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else return response
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
           // console.info("Cleaning up object references.");
            promise.abort = angular.noop;
            canceller = request = promise = null;
        });
        return promise;
    }

    function updateUser(userId, user){
        if (promise) promise.abort();
        var canceller = $q.defer();
        var request = $http({
            url: "/api/users",
            method: "POST",
            data: {userId: userId, user: user},
            timeout: canceller.promise
        });

        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else {
                    isLoaded = true;
                    return response.data;
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
        getGroups: getGroups,
        getUsers: getUsers,
        getMyAccount: getMyAccount,
        deleteUser: deleteUser,
        updateUser: updateUser,
        isLoaded: function () {
            return isLoaded;
        }
    }
});

angular.module('Settings').factory("settingsClassroomsService", function ($http, $q, $rootScope) {
    var isLoaded = false;
    var promise = null;


    function getClassrooms() {
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
                    isLoaded = true;
                    return response.data;
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

    function deleteClassroom(id) {
        if (promise) promise.abort();

        var canceller = $q.defer();
        var request = $http({
            url: "/api/classrooms",
            method: "DELETE",
            params: {id: id},
            timeout: canceller.promise
        });

        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else return response
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

    function updateClassroom(classroomId, classroom){
        if (promise) promise.abort();
        var canceller = $q.defer();
        var request = $http({
            url: "/api/classrooms",
            method: "POST",
            data: {classroomId: classroomId, classroom: classroom},
            timeout: canceller.promise
        });

        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else {
                    isLoaded = true;
                    return response.data;
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
        getClassrooms: getClassrooms,
        deleteClassroom: deleteClassroom,
        updateClassroom: updateClassroom,
        isLoaded: function () {
            return isLoaded;
        }
    }
});

angular.module('Settings').factory("settingsSchoolsService", function ($http, $q, $rootScope) {
    var isLoaded = false;
    var promise = null;


    function getSchools() {
        isLoaded = false;
        if (promise) promise.abort();

        var canceller = $q.defer();
        var request = $http({
            url: "/api/schools",
            method: "GET",
            timeout: canceller.promise
        });

        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else {
                    isLoaded = true;
                    return response.data;
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
    function deleteSchool(id) {
        if (promise) promise.abort();

        var canceller = $q.defer();
        var request = $http({
            url: "/api/schools",
            method: "DELETE",
            params: {id: id},
            timeout: canceller.promise
        });

        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else return response
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

    function updateSchool(schoolId, school){
        if (promise) promise.abort();
        var canceller = $q.defer();
        var request = $http({
            url: "/api/schools",
            method: "POST",
            data: {schoolId: schoolId, school: school},
            timeout: canceller.promise
        });

        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else {
                    isLoaded = true;
                    return response.data;
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
        getSchools: getSchools,
        updateSchool: updateSchool,
        deleteSchool: deleteSchool,
        isLoaded: function () {
            return isLoaded;
        }
    }
});

angular.module('Settings').factory("settingsApisService", function ($http, $q, $rootScope) {
    var isLoaded = false;
    var promise = null;


    function getApis() {
        isLoaded = false;
        if (promise) promise.abort();

        var canceller = $q.defer();
        var request = $http({
            url: "/api/apis",
            method: "GET",
            params: {schoolId: $rootScope.schoolId},
            timeout: canceller.promise
        });

        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else {
                    isLoaded = true;
                    return response.data;
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

    function deleteApi(id) {
        if (promise) promise.abort();

        var canceller = $q.defer();
        var request = $http({
            url: "/api/apis",
            method: "DELETE",
            params: {id: id},
            timeout: canceller.promise
        });

        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else return response
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

    function assignApi(id, schoolId) {
        if (promise) promise.abort();

        var canceller = $q.defer();
        var request = $http({
            url: "/api/apis",
            method: "PUT",
            params: {id: id, schoolId: schoolId},
            timeout: canceller.promise
        });

        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else return response
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
        getApis: getApis,
        deleteApi: deleteApi,
        assignApi: assignApi,
        isLoaded: function () {
            return isLoaded;
        }
    }
});