(function () {
    'use strict';
    function SpeedZonesChartCtrl($scope, $timeout, $translate, UserService, UserCredentialsService) {

        $scope.onloadSpeedZones = false;
        $scope.loading = true;
        $scope.NaN_exist = false;
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;
        $scope.userstatistics = {
            distance: 0,
            duration: 0,
            distance130: 0,
            duration130: 0,
            distance60: 0,
            duration60: 0,
            distanceNaN: 0,
            durationNaN: 0
        };

        var decimalHoursToHHMM = function (decimalHours) {
            var decimalTime = parseFloat(decimalHours + "");
            decimalTime = 60 * decimalTime;
            var hours = Math.floor(decimalTime / 60);
            decimalTime = decimalTime - (hours * 60);
            var minutes = Math.floor(decimalTime);
            if (hours < 10)
                hours = "0" + hours;
            if (minutes < 10)
                minutes = "0" + minutes;
            return hours + ":" + minutes;
        };

        // TODO: update for user's userstatistic after stable server has it.
        UserService.getUserStatistic($scope.username, $scope.password).then(
                function (data) {
                    console.log(data);
                    var globalStats = data.data;
                    var userStats = data.data.userstatistic;

                    $scope.userstatistics = {
                        distance: globalStats.distance.toFixed(2),
                        duration: decimalHoursToHHMM(globalStats.duration),
                        distance130: userStats.above130kmh.distance.toFixed(2),
                        duration130: decimalHoursToHHMM(userStats.above130kmh.duration),
                        distance60: userStats.below60kmh.distance.toFixed(2),
                        duration60: decimalHoursToHHMM(userStats.below60kmh.duration),
                        distance60to130: (globalStats.distance
                                - userStats.above130kmh.distance
                                - userStats.below60kmh.distance
                                - userStats.NaN.distance).toFixed(2),
                        duration60to130: decimalHoursToHHMM(globalStats.duration
                                - userStats.above130kmh.duration
                                - userStats.below60kmh.duration
                                - userStats.NaN.duration),
                        distanceNaN: userStats.NaN.distance,
                        durationNaN: decimalHoursToHHMM(userStats.NaN.duration)
                    };
                    if ($scope.userstatistics.distanceNaN > 0)
                        $scope.NaN_exist = true;
                    $scope.onloadSpeedZones = true;
                    $timeout(function () {
                        window.dispatchEvent(new Event('resize'));
                        $timeout(function () {
                            window.dispatchEvent(new Event('resize'));
                        },
                                300);
                    },
                            200);
                }
        , function (error) {
            console.log(error);
        });

        $timeout(function () {
            window.dispatchEvent(new Event('resize'))
        },
                300);
    }
    ;

    angular.module('enviroCar')
            .controller('SpeedZonesChartCtrl', SpeedZonesChartCtrl);
})();
