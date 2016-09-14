(function () {

    function ChartCtrl(
            $rootScope,
            $scope,
            $stateParams,
            $timeout,
            $translate,
            TrackService,
            UserCredentialsService,
            leafletBoundsHelpers) {
        console.log("ChartCtrl started.");
        var grey = '#737373';
        $scope.track_toolbar_fixed = false;
        $scope.slider = {
            minValue: 0,
            maxValue: 100,
            options: {
                floor: 0,
                ceil: 100,
                step: 1,
                draggableRange: true,
                getSelectionBarColor: function (value) {
                    return '#8cbf3f';
                },
                getPointerColor: function (value) {
                    return '#8cbf3f';
                },
                translate: function (value) {
                    return '<font color="white">' + value + '</font>';
                },
                id: 'slider1',
                onChange: function (id) {
                    $scope.changeSelectionRange($scope.slider.minValue, $scope.slider.maxValue);
                },
                onEnd: function (id) {
                    $scope.changeChartRange($scope.slider.minValue, $scope.slider.maxValue);
                    $rootScope.$broadcast('single_track_page:segment-changed', {'min': $scope.slider.minValue, 'max': $scope.slider.maxValue});
                }
            }
        };
        var max_values = [
            130, // speed
            10, // consumption
            20, // co2
            3000, // rpm
            100     // engine load
        ];
        // on Range selection change:
        $scope.changeSelectionRange = function (start, end) {
            console.log(start + " , " + end);
            if (start === 0)
                start = 1;
            // grey-coloring the offranged part of the track:
            var max_value = max_values[$scope.currentPhenomenonIndex];
            for (var index = 1; index < start; index++) {
                $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color'] = grey;
            }
            for (var index = start; index < end; index++) {
                var value = data_global.data.features[index].properties.phenomenons[$scope.currentPhenomenon].value;
                $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color'] = $scope.percentToRGB(100 * value / max_value);
            }
            var track_length = data_global.data.features.length - 1;
            console.log(track_length);
            for (var index = end; index <= track_length; index++) {
                $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color'] = grey;
            }
        };
        $scope.changeChartRange = function (start, end) {
            // 1. redraw der neuen chart data:
            console.log($scope.data_all);
            console.log(start + " , " + end);
            var temp_data_array = [
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
            for (var phenomIndex = 0; phenomIndex < 5; phenomIndex++) {
                for (var index = 0; index < $scope.data_all[phenomIndex].values.length; index++) {
                    temp_data_array[phenomIndex].values[index] = $scope.data_all[phenomIndex].values[index];
                }
            }
            for (var index = 0; index < 5; index++) {
                temp_data_array[index].values = temp_data_array[index].values.slice(start, start + (end - start)-1);
            }

            $scope.dataTrackChart[0] = temp_data_array[$scope.currentPhenomenonIndex];
            console.log($scope.dataTrackChart);
        };
        
        // Scroll-fixing the single track analysis toolbar:
        $(window).scroll(function () {
            if ($(window).scrollTop() > 300) {
                $('#track_toolbar').addClass('stuck_top');
                $scope.track_toolbar_fixed = true;
            } else {
                $('#track_toolbar').removeClass('stuck_top');
                $scope.track_toolbar_fixed = false;
            }
        });
        $scope.trackid = $stateParams.trackid;
        $scope.onload_track_map = false;
        $scope.onload_track_chart = false;
        $scope.segmentActivated = false;
        $scope.currentPhenomenon = 'Speed';
        $scope.currentPhenomenonIndex = 0;
        // 0% - green; 50% - yellow; 100% - red; above 100% --> dark red
        $scope.percentToRGB = function (percent) {
            var r, g;
            if (percent > 100) {
                r = Math.floor(255 * ((54 - percent % 54) / 54));
                g = 0;
            } else {
                if (percent < 50) {
                    r = Math.floor(255 * (percent / 50));
                    g = 255;
                } else {
                    if (percent > 99)
                        percent = 99;
                    r = 255;
                    g = Math.floor(255 * ((50 - percent % 50) / 50));
                }
            }
            return "rgb(" + r + "," + g + ",0)";
        };
        // scope: predefined legends:
        legend_all = [
            {
                // Speed:
                position: 'bottomright',
                colors: ['#00ff00',
                    $scope.percentToRGB(30 / 130 * 100),
                    $scope.percentToRGB(60 / 130 * 100),
                    $scope.percentToRGB(100 / 130 * 100),
                    $scope.percentToRGB(130 / 130 * 100),
                    $scope.percentToRGB(180 / 130 * 100)],
                labels: ['  0 km/h', ' 30 km/h', ' 60 km/h', '100 km/h', '130 km/h', '180 km/h']
            }, {
                // Consumption:
                position: 'bottomright',
                colors: ['#00ff00',
                    $scope.percentToRGB(3 / 10 * 100),
                    $scope.percentToRGB(6 / 10 * 100),
                    $scope.percentToRGB(9 / 10 * 100),
                    $scope.percentToRGB(12 / 10 * 100),
                    $scope.percentToRGB(14 / 10 * 100)],
                labels: [' 0 l/h', ' 3 l/h', ' 6 l/h', ' 9 l/h', '12 l/h', '14 l/h']
            }, {
                // CO2:
                position: 'bottomright',
                colors: ['#00ff00',
                    $scope.percentToRGB(5 / 20 * 100),
                    $scope.percentToRGB(10 / 20 * 100),
                    $scope.percentToRGB(15 / 20 * 100),
                    $scope.percentToRGB(20 / 20 * 100),
                    $scope.percentToRGB(30 / 20 * 100)],
                labels: [' 0 kg/h', ' 5 kg/h', '10 kg/h', '15 kg/h', '20 kg/h', '30 kg/h']
            }, {
                // RPM:
                position: 'bottomright',
                colors: ['#00ff00',
                    $scope.percentToRGB(1000 / 2500 * 100),
                    $scope.percentToRGB(1500 / 2500 * 100),
                    $scope.percentToRGB(2000 / 2500 * 100),
                    $scope.percentToRGB(2500 / 2500 * 100),
                    $scope.percentToRGB(4000 / 2500 * 100)],
                labels: ['   0 r/min', '1000 r/min', '1500 r/min', '2000 r/min', '2500 r/min', '4000 r/min']
            }, {
                // Engine Load:
                position: 'bottomright',
                colors: ['#00ff00',
                    $scope.percentToRGB(15 / 100 * 100),
                    $scope.percentToRGB(35 / 100 * 100),
                    $scope.percentToRGB(55 / 100 * 100),
                    $scope.percentToRGB(75 / 100 * 100),
                    $scope.percentToRGB(100 / 100 * 100)],
                labels: ['  0 %', ' 15 %', ' 35 %', '55 %', '75 %', '100%']
            }
        ];
        // scope extension for the leaflet map:
        angular.extend($scope, {
            paths: {},
            bounds: {},
            markers: {
                ClickedPosition: {
                },
                HoveredPosition: {
                }
            },
            layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                    }
                }
            },
            legend: {
                position: 'bottomright',
                colors: ['#00ff00', $scope.percentToRGB(30 / 130 * 100)//'#75ff00'
                            , '#ecff00', '#ff7500', '#ff0000', '#6f0000'],
                labels: ['  0 km/h', ' 30 km/h', ' 60 km/h', '100 km/h', '130 km/h', '180 km/h']
            },
            events: {
                paths: {
                    enable: ['click'],
                    logic: 'emit'
                }
            }
        });
        $scope.$on('leafletDirectivePath.click', function (event, path) {
            //path.modelname
            $scope.clickedXPoint = parseInt(path.modelName.substring(1));
            $scope.showMeasurementX();
        });
        $scope.$on('track-toolbar:phenomenon-changed', function (event, args) {
            console.log("phenomenon changed received.");
            $scope.currentPhenomenon = args;
            console.log($scope.currentPhenomenon);
            console.log($scope.dataTrackChart);
            switch ($scope.currentPhenomenon) {
                case 'Speed':
                    $scope.dataTrackChart[0] = $scope.data_all[0];
                    $scope.paths = $scope.paths_all[0];
                    $scope.legend = legend_all[0];
                    $scope.currentPhenomenonIndex = 0;
                    break;
                case 'Consumption':
                    $scope.dataTrackChart[0] = $scope.data_all[1];
                    $scope.paths = $scope.paths_all[1];
                    $scope.legend = legend_all[1];
                    $scope.currentPhenomenonIndex = 1;
                    break;
                case 'CO2':
                    $scope.paths = $scope.paths_all[2];
                    $scope.dataTrackChart[0] = $scope.data_all[2];
                    $scope.legend = legend_all[2];
                    $scope.currentPhenomenonIndex = 2;
                    break;
                case 'Rpm':
                    $scope.dataTrackChart[0] = $scope.data_all[3];
                    $scope.paths = $scope.paths_all[3];
                    $scope.legend = legend_all[3];
                    $scope.currentPhenomenonIndex = 3;
                    break;
                case 'Engine Load':
                    $scope.dataTrackChart[0] = $scope.data_all[4];
                    $scope.paths = $scope.paths_all[4];
                    $scope.legend = legend_all[4];
                    $scope.currentPhenomenonIndex = 4;
                    break;
            }
            if ($scope.segmentActivated) {
                $scope.changeSelectionRange($scope.slider.minValue, $scope.slider.maxValue);
                $scope.changeChartRange($scope.slider.minValue, $scope.slider.maxValue);
            } else {
                $scope.changeSelectionRange(0, $scope.slider.options.ceil);
                $scope.changeChartRange(0, $scope.slider.options.ceil);
            }
        });
        // chart options for the nvd3 line with focus chart:
        $scope.clickedXPoint = 0;
        $scope.hoveredXPoint = 0;
        $scope.optionsTrackChart = {
            chart: {
                type: 'lineWithFocusChart',
                height: 480,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 40
                },
                useInteractiveGuideline: true,
                duration: 50,
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function (d) {
                        return d3.format(',f')(d);
                    }
                },
                x2Axis: {
                    tickFormat: function (d) {
                        return d3.format(',f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function (d) {
                        return d3.format(',.2f')(d);
                    },
                    rotateYLabel: false
                },
                y2Axis: {
                    tickFormat: function (d) {
                        return d3.format(',.2f')(d);
                    }
                },
                interactiveLayer: {
                    dispatch: {
                        elementClick: function (e) {
                            $scope.clickedXPoint = Math.round(e.pointXValue);
                            $scope.showMeasurementX();
                        },
                        elementMousemove: function (e) {
                            if ($scope.hoveredXPoint !== Math.round(e.pointXValue)) {
                                $scope.hoveredXPoint = Math.round(e.pointXValue);
                                $scope.showHoveredX();
                            }
                        },
                        elementMouseout: function (e) {
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
        // toggle Segment analysis:
        $scope.toggleSegmentAnalysis = function () {
            $scope.segmentActivated = !$scope.segmentActivated;
            if ($scope.segmentActivated) {
                $scope.changeSelectionRange($scope.slider.minValue, $scope.slider.maxValue);
                $scope.changeChartRange($scope.slider.minValue, $scope.slider.maxValue);
            } else {
                $scope.changeSelectionRange(0, $scope.slider.options.ceil);
                $scope.changeChartRange(0, $scope.slider.options.ceil);
            }
            $rootScope.$broadcast('single_track_page:segment-activated', $scope.segmentActivated);
                    
            $timeout(function () {
                window.dispatchEvent(new Event('resize'));
            },
                    50);
            $timeout(function () {
                window.dispatchEvent(new Event('resize'));
            },
                    100);
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
        $scope.paths_all = [
            {p1: 0},
            {p1: 0},
            {p1: 0},
            {p1: 0},
            {p1: 0}
        ];
        // Chart data setup for Track Chart:
        $scope.dataTrackChart = [
            {
                key: 'Speed',
                values: [
                ]
            }
        ];
        $scope.removeCurrentPositionMarker = function () {
            $scope.markers.ClickedPosition = {
                'lat': -1000,
                'lng': -1000,
                focus: false,
                message: ""
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
                message: ""
            };
            $timeout(function () {
                window.dispatchEvent(new Event('resize'))
            },
                    1);
        };
        $scope.showHoveredX = function () {
            // get the lat/lng coordinates:
            if ($scope.hoveredXPoint > 0) {
                var lat_coord = data_global.data.features[$scope.hoveredXPoint].geometry.coordinates[1];
                var lon_coord = data_global.data.features[$scope.hoveredXPoint].geometry.coordinates[0];
                $scope.markers.HoveredPosition = {
                    lat: lat_coord,
                    lng: lon_coord,
                    focus: true
                }
            }
            $timeout(function () {
                window.dispatchEvent(new Event('resize'))
            },
                    1);
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
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;
        TrackService.getTrack($scope.username, $scope.password, $scope.trackid).then(
                function (data) {
                    console.log(data);
                    data_global = data;
                    // set slider ranges:
                    $scope.slider.maxValue = data_global.data.features.length;
                    $scope.slider.options.ceil = data_global.data.features.length;
                    // ask for each phenom, if track contains it's data:
                    var phenomsJSON = {};
                    if (data_global.data.features[0].properties.phenomenons['Speed'])
                        phenomsJSON['Speed'] = true;
                    if (data_global.data.features[0].properties.phenomenons['Consumption'])
                        phenomsJSON['Consumption'] = true;
                    if (data_global.data.features[0].properties.phenomenons['CO2'])
                        phenomsJSON['CO2'] = true;
                    if (data_global.data.features[0].properties.phenomenons['Rpm'])
                        phenomsJSON['Rpm'] = true;
                    if (data_global.data.features[0].properties.phenomenons['Engine Load'])
                        phenomsJSON['Engine Load'] = true;
                    $rootScope.$broadcast('single_track_page:phenomenons-available', phenomsJSON);
                    $scope.name = data.data.properties.name;
                    $scope.created = data.data.properties.created;
                    // max bounds of the track:
                    var northeast = {
                        'lat': -1000,
                        'lng': 1000
                    };
                    var southwest = {
                        'lat': 1000,
                        'lng': -1000
                    };
                    // iterating through each measurement:
                    for (var index = 1; index < data_global.data.features.length; index++) {
                        var pathObjSpeed = {};
                        var pathObjConsumption = {};
                        var pathObjCO2 = {};
                        var pathObjRPM = {};
                        var pathObjEngine_load = {};
                        // get coords:
                        var lat_coord = data_global.data.features[index].geometry.coordinates[1];
                        var lon_coord = data_global.data.features[index].geometry.coordinates[0];
                        if (northeast.lat < lat_coord)
                            northeast.lat = lat_coord;
                        if (northeast.lng > lon_coord)
                            northeast.lng = lon_coord;
                        if (southwest.lat > lat_coord)
                            southwest.lat = lat_coord;
                        if (southwest.lng < lon_coord)
                            southwest.lng = lon_coord;
                        // path width:
                        pathObjSpeed['weight'] = 8;
                        pathObjConsumption['weight'] = 8;
                        pathObjCO2['weight'] = 8;
                        pathObjRPM['weight'] = 8;
                        pathObjEngine_load['weight'] = 8;
                        // path coordinates:
                        pathObjSpeed['latlngs'] = [{
                                'lat': data_global.data.features[index - 1].geometry.coordinates[1],
                                'lng': data_global.data.features[index - 1].geometry.coordinates[0]
                            }, {
                                'lat': lat_coord,
                                'lng': lon_coord
                            }];
                        pathObjConsumption['latlngs'] = pathObjSpeed['latlngs'];
                        pathObjCO2['latlngs'] = pathObjSpeed['latlngs'];
                        pathObjRPM['latlngs'] = pathObjSpeed['latlngs'];
                        pathObjEngine_load['latlngs'] = pathObjSpeed['latlngs'];
                        // get the phenomenon's value and interpolate a color value from it:
                        if (data_global.data.features[index].properties.phenomenons.Speed)
                            var value_speed = data_global.data.features[index].properties.phenomenons.Speed.value;
                        if (data_global.data.features[index].properties.phenomenons.Consumption)
                            var value_consumption = data_global.data.features[index].properties.phenomenons.Consumption.value;
                        if (data_global.data.features[index].properties.phenomenons.CO2)
                            var value_CO2 = data_global.data.features[index].properties.phenomenons.CO2.value;
                        if (data_global.data.features[index].properties.phenomenons.Rpm.value)
                            var value_RPM = data_global.data.features[index].properties.phenomenons.Rpm.value;
                        if (data_global.data.features[index].properties.phenomenons["Engine Load"].value)
                            var value_EngineLoad = data_global.data.features[index].properties.phenomenons["Engine Load"].value;
                        // interpolate color:
                        pathObjSpeed['color'] = $scope.percentToRGB(100 * value_speed / max_values[0]); // 130km/h = 100%; more information at percentToRGB().
                        pathObjConsumption['color'] = $scope.percentToRGB(100 * value_consumption / max_values[1]); // 130km/h = 100%; more information at percentToRGB().
                        pathObjCO2['color'] = $scope.percentToRGB(100 * value_CO2 / max_values[2]); // 130km/h = 100%; more information at percentToRGB().
                        pathObjRPM['color'] = $scope.percentToRGB(100 * value_RPM / max_values[3]); // 130km/h = 100%; more information at percentToRGB().
                        pathObjEngine_load['color'] = $scope.percentToRGB(100 * value_EngineLoad / max_values[4]); // 130km/h = 100%; more information at percentToRGB().

                        // enqueue pathObjects for each phenomenon to phenomPath:
                        $scope.paths_all[0]['p' + (index)] = pathObjSpeed;
                        $scope.paths_all[1]['p' + (index)] = pathObjConsumption;
                        $scope.paths_all[2]['p' + (index)] = pathObjCO2;
                        $scope.paths_all[3]['p' + (index)] = pathObjRPM;
                        $scope.paths_all[4]['p' + (index)] = pathObjEngine_load;
                        // add 'speed'-path as default overlay to leaflet map:
                        $scope.paths['p' + (index)] = pathObjSpeed;
                        // save measurements for each phenomenon:
                        var speedMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Speed.value};
                        if (data_global.data.features[index].properties.phenomenons.Consumption)
                            var consumptionMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Consumption.value};
                        if (data_global.data.features[index].properties.phenomenons.CO2)
                            var co2Measurement = {x: index, y: data_global.data.features[index].properties.phenomenons.CO2.value};
                        var rpmMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Rpm.value};
                        var engineLoadMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons['Engine Load'].value};
                        // save all data:
                        $scope.data_all[0].values.push(speedMeasurement);
                        $scope.data_all[1].values.push(consumptionMeasurement);
                        $scope.data_all[2].values.push(co2Measurement);
                        $scope.data_all[3].values.push(rpmMeasurement);
                        $scope.data_all[4].values.push(engineLoadMeasurement);
                    }

                    // save 'speed'-data as default into time series chart 
                    $scope.dataTrackChart[0] = $scope.data_all[0];
                    console.log($scope.data_all);
                    // zoom map to track:
                    $scope.bounds = leafletBoundsHelpers.createBoundsFromArray([
                        [northeast.lat, northeast.lng],
                        [southwest.lat, southwest.lng]
                    ]);
                    $scope.onload_track_map = true;
                    // Track Chart:
                    $scope.onload_track_chart = true;
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
            window.dispatchEvent(new Event('resize'))
        },
                200);
        $timeout(function () {
            window.dispatchEvent(new Event('resize'))
        },
                500);
    }
    ;
    angular.module('enviroCar.track')
            .controller('ChartCtrl', ChartCtrl);
})();