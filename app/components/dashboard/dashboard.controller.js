(function () {
    'use strict';

    function DashboardCtrl($scope, $timeout, UserCredentialsService, UserService, TrackService) {
        "ngInject";

        var username;
        var token;
        var credits = UserCredentialsService.getCredentials();
        if (credits) {
            username = credits.username;
            token = credits.password;
        }
        $scope.name_of_user = username;
        $scope.track_number = 0;
        $scope.distance_driven = 0;
        $scope.duration_driven = 0;
        $scope.emailId = "";
        $scope.total_users = 0;
        $scope.total_tracks = 0;
        $scope.total_distance = 0;
        $scope.tracksAvailable = true;

        /**
         * gets a "hh:mm"-representation of a decimal hours number 
         * @param {type} decimalHours
         * @returns {String}
         */
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

        // ask server user email:
        UserService.getUser(username).then(
                function (data) {
                    $scope.emailId = data.mail;
                }, function (data) {
            console.log("Error: " + data);
            console.log(data);
        }
        );

        // ask server for driven userdistance and userduration:
        UserService.getUserStatistic(username).then(
                function (data) {
                    var globalStats = data.data;
                    $scope.distance_driven = globalStats.distance.toFixed(1) + "km";
                    $scope.duration_driven = decimalHoursToHHMM(globalStats.duration) + "h";
                    if(globalStats.trackSummaries) {
                        $scope.track_number = globalStats.trackSummaries.length;
                    }
                    if ($scope.track_number === 0)
                        $scope.tracksAvailable = false;
                }
        , function (error) {
            console.log(error);
        });


    }
    ;

    angular.module('enviroCar')
            .controller('DashboardCtrl', DashboardCtrl);
})();