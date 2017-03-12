angular.module("Device").controller("DeviceCtrl", function($scope, $rootScope, $location, deviceService){
    var requestForDevices = null;
    var initialized = false;

    $scope.showSwitches = false;
    $scope.showAPs = true;

    $scope.changeFilter = function(){
        $scope.devicesFitlered = [];
        $scope.devices.forEach(function (device){
            if (($scope.showSwitches && device.model.indexOf("SR")==0) ||
                ($scope.showAPs && device.model.indexOf("AP")==0)){
              if (device.hostName.toLowerCase().indexOf($scope.table.filter.toLowerCase()) >= 0 ||
                  device.macAddress.toLowerCase().indexOf($scope.table.filter.toLowerCase()) >= 0 ||
                  device.ip.toLowerCase().indexOf($scope.table.filter.toLowerCase()) >= 0 ||
                  device.serialId.toLowerCase().indexOf($scope.table.filter.toLowerCase()) >= 0
              ){
                  $scope.devicesFitlered.push(device);
              }
            }
        });

    };
    $scope.table = {
        filter: ""
    };

    $scope.devices = [];
    $scope.devicesFitlered = [];
    $scope.schoolSelected = function(){
        return $rootScope.schoolId >= 2;
    };

    if ($rootScope.schoolId >= 2){
        getDevices();
    }

    $rootScope.$watch("schoolId", function(){
        if (initialized && $rootScope.schoolId >= 2 && 'devices' === $location.path().toString().split("/")[1]){
            getDevices();
        }
    });

    $scope.isLoaded = function(){
        return deviceService.isLoaded();
    };


    function getDevices(){
        requestForDevices = deviceService.getDevices();
        requestForDevices.then(function (promise) {
            if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
            else {
                initialized = true;
                $scope.devices = promise.devices;
                $scope.devicesFitlered = promise.devices;
                $scope.isLoaded = function () {
                    return deviceService.isLoaded();
                };
                $scope.changeFilter();
            }
        });
    }
});
