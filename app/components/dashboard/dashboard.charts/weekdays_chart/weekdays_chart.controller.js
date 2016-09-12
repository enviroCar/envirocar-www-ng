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
                height: 200,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 45,
                    left: 45
                },
                showValues: true,
                duration: 200,
                xAxis: {
                    axisLabel: $translate.instant("WEEKDAYS"),
                    showMaxMin: false,
                    
                },
                yAxis: {
                    axisLabel: $translate.instant("DISTANCE") + " (km)",
                    axisLabelDistance: -20
                }
            }
        };
        $scope.dataWeekdays = [];

        $scope.$on('toolbar:language-changed', function (event, args) {
            console.log("language changed received.");

            var axisXLabel = $translate.instant("WEEKDAYS");
            var axisYLabel = $translate.instant("DISTANCE") + " (km)";
            $scope.dataWeekdays[0].values[0].x = $translate.instant('SUNDAY');
            $scope.dataWeekdays[0].values[1].x = $translate.instant('MONDAY');
            $scope.dataWeekdays[0].values[2].x = $translate.instant('TUESDAY');
            $scope.dataWeekdays[0].values[3].x = $translate.instant('WEDNESDAY');
            $scope.dataWeekdays[0].values[4].x = $translate.instant('THURSDAY');
            $scope.dataWeekdays[0].values[5].x = $translate.instant('FRIDAY');
            $scope.dataWeekdays[0].values[6].x = $translate.instant('SATURDAY');
            $scope.optionsWeekdays.chart.xAxis = {
                axisLabel: axisXLabel
            };
            $scope.optionsWeekdays.chart.yAxis = {
                axisLabel: axisYLabel,
                axisLabelDistance: -20
            };
        });

        TrackService.getUserTracks($scope.username, $scope.password).then(
                function (data) {
                    console.log(data);
                    var tracks = data.data.tracks;
                    var temp_data = [{
                            key: "Cumulative Return",
                            values: [
                                {
                                    x: $translate.instant('SUNDAY'),
                                    y: 0
                                }, {
                                    x: $translate.instant('MONDAY'),
                                    y: 0
                                },
                                {
                                    x: $translate.instant('TUESDAY'),
                                    y: 0
                                },
                                {
                                    x: $translate.instant('WEDNESDAY'),
                                    y: 0
                                },
                                {
                                    x: $translate.instant('THURSDAY'),
                                    y: 0
                                },
                                {
                                    x: $translate.instant('FRIDAY'),
                                    y: 0
                                },
                                {
                                    x: $translate.instant('SATURDAY'),
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