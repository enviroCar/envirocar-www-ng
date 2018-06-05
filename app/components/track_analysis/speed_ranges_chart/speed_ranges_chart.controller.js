(function () {
    'use strict';
    function SpeedRangesChartCtrl(
            $rootScope,
            $scope,
            $stateParams,
            $timeout,
            TrackService,
            UserCredentialsService) {
        "ngInject";
        $scope.onload_all = false;

        $scope.onload_speed_Range = false;
        $scope.onload_consumption_Range = false;
        $scope.onload_CO2_Range = false;
        $scope.onload_EngineLoad_Range = false;
        $scope.onload_RPM_Range = false;
        $scope.onload_GPSSpeed_Range = false;
        $scope.loading = true;
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;
        $scope.selectedPhenom = 'Speed';
        $scope.trackid = $stateParams.trackid;
        $scope.mouseEntered = false;

        $scope.optionsSpeedRange = {
            chart: {
                type: 'pieChart',
                height: 370,
                donut: false,
                growOnHover: true,
                x: function (d) {
                    return d.key;
                },
                y: function (d) {
                    return d.y;
                },
                color: ['#00ff00',
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], $scope.yellow_break[0] / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], $scope.yellow_break[0], 1),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], ($scope.yellow_break[0] + $scope.red_break[0]) / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], $scope.red_break[0], 1),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], ($scope.red_break[0] + $scope.max_values[0]) / 2, 1)],
                showLabels: true,
                labelsOutside: true,
                pie: {
                    startAngle: function (d) {
                        return d.startAngle / 2 - Math.PI / 2
                    },
                    endAngle: function (d) {
                        return d.endAngle / 2 - Math.PI / 2
                    },
                    dispatch: {
                        elementClick: function (e) {
                            // set/reset highlights from piecharts:
                            $rootScope.$broadcast('single_track_page:interval-clicked', e.index);
                        }
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
            $scope.onload_GPSSpeed_Range = false;
            $scope.dataSpeedRange = [
                {
                    key: '  0 km/h',
                    y: 0
                },
                {
                    key: '0-' + $scope.yellow_break[0] / 2 + ' km/h',
                    y: 0
                },
                {
                    key: $scope.yellow_break[0] / 2 + '-' + $scope.yellow_break[0] + ' km/h',
                    y: 0
                },
                {
                    key: $scope.yellow_break[0] + '-' + ($scope.yellow_break[0] + $scope.red_break[0]) / 2 + ' km/h',
                    y: 0
                },
                {
                    key: ($scope.yellow_break[0] + $scope.red_break[0]) / 2 + '-' + $scope.red_break[0] + ' km/h',
                    y: 0
                },
                {
                    key: "> " + $scope.red_break[0] + " km/h",
                    y: 0
                }
            ];
            $scope.dataConsumptionRange = [
                {
                    key: '  0 l/h',
                    y: 0
                },
                {
                    key: '0-' + $scope.yellow_break[1] / 2 + ' l/h',
                    y: 0
                },
                {
                    key: $scope.yellow_break[1] / 2 + '-' + $scope.yellow_break[1] + ' l/h',
                    y: 0
                },
                {
                    key: $scope.yellow_break[1] + '-' + ($scope.yellow_break[1] + $scope.red_break[1]) / 2 + ' l/h',
                    y: 0
                },
                {
                    key: ($scope.yellow_break[1] + $scope.red_break[1]) / 2 + '-' + $scope.red_break[1] + ' l/h',
                    y: 0
                },
                {
                    key: "> " + $scope.red_break[1] + " l/h",
                    y: 0
                }
            ];
            $scope.dataCO2Range = [
                {
                    key: '  0 kg/h',
                    y: 0
                },
                {
                    key: '0-' + $scope.yellow_break[2] / 2 + ' kg/h',
                    y: 0
                },
                {
                    key: $scope.yellow_break[2] / 2 + '-' + $scope.yellow_break[2] + ' kg/h',
                    y: 0
                },
                {
                    key: $scope.yellow_break[2] + '-' + ($scope.yellow_break[2] + $scope.red_break[2]) / 2 + ' kg/h',
                    y: 0
                },
                {
                    key: ($scope.yellow_break[2] + $scope.red_break[2]) / 2 + '-' + $scope.red_break[2] + ' kg/h',
                    y: 0
                },
                {
                    key: "> " + $scope.red_break[2] + " kg/h",
                    y: 0
                }
            ];
            $scope.dataRPMRange = [
                {
                    key: '  0 r/min',
                    y: 0
                },
                {
                    key: '0-' + $scope.yellow_break[3] / 2 + ' r/min',
                    y: 0
                },
                {
                    key: $scope.yellow_break[3] / 2 + '-' + $scope.yellow_break[3] + ' r/min',
                    y: 0
                },
                {
                    key: $scope.yellow_break[3] + '-' + ($scope.yellow_break[3] + $scope.red_break[3]) / 2 + ' r/min',
                    y: 0
                },
                {
                    key: ($scope.yellow_break[3] + $scope.red_break[3]) / 2 + '-' + $scope.red_break[3] + ' r/min',
                    y: 0
                },
                {
                    key: "> " + $scope.red_break[3] + " r/min",
                    y: 0
                }
            ];
            $scope.dataEngineLoadRange = [
                {
                    key: '  0 %',
                    y: 0
                },
                {
                    key: '0-' + $scope.yellow_break[4] / 2 + ' %',
                    y: 0
                },
                {
                    key: $scope.yellow_break[4] / 2 + '-' + $scope.yellow_break[4] + ' %',
                    y: 0
                },
                {
                    key: $scope.yellow_break[4] + '-' + ($scope.yellow_break[4] + $scope.red_break[4]) / 2 + ' %',
                    y: 0
                },
                {
                    key: ($scope.yellow_break[4] + $scope.red_break[4]) / 2 + '-' + $scope.red_break[4] + ' %',
                    y: 0
                },
                {
                    key: "> " + $scope.red_break[4] + " %",
                    y: 0
                }
            ];
            $scope.dataGPSSpeedRange = [
                {
                    key: '  0 km/h',
                    y: 0
                },
                {
                    key: '0-' + $scope.yellow_break[5] / 2 + ' km/h',
                    y: 0
                },
                {
                    key: $scope.yellow_break[5] / 2 + '-' + $scope.yellow_break[5] + ' km/h',
                    y: 0
                },
                {
                    key: $scope.yellow_break[5] + '-' + ($scope.yellow_break[5] + $scope.red_break[5]) / 2 + ' km/h',
                    y: 0
                },
                {
                    key: ($scope.yellow_break[5] + $scope.red_break[5]) / 2 + '-' + $scope.red_break[5] + ' km/h',
                    y: 0
                },
                {
                    key: "> " + $scope.red_break[5] + " km/h",
                    y: 0
                }
            ];

            var count = 0;
            //checkout partOfPercent for errorneous data:
            for (var i = a; i < b + 1; i++) {
                if ($scope.data_all_ranges[0].values[i] !== undefined)
                    count++;
            }
            var partOfPercent = 100 / count;

            // calculate %'s for each speed interval:
            for (var i = a; i < b + 1; i++) {
                var v = $scope.data_all_ranges[0].values[i];
                switch (true) {
                    case (v === 0):
                        $scope.dataSpeedRange[0].y += partOfPercent;
                        break;
                    case (v < $scope.yellow_break[0] / 2):
                        $scope.dataSpeedRange[1].y += partOfPercent;
                        break;
                    case (v < $scope.yellow_break[0]):
                        $scope.dataSpeedRange[2].y += partOfPercent;
                        break;
                    case (v < ($scope.yellow_break[0] + $scope.red_break[0]) / 2):
                        $scope.dataSpeedRange[3].y += partOfPercent;
                        break;
                    case (v < $scope.red_break[0]):
                        $scope.dataSpeedRange[4].y += partOfPercent;
                        break;
                    case (v >= $scope.red_break[0]):
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
                    case (v < $scope.yellow_break[1] / 2):
                        $scope.dataConsumptionRange[1].y += partOfPercent;
                        break;
                    case (v < $scope.yellow_break[1]):
                        $scope.dataConsumptionRange[2].y += partOfPercent;
                        break;
                    case (v < ($scope.yellow_break[1] + $scope.red_break[1]) / 2):
                        $scope.dataConsumptionRange[3].y += partOfPercent;
                        break;
                    case (v < $scope.red_break[1]):
                        $scope.dataConsumptionRange[4].y += partOfPercent;
                        break;
                    case (v >= $scope.red_break[1]):
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
                    case (v < $scope.yellow_break[2] / 2):
                        $scope.dataCO2Range[1].y += partOfPercent;
                        break;
                    case (v < $scope.yellow_break[2]):
                        $scope.dataCO2Range[2].y += partOfPercent;
                        break;
                    case (v < ($scope.yellow_break[2] + $scope.red_break[2]) / 2):
                        $scope.dataCO2Range[3].y += partOfPercent;
                        break;
                    case (v < $scope.red_break[2]):
                        $scope.dataCO2Range[4].y += partOfPercent;
                        break;
                    case (v >= $scope.red_break[2]):
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
                    case (v < $scope.yellow_break[3] / 2):
                        $scope.dataRPMRange[1].y += partOfPercent;
                        break;
                    case (v < $scope.yellow_break[3]):
                        $scope.dataRPMRange[2].y += partOfPercent;
                        break;
                    case (v < ($scope.yellow_break[3] + $scope.red_break[3]) / 2):
                        $scope.dataRPMRange[3].y += partOfPercent;
                        break;
                    case (v < $scope.red_break[3]):
                        $scope.dataRPMRange[4].y += partOfPercent;
                        break;
                    case (v >= $scope.red_break[3]):
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
                    case (v < $scope.yellow_break[4] / 2):
                        $scope.dataEngineLoadRange[1].y += partOfPercent;
                        break;
                    case (v < $scope.yellow_break[4]):
                        $scope.dataEngineLoadRange[2].y += partOfPercent;
                        break;
                    case (v < ($scope.yellow_break[4] + $scope.red_break[4]) / 2):
                        $scope.dataEngineLoadRange[3].y += partOfPercent;
                        break;
                    case (v < $scope.red_break[4]):
                        $scope.dataEngineLoadRange[4].y += partOfPercent;
                        break;
                    case (v >= $scope.red_break[4]):
                        $scope.dataEngineLoadRange[5].y += partOfPercent;
                        break;
                }
            }
            $scope.onload_EngineLoad_Range = true;
            
            // calculate %'s for each consumption interval:
            for (var i = a; i < b + 1; i++) {
                var v = $scope.data_all_ranges[5].values[i];
                switch (true) {
                    case (v === 0):
                        $scope.dataGPSSpeedRange[0].y += partOfPercent;
                        break;
                    case (v < $scope.yellow_break[5] / 2):
                        $scope.dataGPSSpeedRange[1].y += partOfPercent;
                        break;
                    case (v < $scope.yellow_break[5]):
                        $scope.dataGPSSpeedRange[2].y += partOfPercent;
                        break;
                    case (v < ($scope.yellow_break[5] + $scope.red_break[5]) / 2):
                        $scope.dataGPSSpeedRange[3].y += partOfPercent;
                        break;
                    case (v < $scope.red_break[5]):
                        $scope.dataGPSSpeedRange[4].y += partOfPercent;
                        break;
                    case (v >= $scope.red_break[5]):
                        $scope.dataGPSSpeedRange[5].y += partOfPercent;
                        break;
                }
            }
            $scope.onload_GPSSpeed_Range = true;
        };

        $scope.$on('single_track_page:segment-changed', function (event, args) {
            $scope.min = args.min;
            $scope.max = args.max;
            $scope.changeRangeRanges($scope.min, $scope.max);
        });

        $scope.$on('toolbar:language-changed', function (event, args) {

        });

        $scope.$on('single_track_page:segment-activated', function (event, args) {
            if (args) {
                if (!$scope.min)
                    $scope.min = 0;
                if (!$scope.max)
                    $scope.max = $scope.track_length;
                $scope.changeRangeRanges($scope.min, $scope.max);
            } else {
                $scope.changeRangeRanges(0, $scope.track_length);
            }
        });

        $scope.$on('track-toolbar:phenomenon-changed', function (event, args) {
            $scope.selectedPhenom = args;

            if ($scope.segmentActivated) {
                //$scope.changeSelectionRange($scope.slider.minValue, $scope.slider.maxValue);
                //$scope.changeChartRange($scope.slider.minValue, $scope.slider.maxValue);
                if ($scope.min !== undefined)
                    $scope.changeRangeRanges($scope.min, $scope.max);
                else
                    $scope.changeRangeRanges(0, $scope.track_length);
            } else
                $scope.changeRangeRanges(0, $scope.track_length);
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
                    $scope.percentToRGB($scope.yellow_break[1], $scope.red_break[1], $scope.max_values[1], $scope.yellow_break[1] / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[1], $scope.red_break[1], $scope.max_values[1], $scope.yellow_break[1], 1),
                    $scope.percentToRGB($scope.yellow_break[1], $scope.red_break[1], $scope.max_values[1], ($scope.yellow_break[1] + $scope.red_break[1]) / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[1], $scope.red_break[1], $scope.max_values[1], $scope.red_break[1], 1),
                    $scope.percentToRGB($scope.yellow_break[1], $scope.red_break[1], $scope.max_values[1], ($scope.red_break[1] + $scope.max_values[1]) / 2, 1)],
                showLabels: true,
                labelsOutside: true,
                pie: {
                    startAngle: function (d) {
                        return d.startAngle / 2 - Math.PI / 2
                    },
                    endAngle: function (d) {
                        return d.endAngle / 2 - Math.PI / 2
                    },
                    dispatch: {
                        elementClick: function (e) {
                            $rootScope.$broadcast('single_track_page:interval-clicked', e.index);
                            // reset highlights from piecharts:
                            console.log(e);
                            
                            // set highlights on piecharts:
                            //var clickedDayDiv = angular.element(document.querySelectorAll('[tabindex="' + i + '"]'));
                        }
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
                    $scope.percentToRGB($scope.yellow_break[2], $scope.red_break[2], $scope.max_values[2], $scope.yellow_break[2] / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[2], $scope.red_break[2], $scope.max_values[2], $scope.yellow_break[2], 1),
                    $scope.percentToRGB($scope.yellow_break[2], $scope.red_break[2], $scope.max_values[2], ($scope.yellow_break[2] + $scope.red_break[2]) / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[2], $scope.red_break[2], $scope.max_values[2], $scope.red_break[2], 1),
                    $scope.percentToRGB($scope.yellow_break[2], $scope.red_break[2], $scope.max_values[2], ($scope.red_break[2] + $scope.max_values[2]) / 2, 1)],
                showLabels: true,
                labelsOutside: true,
                pie: {
                    startAngle: function (d) {
                        return d.startAngle / 2 - Math.PI / 2
                    },
                    endAngle: function (d) {
                        return d.endAngle / 2 - Math.PI / 2
                    },
                    dispatch: {
                        elementClick: function (e) {
                            $rootScope.$broadcast('single_track_page:interval-clicked', e.index);
                            // reset highlights from piecharts:
                            console.log(e);
                            
                            // set highlights on piecharts:
                            //var clickedDayDiv = angular.element(document.querySelectorAll('[tabindex="' + i + '"]'));
                        }
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
                    $scope.percentToRGB($scope.yellow_break[4], $scope.red_break[4], $scope.max_values[4], $scope.yellow_break[4] / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[4], $scope.red_break[4], $scope.max_values[4], $scope.yellow_break[4], 1),
                    $scope.percentToRGB($scope.yellow_break[4], $scope.red_break[4], $scope.max_values[4], ($scope.yellow_break[4] + $scope.red_break[4]) / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[4], $scope.red_break[4], $scope.max_values[4], $scope.red_break[4], 1),
                    $scope.percentToRGB($scope.yellow_break[4], $scope.red_break[4], $scope.max_values[4], ($scope.red_break[4] + $scope.max_values[4]) / 2, 1)],
                showLabels: true,
                labelsOutside: true,
                pie: {
                    startAngle: function (d) {
                        return d.startAngle / 2 - Math.PI / 2
                    },
                    endAngle: function (d) {
                        return d.endAngle / 2 - Math.PI / 2
                    },
                    dispatch: {
                        elementClick: function (e) {
                            $rootScope.$broadcast('single_track_page:interval-clicked', e.index);
                            // reset highlights from piecharts:
                            console.log(e);
                            
                            // set highlights on piecharts:
                            //var clickedDayDiv = angular.element(document.querySelectorAll('[tabindex="' + i + '"]'));
                        }
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
                    $scope.percentToRGB($scope.yellow_break[3], $scope.red_break[3], $scope.max_values[3], $scope.yellow_break[3] / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[3], $scope.red_break[3], $scope.max_values[3], $scope.yellow_break[3], 1),
                    $scope.percentToRGB($scope.yellow_break[3], $scope.red_break[3], $scope.max_values[3], ($scope.yellow_break[3] + $scope.red_break[3]) / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[3], $scope.red_break[3], $scope.max_values[3], $scope.red_break[3], 1),
                    $scope.percentToRGB($scope.yellow_break[3], $scope.red_break[3], $scope.max_values[3], ($scope.red_break[3] + $scope.max_values[3]) / 2, 1)],
                showLabels: true,
                labelsOutside: true,
                pie: {
                    startAngle: function (d) {
                        return d.startAngle / 2 - Math.PI / 2
                    },
                    endAngle: function (d) {
                        return d.endAngle / 2 - Math.PI / 2
                    },
                    dispatch: {
                        elementClick: function (e) {
                            $rootScope.$broadcast('single_track_page:interval-clicked', e.index);
                            // reset highlights from piecharts:
                            console.log(e);
                            
                            // set highlights on piecharts:
                            //var clickedDayDiv = angular.element(document.querySelectorAll('[tabindex="' + i + '"]'));
                        }
                    }
                },
                duration: 300,
                legendPosition: 'bottom',
                valueFormat: function (d) {
                    return d3.format(',.2f')(d) + "%";
                }
            }
        };
        $scope.optionsGPSSpeedRange = {
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
                    $scope.percentToRGB($scope.yellow_break[5], $scope.red_break[5], $scope.max_values[5], $scope.yellow_break[5] / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[5], $scope.red_break[5], $scope.max_values[5], $scope.yellow_break[5], 1),
                    $scope.percentToRGB($scope.yellow_break[5], $scope.red_break[5], $scope.max_values[5], ($scope.yellow_break[5] + $scope.red_break[5]) / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[5], $scope.red_break[5], $scope.max_values[5], $scope.red_break[5], 1),
                    $scope.percentToRGB($scope.yellow_break[5], $scope.red_break[5], $scope.max_values[5], ($scope.red_break[5] + $scope.max_values[5]) / 2, 1)],
                showLabels: true,
                labelsOutside: true,
                pie: {
                    startAngle: function (d) {
                        return d.startAngle / 2 - Math.PI / 2
                    },
                    endAngle: function (d) {
                        return d.endAngle / 2 - Math.PI / 2
                    },
                    dispatch: {
                        elementClick: function (e) {
                            $rootScope.$broadcast('single_track_page:interval-clicked', e.index);
                            // reset highlights from piecharts:
                            console.log(e);
                            
                            // set highlights on piecharts:
                            //var clickedDayDiv = angular.element(document.querySelectorAll('[tabindex="' + i + '"]'));
                        }
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
                key: '  0 km/h',
                y: 0
            },
            {
                key: '0-' + $scope.yellow_break[0] / 2 + ' km/h',
                y: 0
            },
            {
                key: $scope.yellow_break[0] / 2 + '-' + $scope.yellow_break[0] + ' km/h',
                y: 0
            },
            {
                key: $scope.yellow_break[0] + '-' + ($scope.yellow_break[0] + $scope.red_break[0]) / 2 + ' km/h',
                y: 0
            },
            {
                key: ($scope.yellow_break[0] + $scope.red_break[0]) / 2 + '-' + $scope.red_break[0] + ' km/h',
                y: 0
            },
            {
                key: "> " + $scope.red_break[0] + " km/h",
                y: 0
            }
        ];
        $scope.dataConsumptionRange = [
            {
                key: '  0 l/h',
                y: 0
            },
            {
                key: '0-' + $scope.yellow_break[1] / 2 + ' l/h',
                y: 0
            },
            {
                key: $scope.yellow_break[1] / 2 + '-' + $scope.yellow_break[1] + ' l/h',
                y: 0
            },
            {
                key: $scope.yellow_break[1] + '-' + ($scope.yellow_break[1] + $scope.red_break[1]) / 2 + ' l/h',
                y: 0
            },
            {
                key: ($scope.yellow_break[1] + $scope.red_break[1]) / 2 + '-' + $scope.red_break[1] + ' l/h',
                y: 0
            },
            {
                key: "> " + $scope.red_break[1] + " l/h",
                y: 0
            }
        ];
        $scope.dataCO2Range = [
            {
                key: '  0 kg/h',
                y: 0
            },
            {
                key: '0-' + $scope.yellow_break[2] / 2 + ' kg/h',
                y: 0
            },
            {
                key: $scope.yellow_break[2] / 2 + '-' + $scope.yellow_break[2] + ' kg/h',
                y: 0
            },
            {
                key: $scope.yellow_break[2] + '-' + ($scope.yellow_break[2] + $scope.red_break[2]) / 2 + ' kg/h',
                y: 0
            },
            {
                key: ($scope.yellow_break[2] + $scope.red_break[2]) / 2 + '-' + $scope.red_break[2] + ' kg/h',
                y: 0
            },
            {
                key: "> " + $scope.red_break[2] + " kg/h",
                y: 0
            }
        ];
        $scope.dataRPMRange = [
            {
                key: '  0 r/min',
                y: 0
            },
            {
                key: '0-' + $scope.yellow_break[3] / 2 + ' r/min',
                y: 0
            },
            {
                key: $scope.yellow_break[3] / 2 + '-' + $scope.yellow_break[3] + ' r/min',
                y: 0
            },
            {
                key: $scope.yellow_break[3] + '-' + ($scope.yellow_break[3] + $scope.red_break[3]) / 2 + ' r/min',
                y: 0
            },
            {
                key: ($scope.yellow_break[3] + $scope.red_break[3]) / 2 + '-' + $scope.red_break[3] + ' r/min',
                y: 0
            },
            {
                key: "> " + $scope.red_break[3] + " r/min",
                y: 0
            }
        ];
        $scope.dataEngineLoadRange = [
            {
                key: '  0 %',
                y: 0
            },
            {
                key: '0-' + $scope.yellow_break[4] / 2 + ' %',
                y: 0
            },
            {
                key: $scope.yellow_break[4] / 2 + '-' + $scope.yellow_break[4] + ' %',
                y: 0
            },
            {
                key: $scope.yellow_break[4] + '-' + ($scope.yellow_break[4] + $scope.red_break[4]) / 2 + ' %',
                y: 0
            },
            {
                key: ($scope.yellow_break[4] + $scope.red_break[4]) / 2 + '-' + $scope.red_break[4] + ' %',
                y: 0
            },
            {
                key: "> " + $scope.red_break[4] + " %",
                y: 0
            }
        ];
        $scope.dataGPSSpeedRange = [
            {
                key: '  0 %',
                y: 0
            },
            {
                key: '0-' + $scope.yellow_break[5] / 2 + ' %',
                y: 0
            },
            {
                key: $scope.yellow_break[5] / 2 + '-' + $scope.yellow_break[5] + ' %',
                y: 0
            },
            {
                key: $scope.yellow_break[5] + '-' + ($scope.yellow_break[5] + $scope.red_break[5]) / 2 + ' %',
                y: 0
            },
            {
                key: ($scope.yellow_break[5] + $scope.red_break[5]) / 2 + '-' + $scope.red_break[5] + ' %',
                y: 0
            },
            {
                key: "> " + $scope.red_break[5] + " %",
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
            }, {
                key: 'GPS Speed',
                values: []
            }
        ];
        var data_global = {};
        TrackService.getTrack($scope.username, $scope.password, $scope.trackid).then(
                function (data) {
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
                        if (data_global.data.features[index].properties.phenomenons.Rpm) {
                            var value_RPM = data_global.data.features[index].properties.phenomenons.Rpm.value;
                        }
                        if (data_global.data.features[index].properties.phenomenons["Engine Load"]) {
                            var value_EngineLoad = data_global.data.features[index].properties.phenomenons["Engine Load"].value;
                        }
                        if (data_global.data.features[index].properties.phenomenons["GPS Speed"]) {
                            var value_GPSSpeed = data_global.data.features[index].properties.phenomenons["GPS Speed"].value;
                        }

                        // save all data:
                        $scope.data_all_ranges[0].values.push(value_speed);
                        $scope.data_all_ranges[1].values.push(value_consumption);
                        $scope.data_all_ranges[2].values.push(value_CO2);
                        $scope.data_all_ranges[3].values.push(value_RPM);
                        $scope.data_all_ranges[4].values.push(value_EngineLoad);
                        $scope.data_all_ranges[5].values.push(value_GPSSpeed);
                    }
                    var partOfPercent = 100 / $scope.track_length;

                    // calculate %'s for each speed interval:
                    for (var i = 0; i < $scope.track_length; i++) {
                        var v = $scope.data_all_ranges[0].values[i];
                        switch (true) {
                            case (v === 0):
                                $scope.dataSpeedRange[0].y += partOfPercent;
                                break;
                            case (v < $scope.yellow_break[0] / 2):
                                $scope.dataSpeedRange[1].y += partOfPercent;
                                break;
                            case (v < $scope.yellow_break[0]):
                                $scope.dataSpeedRange[2].y += partOfPercent;
                                break;
                            case (v < ($scope.yellow_break[0] + $scope.red_break[0]) / 2):
                                $scope.dataSpeedRange[3].y += partOfPercent;
                                break;
                            case (v < $scope.red_break[0]):
                                $scope.dataSpeedRange[4].y += partOfPercent;
                                break;
                            case (v >= $scope.red_break[0]):
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
                            case (v < $scope.yellow_break[1] / 2):
                                $scope.dataConsumptionRange[1].y += partOfPercent;
                                break;
                            case (v < $scope.yellow_break[1]):
                                $scope.dataConsumptionRange[2].y += partOfPercent;
                                break;
                            case (v < ($scope.yellow_break[1] + $scope.red_break[1]) / 2):
                                $scope.dataConsumptionRange[3].y += partOfPercent;
                                break;
                            case (v < $scope.red_break[1]):
                                $scope.dataConsumptionRange[4].y += partOfPercent;
                                break;
                            case (v >= $scope.red_break[1]):
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
                            case (v < $scope.yellow_break[2] / 2):
                                $scope.dataCO2Range[1].y += partOfPercent;
                                break;
                            case (v < $scope.yellow_break[2]):
                                $scope.dataCO2Range[2].y += partOfPercent;
                                break;
                            case (v < ($scope.yellow_break[2] + $scope.red_break[2]) / 2):
                                $scope.dataCO2Range[3].y += partOfPercent;
                                break;
                            case (v < $scope.red_break[2]):
                                $scope.dataCO2Range[4].y += partOfPercent;
                                break;
                            case (v >= $scope.red_break[2]):
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
                            case (v < $scope.yellow_break[3] / 2):
                                $scope.dataRPMRange[1].y += partOfPercent;
                                break;
                            case (v < $scope.yellow_break[3]):
                                $scope.dataRPMRange[2].y += partOfPercent;
                                break;
                            case (v < ($scope.yellow_break[3] + $scope.red_break[3]) / 2):
                                $scope.dataRPMRange[3].y += partOfPercent;
                                break;
                            case (v < $scope.red_break[3]):
                                $scope.dataRPMRange[4].y += partOfPercent;
                                break;
                            case (v >= $scope.red_break[3]):
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
                            case (v < $scope.yellow_break[4] / 2):
                                $scope.dataEngineLoadRange[1].y += partOfPercent;
                                break;
                            case (v < $scope.yellow_break[4]):
                                $scope.dataEngineLoadRange[2].y += partOfPercent;
                                break;
                            case (v < ($scope.yellow_break[4] + $scope.red_break[4]) / 2):
                                $scope.dataEngineLoadRange[3].y += partOfPercent;
                                break;
                            case (v < $scope.red_break[4]):
                                $scope.dataEngineLoadRange[4].y += partOfPercent;
                                break;
                            case (v >= $scope.red_break[4]):
                                $scope.dataEngineLoadRange[5].y += partOfPercent;
                                break;
                        }
                    }
                    $scope.onload_EngineLoad_Range = true;

                    // calculate %'s for each consumption interval:
                    for (var i = 0; i < $scope.track_length; i++) {
                        var v = $scope.data_all_ranges[5].values[i];
                        switch (true) {
                            case (v === 0):
                                $scope.dataGPSSpeedRange[0].y += partOfPercent;
                                break;
                            case (v < $scope.yellow_break[5] / 2):
                                $scope.dataGPSSpeedRange[1].y += partOfPercent;
                                break;
                            case (v < $scope.yellow_break[5]):
                                $scope.dataGPSSpeedRange[2].y += partOfPercent;
                                break;
                            case (v < ($scope.yellow_break[5] + $scope.red_break[5]) / 2):
                                $scope.dataGPSSpeedRange[3].y += partOfPercent;
                                break;
                            case (v < $scope.red_break[5]):
                                $scope.dataGPSSpeedRange[4].y += partOfPercent;
                                break;
                            case (v >= $scope.red_break[5]):
                                $scope.dataGPSSpeedRange[5].y += partOfPercent;
                                break;
                        }
                    }
                    $scope.onload_GPSSpeed_Range = true;


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
