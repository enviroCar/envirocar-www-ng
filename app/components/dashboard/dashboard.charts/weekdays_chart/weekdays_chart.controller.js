(function () {
    'use strict';
    function WeekdaysChartCtrl($scope, $timeout, $translate, TrackService, UserCredentialsService) {
        console.log("WeekdaysChartCtrl started.");
        $scope.onload_weekdays = false;
        $scope.loading = true;

        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;

        $scope.optionsWeekdays = {
            chart: {
                type: "discreteBarChart",
                height: 450,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 45,
                    left: 45
                },
                showValues: true,
                duration: 500,
                xAxis: {
                    axisLabel: "Time (ms)",
                    showMaxMin: false
                },
                yAxis1: {
                    axisLabel: "Distance (km)",
                    axisLabelDistance: -20
                }
            }
        };
        $scope.dataWeekdays = [];

        $scope.$on('toolbar:language-changed', function (event, args) {
            console.log("language changed received.");
            /**
             var axisLabelSpeed = $translate.instant('SPEED') + ' (km/h)';
             $scope.optionsSpeed.chart.yAxis = {
             axisLabel: axisLabelSpeed,
             axisLabelDistance: -10
             };
             */
        });

        TrackService.getUserTracks($scope.username, $scope.password).then(
                function (data) {
                    console.log(data);
                    var tracks = data.data.tracks;
                    var temp_data = [{
                        key: "Cumulative Return",
                        values: [
                            {
                                x: "Sunday",
                                y: 0
                            }, {
                                x: "Monday",
                                y: 0
                            },
                            {
                                x: "Tuesday",
                                y: 0
                            },
                            {
                                x: "Wednesday",
                                y: 0
                            },
                            {
                                x: "Thursday",
                                y: 0
                            },
                            {
                                x: "Friday",
                                y: 0
                            },
                            {
                                x: "Saturday",
                                y: 0
                            }
                        ],
                        yAxis: 1,
                        type: "bar"
                    }];
                    console.log(temp_data);

                    for (var index = 0; index < tracks.length; index++) {
                        var track = tracks[index];
                        //var end_date = new Date(track.end);
                        var date = new Date(track.begin);
                        // time spend
                        //var seconds = (end_date - date) / 1000;
                        //var minutes = seconds / 60;

                        temp_data[0].values[date.getDay()].y += track.length;
                        //temp_data[1].values[date.getDay()].y += minutes;
                    }
                    $scope.dataWeekdays = temp_data;
                    $scope.onload_weekdays = true;
                }

        );
        /**
         getUserPhenomenonStatistics($scope.username, $scope.password, "Speed").then(
         function (data) {
         console.log(data);
         var store = data.data;
         var speed_user = store.avg;
         StatisticsService.getPhenomenonStatistics($scope.username, $scope.password, "Speed").then(
         function (data) {
         console.log(data);
         store = data.data;
         var speed_public = store.avg;
         $scope.dataSpeed = [{
         key: "Cumulative Return",
         values: [{
         "label": "LABEL_USER",
         "value": speed_user
         }, {
         "label": "LABEL_PUBLIC",
         "value": speed_public
         }]
         }]
         dataotherusers.push(data);
         $scope.onload_speed = true;
         if ($scope.onload_CO2 && $scope.onload_consumption && $scope.onload_engine) {
         window.dispatchEvent(new Event('resize'));
         $scope.onload_all = true;
         }
         window.dispatchEvent(new Event('resize'));
         }, function (data) {
         console.log("error " + data);
         });
         }, function (data) {
         console.log("error " + data);
         });
         */

        $timeout(function () {
            window.dispatchEvent(new Event('resize'));
        }, 300);
        $timeout(function () {
            window.dispatchEvent(new Event('resize'));
        }, 700);
    }
    ;
    angular.module('enviroCar')
            .controller('WeekdaysChartCtrl', WeekdaysChartCtrl);
})();
