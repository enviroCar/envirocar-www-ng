(function () {
    'use strict';

    function LineChartWithoutFocusCtrl(
            $scope,
            $stateParams,
            $timeout,
            TrackService,
            UserCredentialsService) {
        console.log("LineChartWithoutFocusCtrl started.");
        $scope.trackid = $stateParams.trackid;
        $scope.onload_track_chart = false;
        $scope.currentPhenomenon = 'Speed';

        $scope.$on('track-toolbar:phenomenon-changed', function (event, args) {
            console.log("phenomenon changed received.");
            $scope.currentPhenomenon = args;
            console.log($scope.currentPhenomenon);
            console.log($scope.dataTrackChart);
            switch ($scope.currentPhenomenon) {
                case 'Speed':
                    $scope.dataTrackChart[0] = $scope.data_all[0];
                    $scope.paths = $scope.paths_all[0];
                    break;
                case 'Consumption':
                    $scope.dataTrackChart[0] = $scope.data_all[1];
                    $scope.paths = $scope.paths_all[1];
                    break;
                case 'CO2':
                    $scope.paths = $scope.paths_all[2];
                    $scope.dataTrackChart[0] = $scope.data_all[2];
                    break;
                case 'RPM':
                    $scope.dataTrackChart[0] = $scope.data_all[3];
                    $scope.paths = $scope.paths_all[3];
                    break;
                case 'Engine Load':
                    $scope.dataTrackChart[0] = $scope.data_all[4];
                    $scope.paths = $scope.paths_all[4];
                    break;
            }
            console.log($scope.dataTrackChart);
        });

        // chart options for the nvd3 line with focus chart:
        $scope.clickedXPoint = 0;
        $scope.hoveredXPoint = 0;

        $scope.optionsTrackChart = {
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
                    axisLabel: 'X Axis',
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
                        }
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
                key: 'RPM',
                values: [
                ]
            },
            {
                key: 'Engine Load',
                values: [
                ]
            }
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
                    // iterating through each measurement:
                    for (var index = 1; index < data_global.data.features.length; index++) {
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

    angular.module('enviroCar')
            .controller('LineChartWithoutFocusCtrl', LineChartWithoutFocusCtrl);
})();
