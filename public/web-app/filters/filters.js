angular.module("CustomFilters").filter("ssidStringFromArray", function () {
    return function (input) {
        if (!input || input.length === 0) return "";
        else {
            var string = "";
            input.forEach(function (ssid) {
                string += ssid + ", ";
            });
            string = string.trim().slice(0, -1);
            return string;
        }
    }
});

angular.module('CustomFilters').filter('locationFromArray', function () {
    return function (input) {
        if (input) {
            var location = "";
            input.forEach(function (loc) {
                location += loc + ", ";
            });
            location = location.slice(0, location.length - 2);
            return location;
        } else return "";

    }
});

angular.module('CustomFilters').filter('deviceStatus', function ($filter) {
    return function (input) {
        if (input.toString() === "false") return "<span class='badge badge-danger'>" + $filter('translate')('device.disconnected') + "</span>";
        else if (input.toString() === "true") return "<span class='badge badge-success'>" + $filter('translate')('device.connected') + "</span>";
        else return "";
    }
});


angular.module('CustomFilters').filter('scheduleStatus', function ($filter) {
    return function (input) {
        if (input === "present") return "<span class='badge badge-success'>" + $filter('translate')('schedule.inProgress') + "</span>";
        else if (input === "past") return "<span class='badge badge-danger'>" + $filter('translate')('schedule.finished') + "</span>";
        else if (input === "future") return "<span class='badge badge-primary'>" + $filter('translate')('schedule.notStarted') + "</span>";
        else return "";
    }
});

angular.module('CustomFilters').filter('userStatus', function ($filter) {
    return function (input) {
        if (input === "true") return '<i class="material-icons md-18 color-success">done</i>';
        else if (input === "false") return '<i class="material-icons md-18 color-danger">not_interested</i>';
        else return "";
    }
});

angular.module('CustomFilters').filter('classroomWifiStatus', function ($filter) {
    return function (input) {
        if (input.toString() === "false") return "" +
            "<div class='badge badge-danger'>" +
            "<i class='material-icons md-18'>signal_cellular_off</i>" +
            "<span>" + $filter('translate')('classroom.disable') + "</span>" +
            "</div>";
        else if (input.toString() === "true") return "" +
            "<div class='badge badge-success'>" +
            "<i class='material-icons md-18'>signal_cellular_4_bar</i>" +
            "<span>" + $filter('translate')('classroom.enable') + "</span>" +
            "</div>";
        else return "" +
            "<div class='badge badge-unknown'>" +
            "<i class='material-icons'>signal_cellular_connected_no_internet_4_bar</i>" +
            "<span>" + $filter('translate')('classroom.unknown') + "</span>" +
            "</div>";
    }
});
angular.module('CustomFilters').filter('classroomDeviceStatus', function ($filter) {
    return function (input) {
        if (input.deviceConnected.toString() === "false") return "<div class='alert-danger'>" + $filter('translate')('classroom.isNotConnected', {hostName: input.deviceHostname}) + "</div>";
        else if (input.deviceConnected.toString() === "true") return "<div class='alert-success'>" + $filter('translate')('classroom.isConnected', {hostName: input.deviceHostname}) + "</div>";
        else return "<div class='alert-danger'>" + $filter('translate')('classroom.noDeviceConfigured') + "</div>";
    }
});
