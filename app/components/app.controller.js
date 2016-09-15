(function () {
    'use strict';

    function AppCtrl($rootScope, $scope, $mdMedia, UserCredentialsService) {
        $scope.message = 'Initial Setup';
        $scope.loggedIn = UserCredentialsService.getCredentials().username !== "";
        $scope.screenIsSmall = false;
        
        $scope.$watch(function () {
            return $mdMedia('xs');
        }, function (big) {
            console.log("screen is small:" + big);
            $scope.screenIsSmall = big;
        });

        $scope.logout = function () {
            UserCredentialsService.clearCredentials();
            UserCredentialsService.clearCookies();
        };

        $scope.loggedIn = function () {
            return $scope.loggedIn;
        };

        //$rootScope.screenIsSmall = $mdMedia('sm');

    }
    ;

    angular.module('enviroCar')
            .controller('AppCtrl', AppCtrl)
})();
