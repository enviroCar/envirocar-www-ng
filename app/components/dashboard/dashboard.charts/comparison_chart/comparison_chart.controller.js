(function () {
    'use strict';
    function ComparisonChartCtrl(
            $scope,
            $timeout,
            $translate,
            $mdDialog,
            StatisticsService,
            UserCredentialsService) {
        $scope.onload_all = false;

        $scope.onload_speed = false;
        $scope.onload_consumption = false;
        $scope.onload_CO2 = false;
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

        $scope.showAlert = function (ev, title, description) {
            var dialog_title = $translate.instant(title);
            var dialog_desc = $translate.instant(description);
            $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title(dialog_title)
                    .textContent(dialog_desc)
                    .ariaLabel('Popover')
                    .ok('Okay!')
                    .targetEvent(ev)
                    .fullscreen(true)
                    );
        };

        $scope.$on('sidenav:item-selected', function (event, args) {
            $timeout(function () {
                window.dispatchEvent(new Event('resize'));
                $timeout(function () {
                    window.dispatchEvent(new Event('resize'));
                }, 600);
            }, 400);
            $timeout(function () {
                window.dispatchEvent(new Event('resize'));
            }, 500);
        });

        $scope.$on('toolbar:language-changed', function (event, args) {
            var axisLabelSpeed = $translate.instant('SPEED') + ' (km/h)';
            $scope.optionsSpeed.chart.yAxis = {
                axisLabel: axisLabelSpeed,
                axisLabelDistance: -10
            };
            var axisLabelConsumption = $translate.instant('CONSUMPTION') + ' (l/h)';
            $scope.optionsConsumption.chart.yAxis = {
                axisLabel: axisLabelConsumption,
                axisLabelDistance: -10
            };
            var axisLabelCO2 = $translate.instant('CO2') + ' (kg/h)';
            $scope.optionsCO2.chart.yAxis = {
                axisLabel: axisLabelCO2,
                axisLabelDistance: -10
            };
        });

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
                    axisLabel: $translate.instant('CONSUMPTION') + ' (l/h)',
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

        var dataotherusers = [];
        StatisticsService.getUserPhenomenonStatistics($scope.username, $scope.password, "Speed").then(
                function (data) {
                    var store = data.data;
                    var speed_user = store.avg;
                    StatisticsService.getPhenomenonStatistics($scope.username, $scope.password, "Speed").then(
                            function (data) {
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
                                if ($scope.onload_CO2 && $scope.onload_consumption) {
                                    window.dispatchEvent(new Event('resize'));
                                    $scope.onload_all = true;
                                    $timeout(function () {
                                        window.dispatchEvent(new Event('resize'));
                                    }, 300);
                                    $timeout(function () {
                                        window.dispatchEvent(new Event('resize'));
                                    }, 500);
                                }
                            }, function (data) {
                        console.log("error " + data);
                    });
                }, function (data) {
            console.log("error " + data);
        });

        StatisticsService.getUserPhenomenonStatistics($scope.username, $scope.password, "Consumption").then(
                function (data) {
                    var store = data.data;
                    var consumption_user = store.avg;
                    StatisticsService.getPhenomenonStatistics($scope.username, $scope.password, "Consumption").then(
                            function (data) {
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
                                    }];
                                dataotherusers.push(data);
                                $scope.onload_consumption = true;
                                if ($scope.onload_CO2 && $scope.onload_speed) {
                                    window.dispatchEvent(new Event('resize'));
                                    $scope.onload_all = true;
                                    $timeout(function () {
                                        window.dispatchEvent(new Event('resize'));
                                    }, 300);
                                    $timeout(function () {
                                        window.dispatchEvent(new Event('resize'));
                                    }, 500);
                                }
                            }, function (data) {
                        console.log("error " + data);
                    });
                }, function (data) {
            console.log("error " + data);
        });

        StatisticsService.getUserPhenomenonStatistics($scope.username, $scope.password, "CO2").then(
                function (data) {
                    var store = data.data;
                    var CO2_user = store.avg;
                    StatisticsService.getPhenomenonStatistics($scope.username, $scope.password, "CO2").then(
                            function (data) {
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
                                if ($scope.onload_speed && $scope.onload_consumption) {
                                    window.dispatchEvent(new Event('resize'));
                                    $scope.onload_all = true;
                                    $timeout(function () {
                                        window.dispatchEvent(new Event('resize'));
                                    }, 300);
                                    $timeout(function () {
                                        window.dispatchEvent(new Event('resize'));
                                    }, 500);
                                }
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
        }, 500);
    }
    ;
    angular.module('enviroCar')
            .controller('ComparisonChartCtrl', ComparisonChartCtrl);
})();
