(function () {
    'use strict';

    function LineChartWithoutFocusCtrl(
            $scope,
            $stateParams,
            $timeout,
            $translate,
            TrackService,
            UserCredentialsService,
            PhenomenonService) {
        "ngInject";
        $scope.trackid = $stateParams.trackid;
        $scope.onload_track_chart = false;
        // FIXME: Speed phenomenon not always available/ should not be the default phenom.
        $scope.currentPhenomenon = 'Speed';
        $scope.currentPhenomenonIndex = 0;
        var phenom = PhenomenonService.getPhenomenon();

        $scope.currentPhenomenon = phenom.name;
        $scope.currentPhenomenonIndex = phenom.index;

        $scope.$on('leafletDirectivePath.click', function (event, path) {
            //path.modelname
            $scope.clickedXPoint = parseInt(path.modelName.substring(1));
            $scope.showMeasurementXInChart();
            $scope.showMeasurementX();
        });

        $scope.$on('leafletDirectivePath.mouseover', function (event, path) {
            //path.modelName;
            $scope.hoveredXPoint = parseInt(path.modelName.substring(1));
            $scope.showHoveredPointInChart();
        });

        $scope.$on('track-toolbar:phenomenon-changed', function (event, args) {
            $scope.currentPhenomenon = args;
            switch ($scope.currentPhenomenon) {
                case 'Speed':
                    $scope.dataTrackChart[0] = $scope.data_all[0];
                    $scope.paths = $scope.paths_all[0];
                    $scope.currentPhenomenonIndex = 0;
                    $scope.optionsTrackChart = $scope.createChartOptions('km/h');
                    break;
                case 'Consumption':
                    $scope.dataTrackChart[0] = $scope.data_all[1];
                    $scope.paths = $scope.paths_all[1];
                    $scope.currentPhenomenonIndex = 1;
                    $scope.optionsTrackChart = $scope.createChartOptions('l/100km');
                    break;
                case 'CO2':
                    $scope.paths = $scope.paths_all[2];
                    $scope.dataTrackChart[0] = $scope.data_all[2];
                    $scope.currentPhenomenonIndex = 2;
                    $scope.optionsTrackChart = $scope.createChartOptions('kg');
                    break;
                case 'Rpm':
                    $scope.dataTrackChart[0] = $scope.data_all[3];
                    $scope.paths = $scope.paths_all[3];
                    $scope.currentPhenomenonIndex = 3;
                    $scope.optionsTrackChart = $scope.createChartOptions('r/min');
                    break;
                case 'Engine Load':
                    $scope.dataTrackChart[0] = $scope.data_all[4];
                    $scope.paths = $scope.paths_all[4];
                    $scope.currentPhenomenonIndex = 4;
                    $scope.optionsTrackChart = $scope.createChartOptions('%');
                    break;
                case 'GPS Speed':
                    $scope.dataTrackChart[0] = $scope.data_all[5];
                    $scope.paths = $scope.paths_all[5];
                    $scope.currentPhenomenonIndex = 5;
                    $scope.optionsTrackChart = $scope.createChartOptions('km/h');
                    break;
                case 'Minimum Acceleration':
                    $scope.dataTrackChart[0] = $scope.data_all[6];
                    $scope.paths = $scope.paths_all[6];
                    $scope.currentPhenomenonIndex = 6;
                    $scope.optionsTrackChart = $scope.createChartOptions('m/s²');
                    break;
                case 'Maximum Acceleration':
                    $scope.dataTrackChart[0] = $scope.data_all[7];
                    $scope.paths = $scope.paths_all[7];
                    $scope.currentPhenomenonIndex = 7;
                    $scope.optionsTrackChart = $scope.createChartOptions('m/s²');
                    break;
            }
        });

        // chart options for the nvd3 line with focus chart:
        $scope.clickedXPoint = 0;
        $scope.hoveredXPoint = 0;

        $scope.createChartOptions = function(yAxisUnit) {
            return {
                chart: {
                    type: 'lineChart',
                    height: 450,
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 60,
                        left: 40
                    },
                    useInteractiveGuideline: true,
                    duration: 50,
                    xAxis: {
                        axisLabel: "",
                        tickFormat: function (d) {
                            return $scope.timestamps[d];
                        }
                    },
                    yAxis: {
                        axisLabel: yAxisUnit,
                        tickFormat: function (d) {
                            var y;
                            if ($scope.currentPhenomenonIndex === 3) {
                                y = d.toFixed(0);
                            } else {
                                y = d3.format(',.2f')(d);
                            }
                            return y;
                        },
                        rotateYLabel: false
                    },
                    interactiveLayer: {
                        dispatch: {
                            elementClick: function (e) {
                                $scope.clickedXPoint = Math.round(e.pointXValue);
                                $scope.showMeasurementX();
                                $scope.removeHoveredPointInChart();
                                $scope.showMeasurementXInChart();
                            },
                            elementMousemove: function (e) {
                                if ($scope.hoveredXPoint !== Math.round(e.pointXValue)) {
                                    $scope.removeHoveredPointInChart();
                                    $scope.hoveredXPoint = Math.round(e.pointXValue);
                                    $scope.showHoveredX();
                                }
                            },
                            elementMouseout: function (e) {
                                $scope.removeHoveredPointInChart();
                                $scope.hoveredXPoint = 0;
                                $scope.removeHoverMarker();
                            },
                            onBrush: function (e) {
                                console.log(e);
                            }
                        }
                    }
                }
            };
        };

        $scope.optionsTrackChart = $scope.createChartOptions('');

        // to be filled with server query:
        $scope.data_all = [
            {
                key: $translate.instant('SPEED'),
                values: [
                ]
            },
            {
                key: $translate.instant('CONSUMPTION'),
                values: [
                ]
            },
            {
                key: $translate.instant('CO2'),
                values: [
                ]
            },
            {
                key: $translate.instant('RPM'),
                values: [
                ]
            },
            {
                key: $translate.instant('ENGINE_LOAD'),
                values: [
                ]
            },
            {
                key: $translate.instant('GPS_SPEED'),
                values: [
                ]
            },
            {
                key: $translate.instant('MINIMUM_ACCELERATION'),
                values: [
                ]
            },
            {
                key: $translate.instant('MAXIMUM_ACCELERATION'),
                values: [
                ]
            }
        ];


        // Chart data setup for Track Chart:
        var label;
        switch ($scope.currentPhenomenonIndex) {
            case 0:
                label = $translate.instant('SPEED');
                break;
            case 1:
                label = $translate.instant('CONSUMPTION');
                break;
            case 2:
                label = $translate.instant('CO2');
                break;
            case 3:
                label = $translate.instant('RPM');
                break;
            case 4:
                label = $translate.instant('ENGINE_LOAD');
                break;
            case 5:
                label = $translate.instant('GPS_SPEED');
                break;
            case 6:
                label = $translate.instant('MINIMUM_ACCELERATION');
                break;
            case 7:
                label = $translate.instant('MAXIMUM_ACCELERATION');
                break;
        }
        ;
        $scope.dataTrackChart = [
            {
                key: label,
                values: [
                ]
            }
        ];

        $scope.$on('toolbar:language-changed', function (event, args) {
            //1. translate
            $scope.data_all[0].key = $translate.instant('SPEED');
            $scope.data_all[1].key = $translate.instant('CONSUMPTION');
            $scope.data_all[2].key = $translate.instant('CO2');
            $scope.data_all[3].key = $translate.instant('RPM');
            $scope.data_all[4].key = $translate.instant('ENGINE_LOAD');
            $scope.data_all[5].key = $translate.instant('GPS_SPEED');
            $scope.data_all[6].key = $translate.instant('MINIMUM_ACCELERATION');
            $scope.data_all[7].key = $translate.instant('MAXIMUM_ACCELERATION');

            //2. set to current selected phenomenon
            var phenom = PhenomenonService.getPhenomenon();
            $scope.currentPhenomenon = phenom.name;
            $scope.currentPhenomenonIndex = phenom.index;
            $scope.dataTrackChart[0] = $scope.data_all[$scope.currentPhenomenonIndex];
            //3. set previous selected selection range
            if ($scope.segmentActivated) {
                $scope.changeSelectionRange($scope.slider.minValue, $scope.slider.maxValue);
                $scope.changeChartRange($scope.slider.minValue, $scope.slider.maxValue);
            } else {
                $scope.changeSelectionRange(0, $scope.slider.options.ceil);
                $scope.changeChartRange(0, $scope.slider.options.ceil);
            }
        });

        $scope.removeCurrentPositionMarker = function () {
            $scope.markers.ClickedPosition = {
                'lat': -1000,
                'lng': -1000,
                focus: false,
                icon: $scope.markerGreen
            };
            /**
             $timeout(function () {
             window.dispatchEvent(new Event('resize'))
             },
             10);*/
        };
        $scope.removeHoverMarker = function () {
            $scope.markers.HoveredPosition = {
                'lat': -1000,
                'lng': -1000,
                focus: false,
                icon: $scope.markerBlue
            };
            $timeout(function () {
                window.dispatchEvent(new Event('resize'))
            },
                    1);
        };
        
        $scope.showHoveredPointInChart = function () {
            if (($scope.hoveredXPoint !== $scope.lastClickedXPoint)) {
                // remove highlight of previous hovered point:
                if ($scope.lastHoveredXPoint !== $scope.lastClickedXPoint) {
                    var selector = 'nv-point-' + $scope.lastHoveredXPoint;
                    var x = document.getElementsByClassName(selector);
                    if (x["0"]) {
                        x["0"].style["fillOpacity"] = "0";
                        x["0"].style["strokeOpacity"] = "0";
                        x["0"].style["stroke"] = "#1A80C1";
                    }
                }

                // highlight the point in the chart:
                var selector = 'nv-point-' + $scope.hoveredXPoint;
                var x = document.getElementsByClassName(selector);
                if (x["0"]) {
                    x["0"].style["fillOpacity"] = "1";
                    x["0"].style["strokeWidth"] = "7px";
                    x["0"].style["strokeOpacity"] = "1";
                    x["0"].style["stroke"] = "#1A80C1";
                }
                $scope.lastHoveredXPoint = $scope.hoveredXPoint;
            }
        };

        $scope.showHoveredX = function () {
            // get the lat/lng coordinates:
            if ($scope.hoveredXPoint > 0) {
                var lat_coord = data_global.data.features[$scope.hoveredXPoint].geometry.coordinates[1];
                var lon_coord = data_global.data.features[$scope.hoveredXPoint].geometry.coordinates[0];

                $scope.markers.HoveredPosition = {
                    lat: lat_coord,
                    lng: lon_coord,
                    focus: false,
                    icon: $scope.markerBlue
                };
            }
            $timeout(function () {
                window.dispatchEvent(new Event('resize'))
            },
                    1);
        };

        $scope.showMeasurementXInChart = function () {
            // remove highlight of previous clicked point:
            if ($scope.lastClickedXPoint) {
                var selector = 'nv-point-' + $scope.lastClickedXPoint;
                var x = document.getElementsByClassName(selector);
                if (x["0"]) {
                    x["0"].style["fillOpacity"] = "0";
                    x["0"].style["strokeOpacity"] = "0";
                    x["0"].style["stroke"] = "#1A80C1";
                }
            }

            // highlight the point in the chart:
            var selector = 'nv-point-' + $scope.clickedXPoint;
            if ($scope.segmentActivated)
                selector = 'nv-point-' + $scope.clickedXPoint;
            var x = document.getElementsByClassName(selector);
            if (x["0"]) {
                x["0"].style["fillOpacity"] = "1";
                x["0"].style["strokeWidth"] = "7px";
                x["0"].style["strokeOpacity"] = "1";
                x["0"].style["stroke"] = "#8CBF3F";
            }
            $scope.lastClickedXPoint = $scope.clickedXPoint;
        };
        
        $scope.lastHoveredXPoint = undefined;

        $scope.removeHoveredPointInChart = function () {
            var selector = 'nv-point-' + $scope.lastHoveredXPoint;
            var x = document.getElementsByClassName(selector);
            if (x["0"]) {
                x["0"].style["fillOpacity"] = "0";
                x["0"].style["strokeOpacity"] = "0";
                x["0"].style["stroke"] = "#1A80C1";
            }
        };

        $scope.showMeasurementX = function () {
            // get the lat/lng coordinates:
            if ($scope.clickedXPoint > 0) {
                $scope.markers.ClickedPosition.lat = data_global.data.features[$scope.clickedXPoint].geometry.coordinates[1];
                $scope.markers.ClickedPosition.lng = data_global.data.features[$scope.clickedXPoint].geometry.coordinates[0];
            }
            $timeout(function () {
                window.dispatchEvent(new Event('resize'))
            },
                    1);
        };

        var data_global = {};
        TrackService.getTrack($scope.trackid).then(
                function (data) {
                    data_global = data;
                    $scope.name = data.data.properties.name;
                    $scope.created = data.data.properties.created;

                    var speedMeasurement;
                    var consumptionMeasurement;
                    var co2Measurement;
                    var rpmMeasurement;
                    var engineLoadMeasurement;
                    var gpsSpeedMeasurement;
                    var minimumAccelerationMeasurement;
                    var maximumAccelerationMeasurement;
                    // iterating through each measurement:
                    for (var index = 0; index < data_global.data.features.length; index++) {

                        // save measurements for each phenomenon:
                        if (data_global.data.features[index].properties.phenomenons.Speed)
                            speedMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Speed.value};
                        else
                            speedMeasurement = {x: index, y: undefined};

                        if (data_global.data.features[index].properties.phenomenons.Consumption)
                            consumptionMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Consumption.value};
                        else
                            consumptionMeasurement = {x: index, y: undefined};

                        if (data_global.data.features[index].properties.phenomenons.CO2)
                            co2Measurement = {x: index, y: data_global.data.features[index].properties.phenomenons.CO2.value};
                        else
                            co2Measurement = {x: index, y: undefined};

                        if (data_global.data.features[index].properties.phenomenons.Rpm)
                            rpmMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Rpm.value};
                        else
                            rpmMeasurement = {x: index, y: undefined};

                        if (data_global.data.features[index].properties.phenomenons['Engine Load'])
                            engineLoadMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons['Engine Load'].value};
                        else
                            engineLoadMeasurement = {x: index, y: undefined};
                        
                        if (data_global.data.features[index].properties.phenomenons['GPS Speed'])
                            gpsSpeedMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons['GPS Speed'].value};
                        else
                            gpsSpeedMeasurement = {x: index, y: undefined};

                        if (data_global.data.features[index].properties.phenomenons['Minimum Acceleration'])
                            minimumAccelerationMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons['Minimum Acceleration'].value};
                        else
                        minimumAccelerationMeasurement = {x: index, y: undefined};

                        if (data_global.data.features[index].properties.phenomenons['Maximum Acceleration'])
                            maximumAccelerationMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons['Maximum Acceleration'].value};
                        else
                        maximumAccelerationMeasurement = {x: index, y: undefined};

                        // save all data:
                        $scope.data_all[0].values.push(speedMeasurement);
                        $scope.data_all[1].values.push(consumptionMeasurement);
                        $scope.data_all[2].values.push(co2Measurement);
                        $scope.data_all[3].values.push(rpmMeasurement);
                        $scope.data_all[4].values.push(engineLoadMeasurement);
                        $scope.data_all[5].values.push(gpsSpeedMeasurement);
                        $scope.data_all[6].values.push(minimumAccelerationMeasurement);
                        $scope.data_all[7].values.push(maximumAccelerationMeasurement);
                    }


                    var phenom = PhenomenonService.getPhenomenon();
                    $scope.currentPhenomenon = phenom.name;
                    $scope.currentPhenomenonIndex = phenom.index;
                    // save 'speed'-data as default into time series chart 
                    $scope.dataTrackChart[0] = $scope.data_all[$scope.currentPhenomenonIndex];

                    $scope.onload_track_map = true;
                    // Track Chart:
                    $scope.onload_track_chart = true;
                    $timeout(function () {
                        window.dispatchEvent(new Event('resize'));
                    },
                            200);
                    $timeout(function () {
                        window.dispatchEvent(new Event('resize'));
                    },
                            500);
                }, function (error) {
            console.log(error);
        }
        );

        $timeout(function () {
            window.dispatchEvent(new Event('resize'));
        },
                200);
        $timeout(function () {
            window.dispatchEvent(new Event('resize'));
        },
                500);
    }
    ;

    angular.module('enviroCar')
            .controller('LineChartWithoutFocusCtrl', LineChartWithoutFocusCtrl);
})();
