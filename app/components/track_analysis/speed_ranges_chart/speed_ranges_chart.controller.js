(function () {
    'use strict';
    function SpeedRangesChartCtrl($scope, $stateParams, $timeout, $translate, TrackService, StatisticsService, UserCredentialsService) {
        console.log("SpeedRangesChartCtrl started.");
        $scope.onload_all = false;

        $scope.onload_speed_Range = false;
        $scope.onload_consumption_Range = false;
        $scope.onload_CO2_Range = false;
        $scope.onload_EngineLoad_Range = false;
        $scope.onload_RPM_Range = false;
        $scope.loading = true;
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;
        $scope.selectedPhenom = 'Speed';
        $scope.trackid = $stateParams.trackid;

        var max_values = [
            130, // speed
            10, // consumption
            20, // co2
            3000, // rpm
            100     // engine load
        ];

        $scope.optionsSpeedRange = {
            chart: {
                type: 'pieChart',
                height: 370,
                donut: false,
                x: function (d) {
                    return d.key;
                },
                y: function (d) {
                    return d.y;
                },
                color: ['#00ff00',
                    $scope.percentToRGB(30 / max_values[0] * 100),
                    $scope.percentToRGB(60 / max_values[0] * 100),
                    $scope.percentToRGB(100 / max_values[0] * 100),
                    $scope.percentToRGB(130 / max_values[0] * 100),
                    $scope.percentToRGB(180 / max_values[0] * 100)],
                showLabels: true,
                labelsOutside: true,
                pie: {
                    startAngle: function (d) {
                        return d.startAngle / 2 - Math.PI / 2
                    },
                    endAngle: function (d) {
                        return d.endAngle / 2 - Math.PI / 2
                    }
                },
                duration: 300,
                legendPosition: 'bottom',
                valueFormat: function (d) {
                    return d3.format(',.2f')(d) + "%";
                }
            }
        };

        $scope.changeRangeRanges = function (a, b) {
            $scope.onload_speed_Range = false;
            $scope.onload_consumption_Range = false;
            $scope.onload_CO2_Range = false;
            $scope.onload_EngineLoad_Range = false;
            $scope.onload_RPM_Range = false;
            $scope.dataSpeedRange = [
                {
                    key: "0km/h",
                    y: 0
                },
                {
                    key: "0-30km/h",
                    y: 0
                },
                {
                    key: "30-60km/h",
                    y: 0
                },
                {
                    key: "60-100km/h",
                    y: 0
                },
                {
                    key: "100-130km/h",
                    y: 0
                },
                {
                    key: "> 130km/h",
                    y: 0
                }
            ];
            $scope.dataConsumptionRange = [
                {
                    key: "0 l/h",
                    y: 0
                },
                {
                    key: "0-3 l/h",
                    y: 0
                },
                {
                    key: "3-6 l/h",
                    y: 0
                },
                {
                    key: "6-9 l/h",
                    y: 0
                },
                {
                    key: "9-12 l/h",
                    y: 0
                },
                {
                    key: "> 12 l/h",
                    y: 0
                }
            ];
            $scope.dataCO2Range = [
                {
                    key: "0 kg/h",
                    y: 0
                },
                {
                    key: "0-5 kg/h",
                    y: 0
                },
                {
                    key: "5-10 kg/h",
                    y: 0
                },
                {
                    key: "10-15 kg/h",
                    y: 0
                },
                {
                    key: "15-20 kg/h",
                    y: 0
                },
                {
                    key: "> 20 kg/h",
                    y: 0
                }
            ];
            $scope.dataRPMRange = [
                {
                    key: "0 r/min",
                    y: 0
                },
                {
                    key: "0-1k r/min",
                    y: 0
                },
                {
                    key: "1k-1.5k r/min",
                    y: 0
                },
                {
                    key: "1.5k-2k r/min",
                    y: 0
                },
                {
                    key: "2k-3k r/min",
                    y: 0
                },
                {
                    key: "> 3k r/min",
                    y: 0
                }
            ];
            $scope.dataEngineLoadRange = [
                {
                    key: "0 %",
                    y: 0
                },
                {
                    key: "0-15 %",
                    y: 0
                },
                {
                    key: "15-35 %",
                    y: 0
                },
                {
                    key: "35-55 %",
                    y: 0
                },
                {
                    key: "55-75 %",
                    y: 0
                },
                {
                    key: "75-100 %",
                    y: 0
                }
            ];
            var partOfPercent = 100 / (b - a + 1);

            // calculate %'s for each speed interval:
            for (var i = a; i < b + 1; i++) {
                var v = $scope.data_all_ranges[0].values[i];
                switch (true) {
                    case (v === 0):
                        $scope.dataSpeedRange[0].y += partOfPercent;
                        break;
                    case (v < 30):
                        $scope.dataSpeedRange[1].y += partOfPercent;
                        break;
                    case (v < 60):
                        $scope.dataSpeedRange[2].y += partOfPercent;
                        break;
                    case (v < 100):
                        $scope.dataSpeedRange[3].y += partOfPercent;
                        break;
                    case (v < 130):
                        $scope.dataSpeedRange[4].y += partOfPercent;
                        break;
                    case (v >= 130):
                        $scope.dataSpeedRange[5].y += partOfPercent;
                        break;
                }
            }
            $scope.onload_speed_Range = true;

            // calculate %'s for each consumption interval:
            for (var i = a; i < b + 1; i++) {
                var v = $scope.data_all_ranges[1].values[i];
                switch (true) {
                    case (v === 0):
                        $scope.dataConsumptionRange[0].y += partOfPercent;
                        break;
                    case (v < 3):
                        $scope.dataConsumptionRange[1].y += partOfPercent;
                        break;
                    case (v < 6):
                        $scope.dataConsumptionRange[2].y += partOfPercent;
                        break;
                    case (v < 9):
                        $scope.dataConsumptionRange[3].y += partOfPercent;
                        break;
                    case (v < 12):
                        $scope.dataConsumptionRange[4].y += partOfPercent;
                        break;
                    case (v >= 12):
                        $scope.dataConsumptionRange[5].y += partOfPercent;
                        break;
                }
            }
            $scope.onload_consumption_Range = true;

            // calculate %'s for each consumption interval:
            for (var i = a; i < b + 1; i++) {
                var v = $scope.data_all_ranges[2].values[i];
                switch (true) {
                    case (v === 0):
                        $scope.dataCO2Range[0].y += partOfPercent;
                        break;
                    case (v < 3):
                        $scope.dataCO2Range[1].y += partOfPercent;
                        break;
                    case (v < 6):
                        $scope.dataCO2Range[2].y += partOfPercent;
                        break;
                    case (v < 9):
                        $scope.dataCO2Range[3].y += partOfPercent;
                        break;
                    case (v < 12):
                        $scope.dataCO2Range[4].y += partOfPercent;
                        break;
                    case (v >= 12):
                        $scope.dataCO2Range[5].y += partOfPercent;
                        break;
                }
            }
            $scope.onload_CO2_Range = true;

            // calculate %'s for each consumption interval:
            for (var i = a; i < b + 1; i++) {
                var v = $scope.data_all_ranges[3].values[i];
                switch (true) {
                    case (v === 0):
                        $scope.dataRPMRange[0].y += partOfPercent;
                        break;
                    case (v < 1000):
                        $scope.dataRPMRange[1].y += partOfPercent;
                        break;
                    case (v < 1500):
                        $scope.dataRPMRange[2].y += partOfPercent;
                        break;
                    case (v < 2000):
                        $scope.dataRPMRange[3].y += partOfPercent;
                        break;
                    case (v < 3000):
                        $scope.dataRPMRange[4].y += partOfPercent;
                        break;
                    case (v >= 3000):
                        $scope.dataRPMRange[5].y += partOfPercent;
                        break;
                }
            }
            $scope.onload_RPM_Range = true;

            // calculate %'s for each consumption interval:
            for (var i = a; i < b + 1; i++) {
                var v = $scope.data_all_ranges[4].values[i];
                switch (true) {
                    case (v === 0):
                        $scope.dataEngineLoadRange[0].y += partOfPercent;
                        break;
                    case (v < 15):
                        $scope.dataEngineLoadRange[1].y += partOfPercent;
                        break;
                    case (v < 35):
                        $scope.dataEngineLoadRange[2].y += partOfPercent;
                        break;
                    case (v < 55):
                        $scope.dataEngineLoadRange[3].y += partOfPercent;
                        break;
                    case (v < 75):
                        $scope.dataEngineLoadRange[4].y += partOfPercent;
                        break;
                    case (v >= 75):
                        $scope.dataEngineLoadRange[5].y += partOfPercent;
                        break;
                }
            }
            $scope.onload_EngineLoad_Range = true;
        };

        $scope.$on('single_track_page:segment-changed', function (event, args) {
            console.log('single_track_page:segment-changed');
            console.log(args);
            $scope.min = args.min;
            $scope.max = args.max;
            $scope.changeRangeRanges($scope.min, $scope.max);
        });

        $scope.$on('toolbar:language-changed', function (event, args) {
            console.log("language changed received.");

        });

        $scope.$on('single_track_page:segment-activated', function (event, args) {
            if (args) {
                if (!$scope.min)
                    $scope.min = 0;
                if (!$scope.max)
                    $scope.max = $scope.track_length;
                console.log($scope.min);
                console.log($scope.max);
                $scope.changeRangeRanges($scope.min, $scope.max);
            } else {
                console.log($scope.track_length);
                $scope.changeRangeRanges(0, $scope.track_length);
            }
        });

        $scope.$on('track-toolbar:phenomenon-changed', function (event, args) {
            console.log("phenomenon changed received.");
            $scope.selectedPhenom = args;

            if ($scope.segmentActivated) {
                //$scope.changeSelectionRange($scope.slider.minValue, $scope.slider.maxValue);
                //$scope.changeChartRange($scope.slider.minValue, $scope.slider.maxValue);
                if ($scope.min)
                    $scope.changeRangeRanges($scope.min, $scope.max);
                else
                    $scope.changeRangeRanges(0, $scope.track_length);
            } else {
                $scope.changeRangeRanges(0, $scope.track_length);
            }
            console.log(args);
        });

        $scope.optionsConsumptionRange = {
            chart: {
                type: 'pieChart',
                height: 370,
                donut: false,
                x: function (d) {
                    return d.key;
                }, /**
                 y: function (d) {
                 return d.y;
                 },*/
                color: ['#00ff00',
                    $scope.percentToRGB(3 / max_values[1] * 100),
                    $scope.percentToRGB(6 / max_values[1] * 100),
                    $scope.percentToRGB(9 / max_values[1] * 100),
                    $scope.percentToRGB(12 / max_values[1] * 100),
                    $scope.percentToRGB(14 / max_values[1] * 100)],
                showLabels: true,
                labelsOutside: true,
                pie: {
                    startAngle: function (d) {
                        return d.startAngle / 2 - Math.PI / 2
                    },
                    endAngle: function (d) {
                        return d.endAngle / 2 - Math.PI / 2
                    }
                },
                duration: 300,
                legendPosition: 'bottom',
                valueFormat: function (d) {
                    return d3.format(',.2f')(d) + "%";
                }
            }
        };
        $scope.optionsCO2Range = {
            chart: {
                type: 'pieChart',
                height: 370,
                donut: false,
                x: function (d) {
                    return d.key;
                }, /**
                 y: function (d) {
                 return d.y;
                 },*/
                color: ['#00ff00',
                    $scope.percentToRGB(5 / max_values[2] * 100),
                    $scope.percentToRGB(10 / max_values[2] * 100),
                    $scope.percentToRGB(15 / max_values[2] * 100),
                    $scope.percentToRGB(20 / max_values[2] * 100),
                    $scope.percentToRGB(25 / max_values[2] * 100)],
                showLabels: true,
                labelsOutside: true,
                pie: {
                    startAngle: function (d) {
                        return d.startAngle / 2 - Math.PI / 2
                    },
                    endAngle: function (d) {
                        return d.endAngle / 2 - Math.PI / 2
                    }
                },
                duration: 300,
                legendPosition: 'bottom',
                valueFormat: function (d) {
                    return d3.format(',.2f')(d) + "%";
                }
            }
        };
        $scope.optionsEngineRange = {
            chart: {
                type: 'pieChart',
                height: 370,
                donut: false,
                x: function (d) {
                    return d.key;
                }, /**
                 y: function (d) {
                 return d.y;
                 },*/
                color: ['#00ff00',
                    $scope.percentToRGB(15 / max_values[4] * 100),
                    $scope.percentToRGB(35 / max_values[4] * 100),
                    $scope.percentToRGB(55 / max_values[4] * 100),
                    $scope.percentToRGB(75 / max_values[4] * 100),
                    $scope.percentToRGB(100 / max_values[4] * 100)],
                showLabels: true,
                labelsOutside: true,
                pie: {
                    startAngle: function (d) {
                        return d.startAngle / 2 - Math.PI / 2
                    },
                    endAngle: function (d) {
                        return d.endAngle / 2 - Math.PI / 2
                    }
                },
                duration: 300,
                legendPosition: 'bottom',
                valueFormat: function (d) {
                    return d3.format(',.2f')(d) + "%";
                }
            }
        };
        $scope.optionsRPMRange = {
            chart: {
                type: 'pieChart',
                height: 370,
                donut: false,
                x: function (d) {
                    return d.key;
                }, /**
                 y: function (d) {
                 return d.y;
                 },*/
                color: ['#00ff00',
                    $scope.percentToRGB(1000 / max_values[3] * 100),
                    $scope.percentToRGB(1500 / max_values[3] * 100),
                    $scope.percentToRGB(2000 / max_values[3] * 100),
                    $scope.percentToRGB(3000 / max_values[3] * 100),
                    $scope.percentToRGB(3700 / max_values[3] * 100)],
                showLabels: true,
                labelsOutside: true,
                pie: {
                    startAngle: function (d) {
                        return d.startAngle / 2 - Math.PI / 2
                    },
                    endAngle: function (d) {
                        return d.endAngle / 2 - Math.PI / 2
                    }
                },
                duration: 300,
                legendPosition: 'bottom',
                valueFormat: function (d) {
                    return d3.format(',.2f')(d) + "%";
                }
            }
        };

        $scope.dataSpeedRange = [
            {
                key: "0km/h",
                y: 0
            },
            {
                key: "0-30km/h",
                y: 0
            },
            {
                key: "30-60km/h",
                y: 0
            },
            {
                key: "60-100km/h",
                y: 0
            },
            {
                key: "100-130km/h",
                y: 0
            },
            {
                key: "> 130km/h",
                y: 0
            }
        ];
        $scope.dataConsumptionRange = [
            {
                key: "0 l/h",
                y: 0
            },
            {
                key: "0-3 l/h",
                y: 0
            },
            {
                key: "3-6 l/h",
                y: 0
            },
            {
                key: "6-9 l/h",
                y: 0
            },
            {
                key: "9-12 l/h",
                y: 0
            },
            {
                key: "> 12 l/h",
                y: 0
            }
        ];
        $scope.dataCO2Range = [
            {
                key: "0 kg/h",
                y: 0
            },
            {
                key: "0-5 kg/h",
                y: 0
            },
            {
                key: "5-10 kg/h",
                y: 0
            },
            {
                key: "10-15 kg/h",
                y: 0
            },
            {
                key: "15-20 kg/h",
                y: 0
            },
            {
                key: "> 20 kg/h",
                y: 0
            }
        ];
        $scope.dataRPMRange = [
            {
                key: "0 r/min",
                y: 0
            },
            {
                key: "0-1k r/min",
                y: 0
            },
            {
                key: "1k-1.5k r/min",
                y: 0
            },
            {
                key: "1.5k-2k r/min",
                y: 0
            },
            {
                key: "2k-3k r/min",
                y: 0
            },
            {
                key: "> 3k r/min",
                y: 0
            }
        ];
        $scope.dataEngineLoadRange = [
            {
                key: "0 %",
                y: 0
            },
            {
                key: "0-15 %",
                y: 0
            },
            {
                key: "15-35 %",
                y: 0
            },
            {
                key: "35-55 %",
                y: 0
            },
            {
                key: "55-75 %",
                y: 0
            },
            {
                key: "75-100 %",
                y: 0
            }
        ];

        // to be filled with server query:
        $scope.data_all_ranges = [
            {
                key: 'Speed',
                values: []
            }, {
                key: 'Consumption',
                values: []
            }, {
                key: 'CO2',
                values: []
            }, {
                key: 'Rpm',
                values: []
            }, {
                key: 'Engine Load',
                values: []
            }
        ];
        var data_global = {};
        TrackService.getTrack($scope.username, $scope.password, $scope.trackid).then(
                function (data) {
                    console.log(data);
                    data_global = data;
                    var track_length = data_global.data.features.length;
                    $scope.track_length = track_length;

                    // iterating through each measurement:
                    for (var index = 0; index < track_length; index++) {
                        // get the phenomenon's value:
                        if (data_global.data.features[index].properties.phenomenons.Speed) {
                            var value_speed = data_global.data.features[index].properties.phenomenons.Speed.value;
                        }
                        if (data_global.data.features[index].properties.phenomenons.Consumption) {
                            var value_consumption = data_global.data.features[index].properties.phenomenons.Consumption.value;
                        }
                        if (data_global.data.features[index].properties.phenomenons.CO2) {
                            var value_CO2 = data_global.data.features[index].properties.phenomenons.CO2.value;
                        }
                        if (data_global.data.features[index].properties.phenomenons.Rpm.value) {
                            var value_RPM = data_global.data.features[index].properties.phenomenons.Rpm.value;
                        }
                        if (data_global.data.features[index].properties.phenomenons["Engine Load"].value) {
                            var value_EngineLoad = data_global.data.features[index].properties.phenomenons["Engine Load"].value;
                        }

                        // save all data:
                        $scope.data_all_ranges[0].values.push(value_speed);
                        $scope.data_all_ranges[1].values.push(value_consumption);
                        $scope.data_all_ranges[2].values.push(value_CO2);
                        $scope.data_all_ranges[3].values.push(value_RPM);
                        $scope.data_all_ranges[4].values.push(value_EngineLoad);
                    }
                    console.log($scope.data_all_ranges);
                    var partOfPercent = 100 / $scope.track_length;

                    // calculate %'s for each speed interval:
                    for (var i = 0; i < $scope.track_length; i++) {
                        var v = $scope.data_all_ranges[0].values[i];
                        switch (true) {
                            case (v === 0):
                                $scope.dataSpeedRange[0].y += partOfPercent;
                                break;
                            case (v < 30):
                                $scope.dataSpeedRange[1].y += partOfPercent;
                                break;
                            case (v < 60):
                                $scope.dataSpeedRange[2].y += partOfPercent;
                                break;
                            case (v < 100):
                                $scope.dataSpeedRange[3].y += partOfPercent;
                                break;
                            case (v < 130):
                                $scope.dataSpeedRange[4].y += partOfPercent;
                                break;
                            case (v >= 130):
                                $scope.dataSpeedRange[5].y += partOfPercent;
                                break;
                        }
                    }
                    $scope.onload_speed_Range = true;

                    // calculate %'s for each consumption interval:
                    for (var i = 0; i < $scope.track_length; i++) {
                        var v = $scope.data_all_ranges[1].values[i];
                        switch (true) {
                            case (v === 0):
                                $scope.dataConsumptionRange[0].y += partOfPercent;
                                break;
                            case (v < 3):
                                $scope.dataConsumptionRange[1].y += partOfPercent;
                                break;
                            case (v < 6):
                                $scope.dataConsumptionRange[2].y += partOfPercent;
                                break;
                            case (v < 9):
                                $scope.dataConsumptionRange[3].y += partOfPercent;
                                break;
                            case (v < 12):
                                $scope.dataConsumptionRange[4].y += partOfPercent;
                                break;
                            case (v >= 12):
                                $scope.dataConsumptionRange[5].y += partOfPercent;
                                break;
                        }
                    }
                    $scope.onload_consumption_Range = true;

                    // calculate %'s for each consumption interval:
                    for (var i = 0; i < $scope.track_length; i++) {
                        var v = $scope.data_all_ranges[2].values[i];
                        switch (true) {
                            case (v === 0):
                                $scope.dataCO2Range[0].y += partOfPercent;
                                break;
                            case (v < 3):
                                $scope.dataCO2Range[1].y += partOfPercent;
                                break;
                            case (v < 6):
                                $scope.dataCO2Range[2].y += partOfPercent;
                                break;
                            case (v < 9):
                                $scope.dataCO2Range[3].y += partOfPercent;
                                break;
                            case (v < 12):
                                $scope.dataCO2Range[4].y += partOfPercent;
                                break;
                            case (v >= 12):
                                $scope.dataCO2Range[5].y += partOfPercent;
                                break;
                        }
                    }
                    $scope.onload_CO2_Range = true;

                    // calculate %'s for each consumption interval:
                    for (var i = 0; i < $scope.track_length; i++) {
                        var v = $scope.data_all_ranges[3].values[i];
                        switch (true) {
                            case (v === 0):
                                $scope.dataRPMRange[0].y += partOfPercent;
                                break;
                            case (v < 1000):
                                $scope.dataRPMRange[1].y += partOfPercent;
                                break;
                            case (v < 1500):
                                $scope.dataRPMRange[2].y += partOfPercent;
                                break;
                            case (v < 2000):
                                $scope.dataRPMRange[3].y += partOfPercent;
                                break;
                            case (v < 3000):
                                $scope.dataRPMRange[4].y += partOfPercent;
                                break;
                            case (v >= 3000):
                                $scope.dataRPMRange[5].y += partOfPercent;
                                break;
                        }
                    }
                    $scope.onload_RPM_Range = true;

                    // calculate %'s for each consumption interval:
                    for (var i = 0; i < $scope.track_length; i++) {
                        var v = $scope.data_all_ranges[4].values[i];
                        switch (true) {
                            case (v === 0):
                                $scope.dataEngineLoadRange[0].y += partOfPercent;
                                break;
                            case (v < 15):
                                $scope.dataEngineLoadRange[1].y += partOfPercent;
                                break;
                            case (v < 35):
                                $scope.dataEngineLoadRange[2].y += partOfPercent;
                                break;
                            case (v < 55):
                                $scope.dataEngineLoadRange[3].y += partOfPercent;
                                break;
                            case (v < 75):
                                $scope.dataEngineLoadRange[4].y += partOfPercent;
                                break;
                            case (v >= 75):
                                $scope.dataEngineLoadRange[5].y += partOfPercent;
                                break;
                        }
                    }
                    $scope.onload_EngineLoad_Range = true;


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
            .controller('SpeedRangesChartCtrl', SpeedRangesChartCtrl);
})();
