(function () {
    'use strict';
    function TrackSummaryCtrl(
            $scope,
            $stateParams,
            TrackService) {
        "ngInject";

        $scope.onload_summary = false;
        $scope.consumption_available = false;
        $scope.co2_available = false;
        $scope.trackid = $stateParams.trackid;
        var distance = 0;
        var vehiclemodel;
        var vehicletype;
        var vehiclemanufacturer;
        var starttimeg;
        var endtimeg;
        var date_hh_mm_ss;
        var stops = 0;
        $scope.track_summary_track_length = 0;
        $scope.data_track = [
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
                key: 'Timestamp',
                values: [
                ]
            },
            {
                key: 'Lat',
                values: [
                ]
            },
            {
                key: 'Lng',
                values: [
                ]
            },
            {
                key: 'Speed',
                values: [
                ]
            },
        ];

        // Calculates the distance between 2 points considering the curvature of the earth
        $scope.distancecalculator = function (lat1, lon1, lat2, lon2) {
            var p = 0.017453292519943295; // Math.PI / 180
            var c = Math.cos;
            var a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;
            return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
        };

        $scope.changeSummaryRange = function (min, max) {
            // fill data with each measurement point:
            // calculating stuff:
            var sums = {
                distance: 0,
                fuel: 0,
                co2: 0,
                speed: 0
            };
            for (var i = min + 1; i <= max+1; i++) {
                // calculating distance:
                var lat_now = $scope.data_track[3].values[i];
                var lng_now = $scope.data_track[4].values[i];
                var lat_past = $scope.data_track[3].values[i - 1];
                var lng_past = $scope.data_track[4].values[i - 1];
                var distance_i = $scope.distancecalculator(lng_now, lat_now, lng_past, lat_past);
                sums.distance += distance_i;

                // calculating fuel consumption:
                var fuel_now = $scope.data_track[0].values[i - 1];
                sums.fuel += fuel_now;

                // calculating co2 emission:
                var co2_now = $scope.data_track[1].values[i - 1];
                sums.co2 += co2_now;

                // calculating speed:
                var speed_now = $scope.data_track[5].values[i - 1];
                sums.speed += speed_now;
            }
            // calculating fuel consumption:
            var fuel_now = $scope.data_track[0].values[max - 1];
            sums.fuel += fuel_now;

            // calculating co2 emission:
            var co2_now = $scope.data_track[1].values[max - 1];
            sums.co2 += co2_now;

            // calculating speed:
            var speed_now = $scope.data_track[5].values[max - 1];
            sums.speed += speed_now;

            distance = sums.distance;

            // get timestamps:
            var time1 = $scope.data_track[2].values[min];
            var time2 = $scope.data_track[2].values[max+1];
            var seconds_passed = new Date(time2).getTime() -
                    new Date(time1).getTime();
            var seconds = seconds_passed / 1000;
            // time of travel is in minutes
            // convert to the right format. of hh:mm:ss;
            var date_for_seconds = new Date(null);
            date_for_seconds.setSeconds(seconds);
            date_hh_mm_ss = date_for_seconds.toISOString().substr(
                    11, 8);
            starttimeg = time1;
            endtimeg = time2;

            // fuel_avg:
            var fuel_avg = sums.fuel / (max - min);
            // fuel_avg*delta time:
            var fuelPerTime = fuel_avg * (seconds_passed / (1000 * 60 * 60));
            // 100* fuelPerTime / delta distance:
            var fuelSum = 100 * fuelPerTime / distance; // (liter/100km)

            // co2_avg:
            var co2_avg = sums.co2 / (max - min);
            // co2_avg*delta time:
            var co2PerTime = co2_avg * (seconds_passed / (1000 * 60 * 60));
            // 100* co2PerTime / delta distance:
            var co2kgH = 100 * co2PerTime / distance; // (kg/t_gesamt)

            // fuelSum * distance:
            var fuelSumConsumed = fuelSum * distance / 100;
            // co2PerTime * delta time:
            var co2kgHConsumed = co2kgH * distance / 100; // (kg/h)

            // interprete and count stop-n-go's:
            stops = 0;
            var stopping = false;
            for (var index = min; index < max; index++) {
                var speedValue = $scope.data_track[5].values[index];
                if (stopping) {
                    if (speedValue > 0) {
                        stopping = false;
                        stops++;
                    }
                } else {
                    if (speedValue === 0) {
                        stopping = true;
                    }
                }
            }

            // interprete and count stop-n-go's (3 measurements in a row; all <= 5km/h):
            var stops2 = 0;
            var stopping2 = 0;
            for (var index = min; index < max; index++) {
                var speedValue = $scope.data_track[5].values[index];
                if (stopping2 > 0) {
                    if (speedValue > 5) {
                        stopping2 = 0;
                    } else {
                        stopping2++;
                        if (stopping2 === 3) {
                            stops2++;
                        }
                    }
                } else {
                    if (speedValue <= 5) {
                        stopping2++;
                    }
                }
            }

            $scope.tracksummary = {
                distance: distance.toFixed(2),
                vehiclemodel: vehiclemodel,
                vehicletype: vehicletype,
                vehiclemanufacturer: vehiclemanufacturer,
                unitsspeed: 'km/h',
                timeoftravel: date_hh_mm_ss,
                unitsofdistance: "km",
                unitsoftime: "Minutes",
                fuel: fuelSum.toFixed(2),
                fuelConsumed: fuelSumConsumed.toFixed(2),
                co2emissionperhour: co2kgH.toFixed(2),
                co2emissionperhourConsumed: co2kgHConsumed.toFixed(2),
                starttime: new Date(starttimeg).toLocaleString(),
                endtime: new Date(endtimeg).toLocaleString(),
                stops: stops //+ " " + stops2
            };

            if (!isNaN(fuelSum)) {
                $scope.consumption_available = true;
            } else {
                $scope.consumption_available = false;
            }

            if (!isNaN(co2kgH)) {
                $scope.co2_available = true;
            } else {
                $scope.co2_available = false;
            }
        };

        $scope.$on('single_track_page:segment-changed', function (event, args) {
            $scope.track_summary_startIndex = args.min;
            $scope.track_summary_endIndex = args.max;
            $scope.changeSummaryRange($scope.track_summary_startIndex, $scope.track_summary_endIndex - 1);
        });

        $scope.$on('single_track_page:segment-activated', function (event, args) {
            if (args) {
                if (!$scope.track_summary_startIndex)
                    $scope.track_summary_startIndex = 0;
                if (!$scope.track_summary_endIndex)
                    $scope.track_summary_endIndex = $scope.track_summary_track_length;
                $scope.changeSummaryRange($scope.track_summary_startIndex, $scope.track_summary_endIndex - 1);
            } else {
                $scope.changeSummaryRange(0, $scope.track_summary_track_length-1);
            }
        });

        TrackService.getTrack($scope.trackid).then(
                function (data) {
                    var data_global = data;
                    var track_data = data.data;
                    // car data:
                    var sensorProperties = track_data.properties.sensor.properties;
                    vehiclemodel = sensorProperties.model;
                    vehiclemanufacturer = sensorProperties.manufacturer;
                    vehicletype = sensorProperties.fuelType;
                    var phenomsJSON = {};
                    if (data_global.data.features[0].properties.phenomenons['Consumption'])
                        phenomsJSON['Consumption'] = true;
                    if (data_global.data.features[0].properties.phenomenons['CO2'])
                        phenomsJSON['CO2'] = true;
                    $scope.track_summary_track_length = data_global.data.features.length - 1;
                    // fill data with each measurement point:
                    for (var i = 0; i <= $scope.track_summary_track_length; i++) {
                        // get consumption data:
                        if (data_global.data.features[i].properties.phenomenons.Consumption) {
                            var consumptionMeasurement = data_global.data.features[i].properties.phenomenons.Consumption.value;
                            $scope.data_track[0].values.push(consumptionMeasurement);
                        } else {
                            $scope.data_track[0].values.push(undefined);
                        }
                        // get CO2 data:
                        if (data_global.data.features[i].properties.phenomenons.CO2) {
                            var co2Measurement = data_global.data.features[i].properties.phenomenons.CO2.value;
                            $scope.data_track[1].values.push(co2Measurement);
                        } else {
                            $scope.data_track[1].values.push(undefined);
                        }
                        // get Coords:
                        var lat = data_global.data.features[i].geometry.coordinates[0];
                        var lon = data_global.data.features[i].geometry.coordinates[1];
                        // get timestamp:
                        var timeStamp = data_global.data.features[i].properties.time;

                        $scope.data_track[2].values.push(timeStamp);
                        $scope.data_track[3].values.push(lat);
                        $scope.data_track[4].values.push(lon);
                    }

                    // calculating stuff:
                    var sums = {
                        distance: 0,
                        fuel: 0,
                        co2: 0
                    };
                    for (var i = 0 + 1; i < $scope.track_summary_track_length; i++) {
                        // calculating distance:
                        var lat_now = $scope.data_track[3].values[i];
                        var lng_now = $scope.data_track[4].values[i];
                        var lat_past = $scope.data_track[3].values[i - 1];
                        var lng_past = $scope.data_track[4].values[i - 1];
                        var distance_i = $scope.distancecalculator(lng_now, lat_now, lng_past, lat_past);
                        sums.distance += distance_i;

                        // calculating fuel consumption:
                        if ($scope.data_track[0].values[i - 1] !== undefined) {
                            var fuel_now = $scope.data_track[0].values[i - 1];
                            sums.fuel += fuel_now;
                        }

                        // calculating co2 emission:
                        if ($scope.data_track[1].values[i - 1] !== undefined) {
                            var co2_now = $scope.data_track[1].values[i - 1];
                            sums.co2 += co2_now;
                        }

                    }
                    // calculating fuel consumption:
                    var fuel_now = $scope.data_track[0].values[$scope.track_summary_track_length - 1];
                    sums.fuel += fuel_now;

                    // calculating co2 emission:
                    var co2_now = $scope.data_track[1].values[$scope.track_summary_track_length - 1];
                    sums.co2 += co2_now;

                    distance = sums.distance;

                    // get timestamps:
                    var time1 = $scope.data_track[2].values[0];
                    var time2 = $scope.data_track[2].values[$scope.track_summary_track_length - 1];

                    var seconds_passed = new Date(time2).getTime() -
                            new Date(time1).getTime();
                    var seconds = seconds_passed / 1000;
                    // time of travel is in minutes
                    // convert to the right format. of hh:mm:ss;
                    var date_for_seconds = new Date(null);
                    date_for_seconds.setSeconds(seconds);
                    date_hh_mm_ss = date_for_seconds.toISOString().substr(
                            11, 8);
                    starttimeg = time1;
                    endtimeg = time2;

                    // fuel_avg:
                    var fuel_avg = sums.fuel / ($scope.track_summary_track_length - 0);

                    // fuel_avg*delta time:
                    var fuelPerTime = fuel_avg * (seconds_passed / (1000 * 60 * 60));
                    // 100* fuelPerTime / delta distance:
                    var fuelSum = 100 * fuelPerTime / distance; // (liter/100km)

                    // fuelSum * distance:
                    var fuelSumConsumed = fuelSum * distance / 100;

                    // co2_avg:
                    var co2_avg = sums.co2 / ($scope.track_summary_track_length - 0);
                    // co2_avg*delta time:
                    var co2PerTime = co2_avg * (seconds_passed / (1000 * 60 * 60)); // (kg/t)
                    // 100* co2PerTime / delta distance:
                    var co2kgH = 100 * co2PerTime / distance; // (kg/t_gesamt)

                    // co2PerTime * delta time:
                    var co2kgHConsumed = co2kgH * distance / 100; // (kg/h)

                    // interprete and count stop-n-go's:
                    stops = 0;
                    var stopping = false;
                    for (var index = 0; index < $scope.track_summary_track_length; index++) {
                        if (data_global.data.features[index].properties.phenomenons.Speed !== undefined) {
                            var speedValue = data_global.data.features[index].properties.phenomenons.Speed.value;
                            if (stopping) {
                                if (speedValue > 0) {
                                    stopping = false;
                                    stops++;
                                }
                            } else {
                                if (speedValue === 0) {
                                    stopping = true;
                                }
                            }
                            $scope.data_track[5].values.push(speedValue);
                        } else {
                            $scope.data_track[5].values.push(undefined);
                        }
                    }

                    // interprete and count stop-n-go's (3 measurements in a row; all <= 5km/h):
                    var stops2 = 0;
                    var stopping2 = 0;
                    for (var index = 0; index < $scope.track_summary_track_length; index++) {
                        if (data_global.data.features[index].properties.phenomenons.Speed !== undefined) {
                            var speedValue = data_global.data.features[index].properties.phenomenons.Speed.value;
                            if (stopping2 > 0) {
                                if (speedValue > 5) {
                                    stopping2 = 0;
                                } else {
                                    stopping2++;
                                    if (stopping2 === 3) {
                                        stops2++;
                                    }
                                }
                            } else {
                                if (speedValue <= 5) {
                                    stopping2++;
                                }
                            }
                        }
                    }

                    $scope.tracksummary = {
                        distance: distance.toFixed(2),
                        vehiclemodel: vehiclemodel,
                        vehicletype: vehicletype,
                        vehiclemanufacturer: vehiclemanufacturer,
                        unitsspeed: 'km/h',
                        timeoftravel: date_hh_mm_ss,
                        unitsofdistance: "km",
                        unitsoftime: "Minutes",
                        fuel: fuelSum.toFixed(2),
                        fuelConsumed: fuelSumConsumed.toFixed(2),
                        co2emissionperhour: co2kgH.toFixed(2),
                        co2emissionperhourConsumed: co2kgHConsumed.toFixed(2),
                        starttime: new Date(starttimeg).toLocaleString(),
                        endtime: new Date(endtimeg).toLocaleString(),
                        stops: stops //+ " " + stops2
                    };

                    if (!isNaN(fuelSum)) {
                        $scope.consumption_available = true;
                    } else {
                        $scope.consumption_available = false;
                    }

                    if (!isNaN(co2kgH)) {
                        $scope.co2_available = true;
                    } else {
                        $scope.co2_available = false;
                    }

                    $scope.onload_summary = true;
                },
                function (error) {
                    console.log(error);
                }
        );
    }
    ;
    angular.module('enviroCar')
            .controller('TrackSummaryCtrl', TrackSummaryCtrl);
})();