(function () {
    'use strict';

    function DashboardCtrl($scope, $timeout, UserCredentialsService, UserService, TrackService) {

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

        // ask server for number of total community tracks:
        TrackService.getTotalTracks(username, token).then(
                function (data) {
                    $scope.total_tracks = data.headers('Content-Range').split("/")[1];
                }, function (data) {
            console.log("error " + data);
        }
        );

        // ask server for number of total users:
        UserService.getTotalUsers(username, token).then(
                function (data) {
                    $scope.total_users = data.headers('Content-Range').split("/")[1];
                }, function (data) {
            console.log("error " + data);
        }
        );

        // ask server user email:
        UserService.getUser(username, token).then(
                function (data) {
                    $scope.emailId = data.data.mail;
                }, function (data) {
            console.log("Error: " + data);
        }
        );

        TrackService.getUserTracks(username, token).then(
                function (data) {
                    var distSum = 0;
                    for (var i = 0; i < data.data.tracks.length; i++) {
                        var currTrack = data.data.tracks[i];
                        if (currTrack.length) {
                            var currDist = currTrack.length;
                            distSum += currDist;
                        }
                    }
                    $scope.distance_driven = distSum.toFixed(1) + "km";
                }, function (data) {
            console.log("Error: " + data);
        }
        );

        // TODO: change API service method
        // ask server for driven userdistance and userduration:
        UserService.getUserStatistic(username, token).then(
                function (data) {
                    console.log(data);
                    var globalStats = data.data;
                    $scope.distance_driven = globalStats.distance.toFixed(1) + "km";
                    $scope.duration_driven = decimalHoursToHHMM(globalStats.duration) + "h";
                    $scope.track_number = globalStats.trackSummaries.length;
                    if ($scope.distance_driven < 0.1)
                        $scope.tracksAvailable = false;
                }
        , function (error) {
            $scope.tracksAvailable = false;
            console.log(error);
        });


    }
    ;

    angular.module('enviroCar')
            .controller('DashboardCtrl', DashboardCtrl);
})();
