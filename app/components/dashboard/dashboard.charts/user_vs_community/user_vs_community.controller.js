(function () {
    'use strict';

    function UserVsCommunityChartCtrl($scope, $state, $translate, TrackService, UserService, StatisticsService, UserCredentialsService, ecBaseUrl) {
        console.log("UserVsCommunityCtrl started.");
        $scope.onload_user_vs_public = false;
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;
        var urlredirect = '#/dashboard/chart/';
        UserService.getTotalUserTracks($scope.username, $scope.password).then(
                function (data) {
                    $scope.track_number = data.headers('Content-Range').split("/")[1];
                    console.log(data.data);
                }, function (data) {
            console.log("error " + data);
        }
        );

        var speed_users;
        var speed_public;
        $scope.optionsSpeed = {
            chart: {
                type: 'discreteBarChart',
                height: 260,
                width: 300,
                margin: {
                    top: 10,
                    right: 0,
                    bottom: 70,
                    left: 50
                },
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                showValues: true,
                valueFormat: function (d) {
                    return d3.format(',.4f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: 'User vs Public '
                },
                yAxis: {
                    axisLabel: 'Speed(Km/Hr)',
                    axisLabelDistance: -20
                },
                tooltip: {
                    contentGenerator: function (d)
                    {
                        var html = '<h3><b>' + d.data.label + '</b> = ' + d.data.value.toFixed(2) + '</h3>';
                        return html;
                    }
                }
            }
        };
        var consumption_users;
        var consumption_public;
        var CO2_users;
        var CO2_public;
        var engineload_users;
        var engineload_public;
        $scope.barchartoptions = ["Speed", "Consumption", "CO2"];
        $scope.barchartshowing = "Speed";
        $scope.changePhenomenonbar = function (phenombar) {
            // Fired when phenomenon associated with the bar chart of User vs Public is changed.
            $scope.barchartshowing = phenombar;
            $scope.dataoverall = [];
            if (phenombar == "Speed") {
                $scope.optionsSpeed['chart']['yAxis']['axisLabel'] = "Speed (Km/h)"
                $scope.dataoverall = $scope.dataSpeed;
            } else if (phenombar == "Consumption") {
                $scope.optionsSpeed['chart']['yAxis']['axisLabel'] = "Consumption (l/h)"
                $scope.dataoverall = $scope.dataConsumption;
            } else if (phenombar == "CO2") {
                $scope.optionsSpeed['chart']['yAxis']['axisLabel'] = "CO2 (Kg/h)"
                $scope.dataoverall = $scope.dataCO2;
            }
        }
        $scope.dataoverall;
        $scope.dataConsumption;
        $scope.dataCO2;
        $scope.dataSpeed;
        $scope.dataEngineload;

        var datausers = [];
        var dataotherusers = [];
        StatisticsService.getUserPhenomenonStatistics($scope.username, $scope.password, "Speed").then(
                function (data) {
                    var store = data;
                    speed_public = store.avg;
                    $scope.dataSpeed = [{
                            key: "Cumulative Return",
                            values: [{
                                    "label": "User",
                                    "value": speed_users
                                }, {
                                    "label": "Public",
                                    "value": speed_public
                                }]
                        }]
                    $scope.dataoverall = $scope.dataSpeed;

                    dataotherusers.push(data);
                    $scope.onload = true;
                    $scope.onload_user_vs_public = true;
                    window.dispatchEvent(new Event('resize'));
                }, function (data) {
            console.log("error " + data);
        });

    }
    ;

    angular.module('enviroCar')
            .controller('UserVsCommunityChartCtrl', UserVsCommunityChartCtrl);
})();
