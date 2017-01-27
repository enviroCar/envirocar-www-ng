(function () {
    'use strict';

    function AppCtrl($scope, $mdMedia, UserCredentialsService, FilterStateService) {
        $scope.message = 'Initial Setup';
        $scope.loggedIn = UserCredentialsService.getCredentials().username !== "";
        $scope.screenIsXS = $mdMedia('xs');
        $scope.screenIsSM = $mdMedia('sm');
        $scope.screenIsGTSM = $mdMedia('gt-sm');
        $scope.screenIsMD = $mdMedia('md');
        $scope.screenIsGTMD = $mdMedia('gt-md');

        $scope.$watch(function () {
            return $mdMedia('xs');
        }, function (big) {
            console.log("screen is XS:" + big);
            $scope.screenIsXS = big;
        });
        
        $scope.$watch(function () {
            return $mdMedia('sm');
        }, function (big) {
            console.log("screen is SM:" + big);
            $scope.screenIsSM = big;
        });
        
        $scope.$watch(function () {
            return $mdMedia('gt-sm');
        }, function (big) {
            console.log("screen is gt-SM:" + big);
            $scope.screenIsGTSM = big;
        });
        
        $scope.$watch(function () {
            return $mdMedia('md');
        }, function (big) {
            console.log("screen is MD:" + big);
            $scope.screenIsMD = big;
        });
        
        $scope.$watch(function () {
            return $mdMedia('gt-md');
        }, function (big) {
            console.log("screen is gt-MD:" + big);
            $scope.screenIsGTMD = big;
        });

        $scope.logout = function () {
            UserCredentialsService.clearCredentials();
            UserCredentialsService.clearCookies();
            FilterStateService.resetFilterStates();
        };

        $scope.loggedIn = function () {
            return $scope.loggedIn;
        };
    }
    ;

    angular.module('enviroCar')
            .controller('AppCtrl', AppCtrl)
})();
