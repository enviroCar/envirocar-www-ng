(function () {
    'use strict';
    function WeekdaysChartCtrl($scope, $timeout, $translate, TrackService, UserCredentialsService) {
        $scope.onload_weekdays = false;
        $scope.loading = true;

        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;

        $scope.optionsWeekdays = {
            chart: {
                type: "discreteBarChart",
                height: 240,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 45,
                    left: 45
                },
                showValues: true,
                duration: 200,
                xAxis: {
                    showMaxMin: false,
                    staggerLabels: true
                },
                yAxis: {
                    axisLabel: "km",
                    axisLabelDistance: -20
                },
                staggerLabels: true,
                tooltip: {
                    contentGenerator: function (d)
                    {
                        var html = '<h3><b>' + d.data.x + '</b> = ' + d.data.y.toFixed(1) + 'km </h3>';
                        return html;
                    }
                }
            }
        };
        $scope.dataWeekdays = [];

        $scope.$on('sidenav:item-selected', function (event, args) {
            $timeout(function () {
                $scope.optionsWeekdays.chart.yAxis.axisLabel = "";
                window.dispatchEvent(new Event('resize'));
                $timeout(function () {
                    $scope.optionsWeekdays.chart.yAxis.axisLabel = "km";
                    window.dispatchEvent(new Event('resize'));
                }, 200);
            }, 100);
            $timeout(function () {
                window.dispatchEvent(new Event('resize'));
            }, 500);
        });

        $scope.$on('toolbar:language-changed', function (event, args) {
            var axisYLabel = "km";
            $scope.dataWeekdays[0].values[0].x = $translate.instant('SUNDAY');
            $scope.dataWeekdays[0].values[1].x = $translate.instant('MONDAY');
            $scope.dataWeekdays[0].values[2].x = $translate.instant('TUESDAY');
            $scope.dataWeekdays[0].values[3].x = $translate.instant('WEDNESDAY');
            $scope.dataWeekdays[0].values[4].x = $translate.instant('THURSDAY');
            $scope.dataWeekdays[0].values[5].x = $translate.instant('FRIDAY');
            $scope.dataWeekdays[0].values[6].x = $translate.instant('SATURDAY');
            $scope.optionsWeekdays.chart.yAxis = {
                axisLabel: axisYLabel,
                axisLabelDistance: -20
            };
            $timeout(function () {
                window.dispatchEvent(new Event('resize'));
            }, 500);
        });

        TrackService.getUserTracks($scope.username, $scope.password).then(
                function (data) {
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

                    for (var index = 0; index < tracks.length; index++) {
                        var track = tracks[index];
                        //var end_date = new Date(track.end);
                        var date = new Date(track.begin);
                        // time spend
                        //var seconds = (end_date - date) / 1000;
                        //var minutes = seconds / 60;
                        if (track.length)
                            temp_data[0].values[date.getDay()].y += track.length;
                        //temp_data[1].values[date.getDay()].y += minutes;
                    }
                    $scope.dataWeekdays = temp_data;
                    $scope.onload_weekdays = true;
                }
        );

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
