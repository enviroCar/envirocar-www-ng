(function () {

    function ChartCtrl($scope,
            $stateParams,
            $timeout,
            TrackService,
            UserCredentialsService,
            leafletBoundsHelpers) {
        console.log("ChartCtrl started.");
        $scope.trackid = $stateParams.trackid;
        $scope.onload_track_map = false;
        $scope.onload_track_chart = false;
        $scope.segmentActivated = false;
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
                colors: ['#00ff00', '#75ff00', '#ecff00', '#ff7500', '#ff0000', '#6f0000'],
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
            console.log(event);
            console.log(path);
            //path.modelname
            $scope.clickedXPoint = parseInt(path.modelName.substring(1));
            $scope.showMeasurementX();
        });

        // chart options for the nvd3 line with focus chart:
        $scope.clickedXPoint = 0;
        $scope.hoveredXPoint = 0;

        $scope.optionsTrackChart = {
            chart: {
                type: 'lineWithFocusChart',
                callback: function (chart) {
                    chart.dispatch.on('Brush', function (brushExtent) {
                        console.log(brushExtent);
                        /* brushExtent is an array with start and finish x coordinates of the focus */
                    });
                },
                dispatch: {
                    renderEnd: function (e) {
                        console.log('renderEnd');
                        console.log(e);
                    }, stateChange: function (e) {
                        console.log('stateChange');
                        console.log(e);
                    },
                    changeState: function (e) {
                        console.log('changeState');
                        console.log(e);
                    }
                },
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
                console.log($scope.segmentActivated);
            } else {
                console.log($scope.segmentActivated);
            }
            $timeout(function () {
                window.dispatchEvent(new Event('resize'))
            },
                    50);
            $timeout(function () {
                window.dispatchEvent(new Event('resize'))
            },
                    100);
        };


        // Chart data setup for Track Chart:
        $scope.dataTrackChart = [
            {
                key: 'Speed',
                values: [
                ]
            }
        ];
        // 0% - green; 50% - yellow; 100% - red; above 100% --> dark red
        $scope.percentToRGB = function (percent) {
            var r, g;
            if (percent >= 100) {
                r = Math.floor(255 * ((54 - percent % 54) / 54));
                g = 0;
            } else {
                if (percent < 50) {
                    r = Math.floor(255 * (percent / 50));
                    g = 255;
                } else {
                    r = 255;
                    g = Math.floor(255 * ((50 - percent % 50) / 50));
                }
            }
            return "rgb(" + r + "," + g + ",0)";
        };

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
                    focus: false
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
                        var pathObj = {};
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
                        pathObj['weight'] = 8;
                        pathObj['latlngs'] = [{
                                'lat': data_global.data.features[index - 1].geometry.coordinates[1],
                                'lng': data_global.data.features[index - 1].geometry.coordinates[0]
                            }, {
                                'lat': lat_coord,
                                'lng': lon_coord
                            }];
                        // get the phenomenon's value and interpolate a color value from it:
                        var value_speed = data_global.data.features[index].properties.phenomenons.Speed.value;
                        // interpolate color:
                        pathObj['color'] = $scope.percentToRGB(100 * value_speed / 130); // 130km/h = 100%; more information at percentToRGB().
                        $scope.paths['p' + (index)] = pathObj;
                        var speedMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Speed.value};
                        $scope.dataTrackChart[0].values.push(speedMeasurement);
                    }
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