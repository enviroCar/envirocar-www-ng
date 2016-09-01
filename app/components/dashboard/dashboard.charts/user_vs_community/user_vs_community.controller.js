(function () {
    'use strict';
    function UserVsCommunityChartCtrl($scope, $state, $translate, TrackService, UserService, StatisticsService, UserCredentialsService, ecBaseUrl) {
        console.log("UserVsCommunityCtrl started.");
        $scope.onload_user_vs_public = false;
        $scope.loading = true;
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;
        var urlredirect = '#/dashboard/chart/';
        $scope.goToActivity = function (trackid) {
            console.log("came here");
            //redirect to the track analytics page.
            $state.go('home.chart', {
                'trackid': trackid
            });
            console.log("fired");
        };

        $scope.optionsSpeed = {
            chart: {
                type: 'discreteBarChart',
                height: 290,
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
                duration: 300,
                xAxis: {
                    axisLabel: 'User vs Public '
                },
                yAxis: {
                    axisLabel: 'Speed(km/h)',
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
        
      
        $scope.barchartoptions = ["Speed", "Consumption", "CO2"];
        $scope.barchartshowing = "Speed";
        $scope.dataoverall = [];
        $scope.changePhenomenonbar = function (phenombar) {
            // Fired when phenomenon associated with the bar chart of User vs Public is changed.
            $scope.barchartshowing = phenombar;
            if (phenombar == "Speed") {
                console.log("Speed clicked.");
                $scope.optionsSpeed['chart']['yAxis']['axisLabel'] = "Speed (Km/h)"
                $scope.dataoverall = $scope.dataSpeed;
                console.log($scope.dataoverall);
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
                    console.log(data);
                    var store = data;
                    var speed_user = store.avg;
                    StatisticsService.getPhenomenonStatistics($scope.username, $scope.password, "Speed").then(
                            function (data) {
                                console.log(data);
                                store = data;
                                var speed_public = store.avg;
                                $scope.dataSpeed = [{
                                        key: "Cumulative Return",
                                        values: [{
                                                "label": "User",
                                                "value": speed_user
                                            }, {
                                                "label": "Public",
                                                "value": speed_public
                                            }]
                                    }]
                                $scope.dataoverall = $scope.dataSpeed;
                                dataotherusers.push(data);
                                $scope.onload = true;
                                $scope.onload_nvd3_user_vs_public = true;
                                $scope.onload_user_vs_public = true;
                                window.dispatchEvent(new Event('resize'));
                            }, function (data) {
                        console.log("error " + data);
                    });
                }, function (data) {
            console.log("error " + data);
        });
        
        StatisticsService.getUserPhenomenonStatistics($scope.username, $scope.password, "Consumption").then(
                function (data) {
                    console.log(data);
                    var store = data;
                    var consumption_user = store.avg;
                    StatisticsService.getPhenomenonStatistics($scope.username, $scope.password, "Consumption").then(
                            function (data) {
                                console.log(data);
                                store = data;
                                var consumption_public = store.avg;
                                $scope.dataConsumption = [{
                                        key: "Cumulative Return",
                                        values: [{
                                                "label": "User",
                                                "value": consumption_user
                                            }, {
                                                "label": "Public",
                                                "value": consumption_public
                                            }]
                                    }]
                                $scope.dataoverall = $scope.dataConsumption;
                                dataotherusers.push(data);
                                $scope.onload = true;
                                $scope.onload_nvd3_user_vs_public = true;
                                $scope.onload_user_vs_public = true;
                                window.dispatchEvent(new Event('resize'));
                            }, function (data) {
                        console.log("error " + data);
                    });
                }, function (data) {
            console.log("error " + data);
        });
        
        StatisticsService.getUserPhenomenonStatistics($scope.username, $scope.password, "CO2").then(
                function (data) {
                    console.log(data);
                    var store = data;
                    var CO2_user = store.avg;
                    StatisticsService.getPhenomenonStatistics($scope.username, $scope.password, "CO2").then(
                            function (data) {
                                console.log(data);
                                store = data;
                                var CO2_public = store.avg;
                                $scope.dataCO2 = [{
                                        key: "Cumulative Return",
                                        values: [{
                                                "label": "User",
                                                "value": CO2_user
                                            }, {
                                                "label": "Public",
                                                "value": CO2_public
                                            }]
                                    }]
                                $scope.dataoverall = $scope.dataCO2;
                                dataotherusers.push(data);
                                $scope.onload = true;
                                $scope.onload_nvd3_user_vs_public = true;
                                $scope.onload_user_vs_public = true;
                                window.dispatchEvent(new Event('resize'));
                            }, function (data) {
                        console.log("error " + data);
                    });
                }, function (data) {
            console.log("error " + data);
        });
    }
    ;
    angular.module('enviroCar')
            .controller('UserVsCommunityChartCtrl', UserVsCommunityChartCtrl);
            
})();
