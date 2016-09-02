(function () {
    'use strict';
    function SpeedZonesChartCtrl($scope, $state, $translate, TrackService, UserService, StatisticsService, UserCredentialsService, ecBaseUrl) {
        console.log("SpeedZonesChartCtrl started.");
        $scope.onloadSpeedPie = false;
        $scope.loading = true;
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;
        $scope.dataSpeedPie = {
        };
        var urlredirect = '#/dashboard/chart/';

        $scope.options_pie = {
            chart: {
                type: 'pieChart',
                height: 290,
                margin: {
                    top: 10,
                    right: 0,
                    bottom: 70,
                    left: 50
                },
                x: function (d) {
                    return d.key;
                },
                y: function (d) {
                    return d.y;
                },
                showLabels: true,
                labelThreshold: 0.01,
                valueFormat: function (d) {
                    return d3.format(',.4f')(d);
                },
                duration: 300,
                labelsOutside: true,
                showLegend: true,
                legendPosition: 'top',
                tooltip: {
                    contentGenerator: function (d) {
                        var html = '<h3><b>' + d.data.key + '</b> - ' + d.data.y.toFixed(2) + '%</h3>';
                        return(html);
                    }
                }
            }
        };

        $scope.speedPieOptions = ['Distance', 'Time'];
        $scope.pieSpeedRanges = 'Distance';

        var speedgraph_data = {
            "user": "naveen-gsoc",
            "distance": 3344.22,
            "duration": 50.2,
            "statistics": {
                "0": {
                    "distance": 1610.2,
                    "duration": 32.1
                },
                "60": {
                    "distance": 502.34,
                    "duration": 7.1
                },
                "130": {
                    "distance": 400.56,
                    "duration": 4
                }
            }
        };
        var dataSpeedContainer = {
            'Distance': [{
                    key: '0-60 km/h',
                    y: (speedgraph_data.statistics['0'].distance * 100) / (
                            speedgraph_data.statistics['0'].distance +
                            speedgraph_data.statistics['60'].distance +
                            speedgraph_data.statistics['130'].distance)
                }, {
                    key: '61-130 km/h',
                    y: (speedgraph_data.statistics['60'].distance * 100) / (
                            speedgraph_data.statistics['0'].distance +
                            speedgraph_data.statistics['60'].distance +
                            speedgraph_data.statistics['130'].distance)
                }, {
                    key: '> 130km/Hr',
                    y: (speedgraph_data.statistics['130'].distance * 100) / (
                            speedgraph_data.statistics['0'].distance +
                            speedgraph_data.statistics['60'].distance +
                            speedgraph_data.statistics['130'].distance)
                }],
            'Time': [{
                    key: '0-60 km/h',
                    y: speedgraph_data.statistics['0'].duration
                }, {
                    key: '61-130 km/h',
                    y: speedgraph_data.statistics['60'].duration
                }, {
                    key: '> 130km/h',
                    y: speedgraph_data.statistics['130'].duration
                }]
        };
        $scope.dataSpeedPie = dataSpeedContainer[$scope.pieSpeedRanges];
        $scope.onloadSpeedPie = true;
        $scope.changePhenomenonPieSpeed = function (option) {
            $scope.pieSpeedRange = option;
            $scope.dataSpeedPie = dataSpeedContainer[option];
        };

    }
    ;
    angular.module('enviroCar')
            .controller('SpeedZonesChartCtrl', SpeedZonesChartCtrl);

})();
