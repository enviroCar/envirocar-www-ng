(function () {
    'use strict';
    function SpeedZonesChartCtrl($scope, $timeout, $translate, TrackService, UserService, StatisticsService, UserCredentialsService, ecBaseUrl) {
        console.log("SpeedZonesChartCtrl started.");
        $scope.onloadSpeedZones = false;
        $scope.loading = true;
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;
        $scope.dataSpeedZones = [
                
                    {
                        "key": "> 130 km/h",
                        "color": "#efadcb",
                        "values": [
                            {
                                "label": "2894km 18h",
                                "value": 10.0
                            },{
                                "label": "4619km 53h",
                                "value": 0
                            },{
                                "label": "1552km 31h",
                                "value": 0
                            },{
                                "label": "6130km 192h",
                                "value": 0
                            }
                        ]
                    }, {
                        "key": "60 - 130 km/h",
                        "color": "#ff0000",
                        "values": [
                            {
                                "label": "2894km 18h",
                                "value": 0
                            },{
                                "label": "4619km 53h",
                                "value": 8.0
                            },{
                                "label": "1552km 31h",
                                "value": 0
                            },{
                                "label": "6130km 192h",
                                "value": 0
                            }
                        ]
                    }, {
                        "key": "30 - 60 km/h",
                        "color": "#00ff00",
                        "values": [
                            {
                                "label": "2894km 18h",
                                "value": 0
                            },{
                                "label": "4619km 53h",
                                "value": 0
                            },{
                                "label": "1552km 31h",
                                "value": 6
                            },{
                                "label": "6130km 192h",
                                "value": 0
                            }
                        ]
                    }, {
                        "key": "0 - 30 km/h",
                        "color": "#0000ff",
                        "values": [
                            {
                                "label": "2894km 18h",
                                "value": 0
                            },{
                                "label": "4619km 53h",
                                "value": 0
                            },{
                                "label": "1552km 31h",
                                "value": 0
                            },{
                                "label": "6130km 192h",
                                "value": 4
                            }
                        ]
                    }];
        var urlredirect = '#/dashboard/chart/';

        $scope.options_speed = {
            chart: {
                type: "multiBarHorizontalChart",
                height: 270,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showControls: false,
                showValues: false,
                labelsInside: true,
                duration: 500,
                stacked: true,
                xAxis: {
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: 'Time and Duration'
                }
            }
        };

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
