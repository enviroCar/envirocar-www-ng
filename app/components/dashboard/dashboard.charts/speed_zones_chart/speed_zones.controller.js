(function () {
    'use strict';
    function SpeedZonesChartCtrl($scope, $timeout, $translate, TrackService, UserService, StatisticsService, UserCredentialsService, ecBaseUrl) {
        
        $scope.onloadSpeedZones = false;
        $scope.loading = true;
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;
        
        // TODO: request server for userstatistics
        // TODO: save userstatistics into scope variables
        
        $scope.onloadSpeedZones = true;
        $timeout(function () {
            window.dispatchEvent(new Event('resize'))
        },
                500);
        $timeout(function () {
            window.dispatchEvent(new Event('resize'))
        },
                1000);
    }
    ;
    angular.module('enviroCar')
            .controller('SpeedZonesChartCtrl', SpeedZonesChartCtrl);
})();
