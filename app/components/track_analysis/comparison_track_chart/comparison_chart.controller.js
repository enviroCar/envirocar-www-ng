(function () {
    'use strict';
    function ComparisonTrackChartCtrl($scope, $stateParams, $timeout, $translate, TrackService, StatisticsService, UserCredentialsService) {
        "ngInject";
        $scope.onload_all = false;

        $scope.onload_speed = false;
        $scope.onload_consumption = false;
        $scope.onload_CO2 = false;
        $scope.onload_engine = false;
        $scope.onload_RPM = false;
        $scope.onload_GPSSpeed = false;
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
            var flawlessMeasurements = {
                'Speed': 0,
                'Consumption': 0,
                'CO2': 0,
                'Rpm': 0,
                'Engine Load': 0,
                'GPS Speed': 0
            };

            var sums = {
                'Speed': 0,
                'Consumption': 0,
                'CO2': 0,
                'Rpm': 0,
                'Engine Load': 0,
                'GPS Speed': 0
            };

            var data_exist = {
                'Speed': false,
                'Consumption': false,
                'CO2': false,
                'Rpm': false,
                'Engine Load': false,
                'GPS Speed': false
            };
            if ($scope.data_all[0].values[0] !== undefined)
                data_exist['Speed'] = true;
            if ($scope.data_all[1].values[0] !== undefined)
                data_exist['Consumption'] = true;
            if ($scope.data_all[2].values[0] !== undefined)
                data_exist['CO2'] = true;
            if ($scope.data_all[3].values[0] !== undefined)
                data_exist['Rpm'] = true;
            if ($scope.data_all[4].values[0] !== undefined)
                data_exist['Engine Load'] = true;
            if ($scope.data_all[5].values[0] !== undefined)
                data_exist['GPS Speed'] = true;

            // calculate sums for min...max for each phenom:
            for (var index = a; index < b; index++) {
                if ((data_exist['Speed']) & ($scope.data_all[0].values[index].y !== undefined)) {
                    sums['Speed'] += $scope.data_all[0].values[index].y;
                    flawlessMeasurements ['Speed'] += 1;
                }
                if ((data_exist['Consumption']) & ($scope.data_all[1].values[index].y !== undefined)) {
                    sums['Consumption'] += $scope.data_all[1].values[index].y;
                    flawlessMeasurements ['Consumption'] += 1;
                }
                if ((data_exist['CO2']) & ($scope.data_all[2].values[index].y !== undefined)) {
                    sums['CO2'] += $scope.data_all[2].values[index].y;
                    flawlessMeasurements ['CO2'] += 1;
                }
                if ((data_exist['Rpm']) & ($scope.data_all[3].values[index].y !== undefined)) {
                    sums['Rpm'] += $scope.data_all[3].values[index].y;
                    flawlessMeasurements ['Rpm'] += 1;
                }
                if ((data_exist['Engine Load']) & ($scope.data_all[4].values[index].y !== undefined)) {
                    sums['Engine Load'] += $scope.data_all[4].values[index].y;
                    flawlessMeasurements ['Engine Load'] += 1;
                }
                if ((data_exist['GPS Speed']) & ($scope.data_all[5].values[index].y !== undefined)) {
                    sums['GPS Speed'] += $scope.data_all[5].values[index].y;
                    flawlessMeasurements ['GPS Speed'] += 1;
                }
            }

            // calculate track avg speed:
            var track_avgs = {};
            if (sums['Speed'] !== undefined) {
                track_avgs['Speed'] = sums['Speed'] / flawlessMeasurements ['Speed'];
            }
            if (sums['Consumption'] !== undefined) {
                track_avgs['Consumption'] = sums['Consumption'] / flawlessMeasurements ['Consumption'];
            }
            if (sums['CO2'] !== undefined) {
                track_avgs['CO2'] = sums['CO2'] / flawlessMeasurements ['CO2'];
            }
            if (sums['Rpm'] !== undefined) {
                track_avgs['Rpm'] = sums['Rpm'] / flawlessMeasurements ['Rpm'];
            }
            if (sums['Engine Load'] !== undefined) {
                track_avgs['Engine Load'] = sums['Engine Load'] / flawlessMeasurements ['Engine Load'];
            }
            if (sums['GPS Speed'] !== undefined) {
                track_avgs['GPS Speed'] = sums['GPS Speed'] / flawlessMeasurements ['GPS Speed'];
            }

            $scope.dataSpeed[0].values[0].value = track_avgs['Speed'];
            $scope.dataConsumption[0].values[0].value = track_avgs['Consumption'];
            $scope.dataCO2[0].values[0].value = track_avgs['CO2'];
            $scope.dataRPM[0].values[0].value = track_avgs['Rpm'];
            $scope.dataEngineLoad[0].values[0].value = track_avgs['Engine Load'];
            $scope.dataGPSSpeed[0].values[0].value = track_avgs['GPS Speed'];

            // update bar colors:
            $scope.dataSpeed[0].values[0].color =
                    $scope.percentToRGB(
                            $scope.yellow_break[0],
                            $scope.red_break[0],
                            $scope.max_values[0],
                            track_avgs['Speed'],
                            1);

            $scope.dataConsumption[0].values[0].color =
                    $scope.percentToRGB(
                            $scope.yellow_break[1],
                            $scope.red_break[1],
                            $scope.max_values[1],
                            track_avgs['Consumption'],
                            1);

            $scope.dataCO2[0].values[0].color =
                    $scope.percentToRGB(
                            $scope.yellow_break[2],
                            $scope.red_break[2],
                            $scope.max_values[2],
                            track_avgs['CO2'],
                            1);

            $scope.dataRPM[0].values[0].color =
                    $scope.percentToRGB(
                            $scope.yellow_break[3],
                            $scope.red_break[3],
                            $scope.max_values[3],
                            track_avgs['Rpm'],
                            1);

            $scope.dataEngineLoad[0].values[0].color =
                    $scope.percentToRGB(
                            $scope.yellow_break[4],
                            $scope.red_break[4],
                            $scope.max_values[4],
                            track_avgs['Engine Load'],
                            1);

            $scope.dataGPSSpeed[0].values[0].color =
                    $scope.percentToRGB(
                            $scope.yellow_break[5],
                            $scope.red_break[5],
                            $scope.max_values[5],
                            track_avgs['GPS Speed'],
                            1);
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
            var axisLabelGPSSpeed = $translate.instant('GPS_SPEED') + ' km/h';
            $scope.optionsGPSSpeed.chart.yAxis = {
                axisLabel: axisLabelGPSSpeed,
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
                if ($scope.min !== undefined)
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

        $scope.optionsGPSSpeed = {
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
                    axisLabel: $translate.instant('GPS Speed') + ' (km/h)',
                    axisLabelDistance: -20
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
            },
            {
                key: 'GPS Speed',
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
                        'Engine Load': 0,
                        'GPS Speed': 0
                    };

                    var value_speed;
                    var value_consumption;
                    var value_CO2;
                    var value_RPM;
                    var value_EngineLoad;
                    var value_GPSSpeed;
                    // save measurements for each phenomenon:
                    var speedMeasurement;
                    var consumptionMeasurement;
                    var co2Measurement;
                    var rpmMeasurement;
                    var engineLoadMeasurement;
                    var gpsSpeedMeasurement;

                    var data_exist = {
                        'Speed': false,
                        'Consumption': false,
                        'CO2': false,
                        'Rpm': false,
                        'Engine Load': false,
                        'GPS Speed': false
                    };

                    // iterating through each measurement:
                    for (var index = 1; index < track_length; index++) {
                        // get the phenomenon's value:
                        if (data_global.data.features[index].properties.phenomenons.Speed) {
                            value_speed = data_global.data.features[index].properties.phenomenons.Speed.value;
                            sums['Speed'] += value_speed;
                            speedMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Speed.value};
                        } else {
                            value_speed = 0;
                            speedMeasurement = {x: index, y: undefined};
                        }

                        if (data_global.data.features[index].properties.phenomenons.Consumption) {
                            value_consumption = data_global.data.features[index].properties.phenomenons.Consumption.value;
                            sums['Consumption'] += value_consumption;
                            consumptionMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Consumption.value};
                        } else {
                            value_consumption = 0;
                            consumptionMeasurement = {x: index, y: undefined};
                        }

                        if (data_global.data.features[index].properties.phenomenons.CO2) {
                            value_CO2 = data_global.data.features[index].properties.phenomenons.CO2.value;
                            sums['CO2'] += value_CO2;
                            co2Measurement = {x: index, y: data_global.data.features[index].properties.phenomenons.CO2.value};
                        } else {
                            value_CO2 = 0;
                            co2Measurement = {x: index, y: undefined};
                        }

                        if (data_global.data.features[index].properties.phenomenons.Rpm) {
                            value_RPM = data_global.data.features[index].properties.phenomenons.Rpm.value;
                            sums['Rpm'] += value_RPM;
                            rpmMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Rpm.value};
                        } else {
                            value_RPM = 0;
                            rpmMeasurement = {x: index, y: undefined};
                        }

                        if (data_global.data.features[index].properties.phenomenons["Engine Load"]) {
                            value_EngineLoad = data_global.data.features[index].properties.phenomenons["Engine Load"].value;
                            sums['Engine Load'] += value_EngineLoad;
                            engineLoadMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons['Engine Load'].value};
                        } else {
                            value_EngineLoad = 0;
                            engineLoadMeasurement = {x: index, y: undefined};
                        }

                        if (data_global.data.features[index].properties.phenomenons["GPS Speed"]) {
                            value_GPSSpeed = data_global.data.features[index].properties.phenomenons["GPS Speed"].value;
                            sums['GPS Speed'] += value_GPSSpeed;
                            gpsSpeedMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons['GPS Speed'].value};
                        } else {
                            value_GPSSpeed = 0;
                            gpsSpeedMeasurement = {x: index, y: undefined};
                        }

                        // save all data:
                        $scope.data_all[0].values.push(speedMeasurement);
                        $scope.data_all[1].values.push(consumptionMeasurement);
                        $scope.data_all[2].values.push(co2Measurement);
                        $scope.data_all[3].values.push(rpmMeasurement);
                        $scope.data_all[4].values.push(engineLoadMeasurement);
                        $scope.data_all[5].values.push(gpsSpeedMeasurement);
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
                    if (sums['GPS Speed']) {
                        track_avgs['GPS Speed'] = sums['GPS Speed'] / track_length;
                    }
                    // ask for enviroCar averages:
                    // Speed:
                    StatisticsService.getPhenomenonStatistics($scope.username, $scope.password, "Speed").then(
                            function (data) {
                                var store = data.data;
                                var Speed_public = store.avg;
                                $scope.dataSpeed = [{
                                        key: "Cumulative Return",
                                        values: [{
                                                "label": "TRACK_LABEL_USER",
                                                "value": track_avgs['Speed'],
                                                "color": $scope.percentToRGB(
                                                        $scope.yellow_break[0],
                                                        $scope.red_break[0],
                                                        $scope.max_values[0],
                                                        track_avgs['Speed'],
                                                        1)
                                            }, {
                                                "label": "TRACK_LABEL_PUBLIC",
                                                "value": Speed_public,
                                                "color": $scope.percentToRGB(
                                                        $scope.yellow_break[0],
                                                        $scope.red_break[0],
                                                        $scope.max_values[0],
                                                        Speed_public,
                                                        1)
                                            }]
                                    }];
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
                                                "value": track_avgs['Consumption'],
                                                "color": $scope.percentToRGB(
                                                        $scope.yellow_break[1],
                                                        $scope.red_break[1],
                                                        $scope.max_values[1],
                                                        track_avgs['Consumption'],
                                                        1)
                                            }, {
                                                "label": "TRACK_LABEL_PUBLIC",
                                                "value": Consumption_public,
                                                "color": $scope.percentToRGB(
                                                        $scope.yellow_break[1],
                                                        $scope.red_break[1],
                                                        $scope.max_values[1],
                                                        Consumption_public,
                                                        1)
                                            }]
                                    }];
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
                                                "value": track_avgs['CO2'],
                                                "color": $scope.percentToRGB(
                                                        $scope.yellow_break[2],
                                                        $scope.red_break[2],
                                                        $scope.max_values[2],
                                                        track_avgs['CO2'],
                                                        1)
                                            }, {
                                                "label": "TRACK_LABEL_PUBLIC",
                                                "value": CO2_public,
                                                "color": $scope.percentToRGB(
                                                        $scope.yellow_break[2],
                                                        $scope.red_break[2],
                                                        $scope.max_values[2],
                                                        CO2_public,
                                                        1)
                                            }]
                                    }]
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
                                                "value": track_avgs['Rpm'],
                                                "color": $scope.percentToRGB(
                                                        $scope.yellow_break[3],
                                                        $scope.red_break[3],
                                                        $scope.max_values[3],
                                                        track_avgs['Rpm'],
                                                        1)
                                            }, {
                                                "label": "TRACK_LABEL_PUBLIC",
                                                "value": RPM_public,
                                                "color": $scope.percentToRGB(
                                                        $scope.yellow_break[3],
                                                        $scope.red_break[3],
                                                        $scope.max_values[3],
                                                        RPM_public,
                                                        1)
                                            }]
                                    }]
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
                                                "value": track_avgs['Engine Load'],
                                                "color": $scope.percentToRGB(
                                                        $scope.yellow_break[4],
                                                        $scope.red_break[4],
                                                        $scope.max_values[4],
                                                        track_avgs['Engine Load'],
                                                        1)
                                            }, {
                                                "label": "TRACK_LABEL_PUBLIC",
                                                "value": EngineLoad_public,
                                                "color": $scope.percentToRGB(
                                                        $scope.yellow_break[4],
                                                        $scope.red_break[4],
                                                        $scope.max_values[4],
                                                        EngineLoad_public,
                                                        1)
                                            }]
                                    }];
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
                    // GPS Speed:
                    StatisticsService.getPhenomenonStatistics($scope.username, $scope.password, "GPS Speed").then(
                            function (data) {
                                var store = data.data;
                                var GPSSpeed_public = store.avg;
                                $scope.dataGPSSpeed = [{
                                        key: "Cumulative Return",
                                        values: [{
                                                "label": "TRACK_LABEL_USER",
                                                "value": track_avgs['GPS Speed'],
                                                "color": $scope.percentToRGB(
                                                        $scope.yellow_break[5],
                                                        $scope.red_break[5],
                                                        $scope.max_values[5],
                                                        track_avgs['GPS Speed'],
                                                        1)
                                            }, {
                                                "label": "TRACK_LABEL_PUBLIC",
                                                "value": GPSSpeed_public,
                                                "color": $scope.percentToRGB(
                                                        $scope.yellow_break[5],
                                                        $scope.red_break[5],
                                                        $scope.max_values[5],
                                                        GPSSpeed_public,
                                                        1)
                                            }]
                                    }];
                                $scope.onload_GPSSpeed = true;
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
