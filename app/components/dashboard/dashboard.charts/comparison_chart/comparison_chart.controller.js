(function () {
    'use strict';
    function ComparisonChartCtrl($scope, $timeout, $translate, StatisticsService, UserCredentialsService) {
        console.log("SpeedCtrl started.");
        $scope.onload_all = false;
        
        $scope.onload_speed = false;
        $scope.onload_consumption = false;
        $scope.onload_CO2 = false;
        $scope.onload_engine = false;
        $scope.loading = true;
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;
        
        $scope.optionsSpeed = {
            chart: {
                type: 'discreteBarChart',
                height: 200,
                margin: {
                    top: 10,
                    right: 0,
                    bottom: 15,
                    left: 50
                },
                x: function (d) {
                    return $translate.instant(d.label);
                },
                y: function (d) {
                    return d.value;
                },
                showValues: true,
                valueFormat: function (d) {
                    return d3.format(',.1f')(d);
                },
                duration: 300,
                yAxis: {
                    axisLabel: $translate.instant('SPEED') + ' (km/h)',
                    axisLabelDistance: -10
                },
                tooltip: {
                    contentGenerator: function (d)
                    {
                        var html = '<h3><b>' + $translate.instant('TT_' + d.data.label) + '</b> = ' + d.data.value.toFixed(1) + 'km/h </h3>';
                        return html;
                    }
                }
            }
        };

        $scope.optionsConsumption = {
            chart: {
                type: 'discreteBarChart',
                height: 200,
                margin: {
                    top: 10,
                    right: 0,
                    bottom: 15,
                    left: 50
                },
                x: function (d) {
                    return $translate.instant(d.label);
                },
                y: function (d) {
                    return d.value;
                },
                showValues: true,
                valueFormat: function (d) {
                    return d3.format(',.2f')(d);
                },
                duration: 300,
                yAxis: {
                    axisLabel: $translate.instant('CONSUMPTION')+' (l/h)',
                    axisLabelDistance: -20
                },
                tooltip: {
                    contentGenerator: function (d)
                    {
                        var html = '<h3><b>' + $translate.instant('TT_' + d.data.label) + '</b> = ' + d.data.value.toFixed(2) + 'l/h </h3>';
                        return html;
                    }
                }
            }
        };
        $scope.optionsCO2 = {
            chart: {
                type: 'discreteBarChart',
                height: 200,
                margin: {
                    top: 10,
                    right: 0,
                    bottom: 15,
                    left: 50
                },
                x: function (d) {
                    return $translate.instant(d.label);
                },
                y: function (d) {
                    return d.value;
                },
                showValues: true,
                valueFormat: function (d) {
                    return d3.format(',.4f')(d);
                },
                duration: 300,
                yAxis: {
                    axisLabel: 'CO2 (kg/h)',
                    axisLabelDistance: -20
                },
                tooltip: {
                    contentGenerator: function (d)
                    {
                        var html = '<h3><b>' + $translate.instant('TT_' + d.data.label) + '</b> = ' + d.data.value.toFixed(4) + 'kg/h </h3>';
                        return html;
                    }
                }
            }
        };
        $scope.optionsEngine = {
            chart: {
                type: 'discreteBarChart',
                height: 200,
                margin: {
                    top: 10,
                    right: 0,
                    bottom: 15,
                    left: 50
                },
                x: function (d) {
                    return $translate.instant(d.label);
                },
                y: function (d) {
                    return d.value;
                },
                showValues: true,
                valueFormat: function (d) {
                    return d3.format(',.1f')(d);
                },
                duration: 300,
                yAxis: {
                    axisLabel: $translate.instant('ENGINE_LOAD')+' (%)',
                    axisLabelDistance: -20
                },
                tooltip: {
                    contentGenerator: function (d)
                    {
                        var html = '<h3><b>' + $translate.instant('TT_' + d.data.label) + '</b> = ' + d.data.value.toFixed(1) + '% </h3>';
                        return html;
                    }
                }
            }
        };

        var dataotherusers = [];
        StatisticsService.getUserPhenomenonStatistics($scope.username, $scope.password, "Speed").then(
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
        
        StatisticsService.getUserPhenomenonStatistics($scope.username, $scope.password, "Consumption").then(
                function (data) {
                    console.log(data);
                    var store = data.data;
                    var consumption_user = store.avg;
                    StatisticsService.getPhenomenonStatistics($scope.username, $scope.password, "Consumption").then(
                            function (data) {
                                console.log(data);
                                store = data.data;
                                var consumption_public = store.avg;
                                $scope.dataConsumption = [{
                                        key: "Cumulative Return",
                                        values: [{
                                                "label": "LABEL_USER",
                                                "value": consumption_user
                                            }, {
                                                "label": "LABEL_PUBLIC",
                                                "value": consumption_public
                                            }]
                                    }]
                                dataotherusers.push(data);
                                $scope.onload_consumption = true;
                                if ($scope.onload_CO2 && $scope.onload_speed && $scope.onload_engine) {
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
        
        StatisticsService.getUserPhenomenonStatistics($scope.username, $scope.password, "CO2").then(
                function (data) {
                    console.log(data);
                    var store = data.data;
                    var CO2_user = store.avg;
                    StatisticsService.getPhenomenonStatistics($scope.username, $scope.password, "CO2").then(
                            function (data) {
                                console.log(data);
                                store = data.data;
                                var CO2_public = store.avg;
                                $scope.dataCO2 = [{
                                        key: "Cumulative Return",
                                        values: [{
                                                "label": "LABEL_USER",
                                                "value": CO2_user
                                            }, {
                                                "label": "LABEL_PUBLIC",
                                                "value": CO2_public
                                            }]
                                    }]
                                dataotherusers.push(data);
                                $scope.onload_CO2 = true;
                                if ($scope.onload_speed && $scope.onload_consumption && $scope.onload_engine) {
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
        
        StatisticsService.getUserPhenomenonStatistics($scope.username, $scope.password, "Engine Load").then(
                function (data) {
                    console.log(data);
                    var store = data.data;
                    var engine_user = store.avg;
                    StatisticsService.getPhenomenonStatistics($scope.username, $scope.password, "Engine Load").then(
                            function (data) {
                                console.log(data);
                                store = data.data;
                                var engine_public = store.avg;
                                $scope.dataEngine = [{
                                        key: "Cumulative Return",
                                        values: [{
                                                "label": "LABEL_USER",
                                                "value": engine_user
                                            }, {
                                                "label": "LABEL_PUBLIC",
                                                "value": engine_public
                                            }]
                                    }]
                                dataotherusers.push(data);
                                $scope.onload_engine = true;
                                if ($scope.onload_CO2 && $scope.onload_consumption && $scope.onload_speed) {
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
        
        $timeout(function () {
            window.dispatchEvent(new Event('resize'));
        }, 300);
        $timeout(function () {
            window.dispatchEvent(new Event('resize'));
        }, 700);
    }
    ;
    angular.module('enviroCar')
            .controller('ComparisonChartCtrl', ComparisonChartCtrl);
})();
