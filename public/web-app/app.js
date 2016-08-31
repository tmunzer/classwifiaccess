angular.module("Classroom", []);
angular.module("Device", []);
angular.module("Schedule", []);
angular.module("Settings", []);
angular.module("Modals", []);
angular.module("CustomFilters", []);
var cwa = angular.module("cwa", [
    "ngRoute",
    'ui.bootstrap',
    'ngSanitize',
    'ngMaterial',
    'ngMessages',
    'md.data.table',
    'CustomFilters',
    'Classroom',
    'Device',
    'Schedule',
    'Settings',
    'Modals',
    'scDateTime',
    'pascalprecht.translate'
]);

cwa
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette("blue", {
                'default': '600'
            })
            .accentPalette('green', {
                'default': '400' // by default use shade 400 from the pink palette for primary intentions
            });
    }).config(['$httpProvider', function ($httpProvider) {
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // Answer edited to include suggestions from comments
        // because previous version of code introduced browser-related errors

        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }]).config(function ($translateProvider) {
        $translateProvider.useMissingTranslationHandlerLog();
        $translateProvider
            .translations('en', en)
            .translations('fr', fr)
            .registerAvailableLanguageKeys(['en', 'fr'], {
                'en_*': 'en',
                'fr_*': 'fr'
            })
            .determinePreferredLanguage()
            .fallbackLanguage('en')
            .usePostCompiling(true)
            .useSanitizeValueStrategy("escapeParameters");

    });



cwa.controller("UserCtrl", function ($scope, $rootScope, $mdDialog, $mdSidenav, $location, $translate) {
    $rootScope.GroupId = angular.element(document.getElementsByName('GroupId')[0]).val();
    $scope.authorizedLevel = function(level){
        return $rootScope.GroupId <= level;
    };


    var originatorEv;
    this.openMenu = function ($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };
    this.sideNav = function (id) {
        $mdSidenav(id).toggle()
    };
    this.showFab = function () {
        var haveFab = ["/monitor", "/credentials"];
        return (haveFab.indexOf($location.path().toString()) > -1);
    };
    this.translate = function (langKey){
        $translate.use(langKey);
    }
});

cwa.controller("HeaderCtrl", function ($scope, $rootScope, $location, $mdDialog, settingsSchoolsService) {
    $rootScope.clientId = angular.element(document.getElementsByName('clientId')[0]).val();
    $rootScope.redirectUrl = angular.element(document.getElementsByName('redirectUrl')[0]).val();

    $scope.myAccount = function(){
        console.log("test");
        $mdDialog.show({
            controller: 'DialogMyAccountController',
            templateUrl: 'modals/modalMyAccountContent.html',
            locals: {
                items: {}
            }
        });
    };

    $scope.schools = [];
    var requestForSchools = settingsSchoolsService.getSchools();
    requestForSchools.then(function (promise) {
        if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
        else {
            $rootScope.schools = promise.schools;
        }
    });
    $rootScope.$watch("schools", function () {
        $scope.schools = $rootScope.schools;
    });


    $scope.$watch('schoolId', function(){
        $rootScope.schoolId = $scope.schoolId;
    });


    $scope.nav = {};
    $scope.nav.isActive = function (path) {
        if (path === $location.path().toString().split("/")[1]) return true;
        else return false;
    };
    $scope.subnav = {};
    $scope.subnav.isActive = function (path) {
        if (path === $location.path().toString().split("/")[2]) return true;
        else return false;
    };


});

