(function () {
    'use strict';
    function ComparisonTrackChartCtrl($scope, $stateParams, $timeout, $translate, TrackService, StatisticsService, UserCredentialsService) {
        console.log("SpeedCtrl started.");
        $scope.onload_all = false;

        $scope.onload_speed = false;
        $scope.onload_consumption = false;
        $scope.onload_CO2 = false;
        $scope.onload_engine = false;
        $scope.onload_RPM = false;
        $scope.loading = true;
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;
        $scope.selectedPhenom = 'Speed';
        $scope.trackid = $stateParams.trackid;

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

        $scope.changeComparingRange = function (a, b) {
            var sums = {
                'Speed': 0,
                'Consumption': 0,
                'CO2': 0,
                'Rpm': 0,
                'Engine Load': 0
            };

            var data_exist = {
                'Speed': false,
                'Consumption': false,
                'CO2': false,
                'Rpm': false,
                'Engine Load': false
            };
            if ($scope.data_all[0].values[0])
                data_exist['Speed'] = true;
            if ($scope.data_all[1].values[0])
                data_exist['Consumption'] = true;
            if ($scope.data_all[2].values[0])
                data_exist['CO2'] = true;
            if ($scope.data_all[3].values[0])
                data_exist['Rpm'] = true;
            if ($scope.data_all[4].values[0])
                data_exist['Engine Load'] = true;

            // calculate sums for min...max for each phenom:
            for (var index = a; index < b; index++) {
                if (data_exist['Speed'])
                    sums['Speed'] += $scope.data_all[0].values[index].y;
                if (data_exist['Consumption'])
                    sums['Consumption'] += $scope.data_all[1].values[index].y;
                if (data_exist['CO2'])
                    sums['CO2'] += $scope.data_all[2].values[index].y;
                if (data_exist['Rpm'])
                    sums['Rpm'] += $scope.data_all[3].values[index].y;
                if (data_exist['Engine Load'])
                    sums['Engine Load'] += $scope.data_all[4].values[index].y;
            }

            // calculate track avg speed:
            var length_of_n = b - a ;
            var track_avgs = {};
            if (sums['Speed']) {
                track_avgs['Speed'] = sums['Speed'] / length_of_n;
            }
            if (sums['Consumption']) {
                track_avgs['Consumption'] = sums['Consumption'] / length_of_n;
            }
            if (sums['CO2']) {
                track_avgs['CO2'] = sums['CO2'] / length_of_n;
            }
            if (sums['Rpm']) {
                track_avgs['Rpm'] = sums['Rpm'] / length_of_n;
            }
            if (sums['Engine Load']) {
                track_avgs['Engine Load'] = sums['Engine Load'] / length_of_n;
            }

            $scope.dataSpeed[0].values[0].value = track_avgs['Speed'];
            $scope.dataConsumption[0].values[0].value = track_avgs['Consumption'];
            $scope.dataCO2[0].values[0].value = track_avgs['CO2'];
            $scope.dataRPM[0].values[0].value = track_avgs['Rpm'];
            $scope.dataEngineLoad[0].values[0].value = track_avgs['Engine Load'];
        };

        $scope.$on('single_track_page:segment-changed', function (event, args) {
            
            $scope.min = args.min;
            $scope.max = args.max;
            $scope.changeComparingRange($scope.min, $scope.max);
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
            var axisLabelEngineLoad = $translate.instant('ENGINE_LOAD') + ' (%)';
            $scope.optionsEngine.chart.yAxis = {
                axisLabel: axisLabelEngineLoad,
                axisLabelDistance: -10
            };
            var axisLabelRPM = $translate.instant('RPM') + ' (r/min)';
            $scope.optionsRPM.chart.yAxis = {
                axisLabel: axisLabelRPM,
                axisLabelDistance: -10
            };
        });

        $scope.$on('single_track_page:segment-activated', function (event, args) {
            if (args) {
                if (!$scope.min) 
                    $scope.min = 0;
                if (!$scope.max)
                    $scope.max = $scope.track_length;
                $scope.changeComparingRange($scope.min, $scope.max);
            } else {
                $scope.changeComparingRange(0, $scope.track_length);
            }
        });

        $scope.$on('track-toolbar:phenomenon-changed', function (event, args) {
            
            $scope.selectedPhenom = args;

            if ($scope.segmentActivated) {
                //$scope.changeSelectionRange($scope.slider.minValue, $scope.slider.maxValue);
                //$scope.changeChartRange($scope.slider.minValue, $scope.slider.maxValue);
                if ($scope.min)
                    $scope.changeComparingRange($scope.min, $scope.max);
                else
                    $scope.changeComparingRange(0, $scope.track_length);
            } else {
                $scope.changeComparingRange(0, $scope.track_length);
            }
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
                    axisLabel: $translate.instant('ENGINE_LOAD') + ' (%)',
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

        $scope.optionsRPM = {
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
                    return d3.format(',.0f')(d);
                },
                duration: 300,
                yAxis: {
                    axisLabel: $translate.instant('RPM') + ' (r/min)',
                    axisLabelDistance: -20
                },
                tooltip: {
                    contentGenerator: function (d)
                    {
                        var html = '<h3><b>' + $translate.instant('TT_' + d.data.label) + '</b> = ' + d.data.value.toFixed(0) + 'r/min </h3>';
                        return html;
                    }
                }
            }
        };

        // to be filled with server query:
        $scope.data_all = [
            {
                key: 'Speed',
                values: [
                ]
            },
            {
                key: 'Consumption',
                values: [
                ]
            },
            {
                key: 'CO2',
                values: [
                ]
            },
            {
                key: 'Rpm',
                values: [
                ]
            },
            {
                key: 'Engine Load',
                values: [
                ]
            }
        ];
        var data_global = {};
        TrackService.getTrack($scope.username, $scope.password, $scope.trackid).then(
                function (data) {
                    data_global = data;
                    var track_length = data_global.data.features.length;
                    $scope.track_length = track_length;
                    var sums = {
                        'Speed': 0,
                        'Consumption': 0,
                        'CO2': 0,
                        'Rpm': 0,
                        'Engine Load': 0
                    };
                    // iterating through each measurement:
                    for (var index = 1; index < track_length; index++) {
                        // get the phenomenon's value:
                        if (data_global.data.features[index].properties.phenomenons.Speed) {
                            var value_speed = data_global.data.features[index].properties.phenomenons.Speed.value;
                            sums['Speed'] += value_speed;
                        }
                        if (data_global.data.features[index].properties.phenomenons.Consumption) {
                            var value_consumption = data_global.data.features[index].properties.phenomenons.Consumption.value;
                            sums['Consumption'] += value_consumption;
                        }
                        if (data_global.data.features[index].properties.phenomenons.CO2) {
                            var value_CO2 = data_global.data.features[index].properties.phenomenons.CO2.value;
                            sums['CO2'] += value_CO2;
                        }
                        if (data_global.data.features[index].properties.phenomenons.Rpm.value) {
                            var value_RPM = data_global.data.features[index].properties.phenomenons.Rpm.value;
                            sums['Rpm'] += value_RPM;
                        }
                        if (data_global.data.features[index].properties.phenomenons["Engine Load"]) {
                            var value_EngineLoad = data_global.data.features[index].properties.phenomenons["Engine Load"].value;
                            sums['Engine Load'] += value_EngineLoad;
                        }

                        // save measurements for each phenomenon:
                        var speedMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Speed.value};
                        if (data_global.data.features[index].properties.phenomenons.Consumption)
                            var consumptionMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Consumption.value};
                        if (data_global.data.features[index].properties.phenomenons.CO2)
                            var co2Measurement = {x: index, y: data_global.data.features[index].properties.phenomenons.CO2.value};
                        var rpmMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Rpm.value};
                        if (data_global.data.features[index].properties.phenomenons['Engine Load'])
                            var engineLoadMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons['Engine Load'].value};
                        // save all data:
                        $scope.data_all[0].values.push(speedMeasurement);
                        $scope.data_all[1].values.push(consumptionMeasurement);
                        $scope.data_all[2].values.push(co2Measurement);
                        $scope.data_all[3].values.push(rpmMeasurement);
                        $scope.data_all[4].values.push(engineLoadMeasurement);
                    }

                    // calculate track avg speed:
                    var track_avgs = {};
                    if (sums['Speed']) {
                        track_avgs['Speed'] = sums['Speed'] / track_length;
                    }
                    if (sums['Consumption']) {
                        track_avgs['Consumption'] = sums['Consumption'] / track_length;
                    }
                    if (sums['CO2']) {
                        track_avgs['CO2'] = sums['CO2'] / track_length;
                    }
                    if (sums['Rpm']) {
                        track_avgs['Rpm'] = sums['Rpm'] / track_length;
                    }
                    if (sums['Engine Load']) {
                        track_avgs['Engine Load'] = sums['Engine Load'] / track_length;
                    }
                    // ask for enviroCar averages:
                    var enviroCarStats = [];
                    // Speed:
                    StatisticsService.getPhenomenonStatistics($scope.username, $scope.password, "Speed").then(
                            function (data) {
                                var store = data.data;
                                var Speed_public = store.avg;
                                $scope.dataSpeed = [{
                                        key: "Cumulative Return",
                                        values: [{
                                                "label": "TRACK_LABEL_USER",
                                                "value": track_avgs['Speed']
                                            }, {
                                                "label": "TRACK_LABEL_PUBLIC",
                                                "value": Speed_public
                                            }]
                                    }];
                                enviroCarStats.push(data);
                                $scope.onload_Speed = true;
                                $timeout(function () {
                                    window.dispatchEvent(new Event('resize'));
                                }, 300);
                                $timeout(function () {
                                    window.dispatchEvent(new Event('resize'));
                                }, 500);
                            }, function (data) {
                        console.log("error " + data);
                    });
                    // Consumption:
                    StatisticsService.getPhenomenonStatistics($scope.username, $scope.password, "Consumption").then(
                            function (data) {
                                var store = data.data;
                                var Consumption_public = store.avg;
                                $scope.dataConsumption = [{
                                        key: "Cumulative Return",
                                        values: [{
                                                "label": "TRACK_LABEL_USER",
                                                "value": track_avgs['Consumption']
                                            }, {
                                                "label": "TRACK_LABEL_PUBLIC",
                                                "value": Consumption_public
                                            }]
                                    }];
                                enviroCarStats.push(data);
                                $scope.onload_Consumption = true;
                                $timeout(function () {
                                    window.dispatchEvent(new Event('resize'));
                                }, 300);
                                $timeout(function () {
                                    window.dispatchEvent(new Event('resize'));
                                }, 500);
                            }, function (data) {
                        console.log("error " + data);
                    });
                    // CO2:
                    StatisticsService.getPhenomenonStatistics($scope.username, $scope.password, "CO2").then(
                            function (data) {
                                var store = data.data;
                                var CO2_public = store.avg;
                                $scope.dataCO2 = [{
                                        key: "Cumulative Return",
                                        values: [{
                                                "label": "TRACK_LABEL_USER",
                                                "value": track_avgs['CO2']
                                            }, {
                                                "label": "TRACK_LABEL_PUBLIC",
                                                "value": CO2_public
                                            }]
                                    }]
                                enviroCarStats.push(data);
                                $scope.onload_CO2 = true;
                                $timeout(function () {
                                    window.dispatchEvent(new Event('resize'));
                                }, 300);
                                $timeout(function () {
                                    window.dispatchEvent(new Event('resize'));
                                }, 500);
                            }, function (data) {
                        console.log("error " + data);
                    });
                    // RPM:
                    StatisticsService.getPhenomenonStatistics($scope.username, $scope.password, "Rpm").then(
                            function (data) {
                                var store = data.data;
                                var RPM_public = store.avg;
                                $scope.dataRPM = [{
                                        key: "Cumulative Return",
                                        values: [{
                                                "label": "TRACK_LABEL_USER",
                                                "value": track_avgs['Rpm']
                                            }, {
                                                "label": "TRACK_LABEL_PUBLIC",
                                                "value": RPM_public
                                            }]
                                    }]
                                enviroCarStats.push(data);
                                $scope.onload_RPM = true;
                                $timeout(function () {
                                    window.dispatchEvent(new Event('resize'));
                                }, 300);
                                $timeout(function () {
                                    window.dispatchEvent(new Event('resize'));
                                }, 500);
                            }, function (data) {
                        console.log("error " + data);
                    });
                    // Engine Load:
                    StatisticsService.getPhenomenonStatistics($scope.username, $scope.password, "Engine Load").then(
                            function (data) {
                                var store = data.data;
                                var EngineLoad_public = store.avg;
                                $scope.dataEngineLoad = [{
                                        key: "Cumulative Return",
                                        values: [{
                                                "label": "TRACK_LABEL_USER",
                                                "value": track_avgs['Engine Load']
                                            }, {
                                                "label": "TRACK_LABEL_PUBLIC",
                                                "value": EngineLoad_public
                                            }]
                                    }];
                                enviroCarStats.push(data);
                                $scope.onload_EngineLoad = true;
                                $timeout(function () {
                                    window.dispatchEvent(new Event('resize'));
                                }, 300);
                                $timeout(function () {
                                    window.dispatchEvent(new Event('resize'));
                                }, 500);
                            }, function (data) {
                        console.log("error " + data);
                    });

                    // calculate track averages:


                    $timeout(function () {
                        window.dispatchEvent(new Event('resize'))
                    },
                            200);
                    $timeout(function () {
                        window.dispatchEvent(new Event('resize'))
                    },
                            500);
                }, function (error) {
            console.log(error);
        }
        );

        $timeout(function () {
            window.dispatchEvent(new Event('resize'));
        }, 300);
        $timeout(function () {
            window.dispatchEvent(new Event('resize'));
        }, 500);
    }
    ;
    angular.module('enviroCar')
            .controller('ComparisonTrackChartCtrl', ComparisonTrackChartCtrl);
})();
