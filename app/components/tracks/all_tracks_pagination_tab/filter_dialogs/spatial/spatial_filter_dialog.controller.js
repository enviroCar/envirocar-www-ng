(function () {

    SpatialDialogCtrl = function (
            $scope,
            $mdDialog,
            $timeout,
            UserService,
            FilterStateService,
            UserCredentialsService) {

        $scope.okay_pressed = false;
        $scope.errorOverlap = false;
        $scope.errorServerRequest = false;
        var osm = L.tileLayer(
                'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    name: 'OpenStreetMap',
                    type: 'xyz'
                }
        );
        $timeout(function () {
            $scope.mymap = L.map('spatial_filter_dialog_map', {
                center: [51.505, -0.09],
                zoom: 10,
                layers: [osm]
            });
            $scope.drawnItems = new L.FeatureGroup();
            $scope.mymap.addLayer($scope.drawnItems);
            $scope.drawOptions = {
                position: "bottomright",
                draw: {
                    polyline: false,
                    polygon: false,
                    circle: false,
                    rectangle: {
                        metric: false,
                        showArea: true,
                        shapeOptions: {
                            color: "#1A80C1"
                        }
                    },
                    marker: false
                },
                edit: {
                    featureGroup: $scope.drawnItems,
                    remove: false
                }
            };
            $scope.drawControl = new L.Control.Draw($scope.drawOptions);
            $scope.mymap.addControl($scope.drawControl);
            $scope.mymap.on(L.Draw.Event.CREATED, function (e) {
                console.log(e);
                var layer = e.layer;
                if ($scope.old !== undefined) {
                    $scope.drawnItems.removeLayer($scope.old);
                }
                if ($scope.loaded !== undefined)
                    $scope.drawnItems.removeLayer($scope.loaded);

                $scope.filters.spatial.layer = layer;
                $scope.drawnItems.addLayer($scope.filters.spatial.layer);
                var coords = layer._latlngs;
                $scope.northEast = {
                    lat: coords[2].lat,
                    lng: coords[2].lng
                };
                $scope.southWest = {
                    lat: coords[0].lat,
                    lng: coords[0].lng
                };
                $scope.old = layer;
                $scope.drawnItems.addLayer(layer);
            });
            if ($scope.filters.spatial.inUse) {
                // dialog openned for changing values, load previous bounding box coordinates:
                if ($scope.filters.spatial.params.southwest.lat !== undefined)
                    $scope.southWest.lat = $scope.filters.spatial.params.southwest.lat;
                if ($scope.filters.spatial.params.southwest.lng !== undefined)
                    $scope.southWest.lng = $scope.filters.spatial.params.southwest.lng;
                if ($scope.filters.spatial.params.northeast.lat !== undefined)
                    $scope.northEast.lat = $scope.filters.spatial.params.northeast.lat;
                if ($scope.filters.spatial.params.northeast.lng !== undefined)
                    $scope.northEast.lng = $scope.filters.spatial.params.northeast.lng;
                // update Map view:
                $scope.updateDialogMap();
            } else {
                // dialog openned for first time, but FilterStateService has the filter saves, load them data:
                var state = FilterStateService.getSpatialFilterState();
                if (state.northeast.lat !== undefined) {
                    if ($scope.filters.spatial.params.southwest.lat !== undefined)
                        $scope.southWest.lat = $scope.filters.spatial.params.southwest.lat;
                    if ($scope.filters.spatial.params.southwest.lng !== undefined)
                        $scope.southWest.lng = $scope.filters.spatial.params.southwest.lng;
                    if ($scope.filters.spatial.params.northeast.lat !== undefined)
                        $scope.northEast.lat = $scope.filters.spatial.params.northeast.lat;
                    if ($scope.filters.spatial.params.northeast.lng !== undefined)
                        $scope.northEast.lng = $scope.filters.spatial.params.northeast.lng;
                    // update Map view:
                    $scope.updateDialogMap();
                } else {
                    // Dialog started first time: get Map view boundingbox info from UserStatistics:
                    $scope.username = UserCredentialsService.getCredentials().username;
                    $scope.password = UserCredentialsService.getCredentials().password;
                    UserService.getUserStatistic($scope.username, $scope.password).then(
                            function (data) {
                                var trackSummaries = data.data.trackSummaries;
                                console.log(trackSummaries);
                                if (trackSummaries.length > 0) {
                                    var lat_min, lat_max, lng_min, lng_max;
                                    // get southWest and northEast:
                                    if (trackSummaries[0].endPosition.geometry.coordinates[1]
                                            < trackSummaries[0].startPosition.geometry.coordinates[1]) {
                                        lat_min = trackSummaries[0].endPosition.geometry.coordinates[1];
                                        lat_max = trackSummaries[0].startPosition.geometry.coordinates[1];
                                    } else {
                                        lat_min = trackSummaries[0].startPosition.geometry.coordinates[1];
                                        lat_max = trackSummaries[0].endPosition.geometry.coordinates[1];
                                    }
                                    if (trackSummaries[0].endPosition.geometry.coordinates[0]
                                            < trackSummaries[0].startPosition.geometry.coordinates[0]) {
                                        lng_min = trackSummaries[0].endPosition.geometry.coordinates[0];
                                        lng_max = trackSummaries[0].startPosition.geometry.coordinates[0];
                                    } else {
                                        lng_min = trackSummaries[0].startPosition.geometry.coordinates[0];
                                        lng_max = trackSummaries[0].endPosition.geometry.coordinates[0];
                                    }
                                    for (var i = 1; i < trackSummaries.length; i++) {
                                        var curr_start = trackSummaries[i].startPosition.geometry.coordinates;
                                        var curr_end = trackSummaries[i].endPosition.geometry.coordinates;
                                        if (lat_min > curr_start[1])
                                            lat_min = curr_start[1];
                                        if (lat_min > curr_end[1])
                                            lat_min = curr_end[1];
                                        if (lng_min > curr_start[0])
                                            lng_min = curr_start[0];
                                        if (lng_min > curr_end[0])
                                            lng_min = curr_end[0];
                                        if (lat_max < curr_start[1])
                                            lat_max = curr_start[1];
                                        if (lat_max < curr_end[1])
                                            lat_max = curr_end[1];
                                        if (lng_max < curr_start[0])
                                            lng_max = curr_start[0];
                                        if (lng_max < curr_end[0])
                                            lng_max = curr_end[0];
                                    }
                                    var southWest = new L.LatLng(lat_min, lng_min),
                                            northEast = new L.LatLng(lat_max, lng_max),
                                            bounds = new L.LatLngBounds(southWest, northEast);
                                    $scope.mymap.fitBounds(
                                            bounds
                                            );
                                }
                                window.dispatchEvent(new Event('resize'));
                                    $timeout(function () {
                                        window.dispatchEvent(new Event('resize'));
                                    },
                                            300);
                                    $timeout(function () {
                                        window.dispatchEvent(new Event('resize'));
                                    },
                                            500);
                            }, function (error) {
                        console.log(error);
                    });
                }
            }
        }, 300);
        $scope.northEast = {
            lat: undefined,
            lng: undefined
        };
        $scope.southWest = {
            lat: undefined,
            lng: undefined
        };
        $scope.updateDialogMap = function () {
            $timeout(function () {
                // zoom to Filter bounding box:
                var southWest = new L.LatLng(
                        $scope.filters.spatial.params.southwest.lat,
                        $scope.filters.spatial.params.southwest.lng),
                        northEast = new L.LatLng(
                                $scope.filters.spatial.params.northeast.lat,
                                $scope.filters.spatial.params.northeast.lng),
                        bounds = new L.LatLngBounds(southWest, northEast);
                $scope.mymap.fitBounds(
                        bounds
                        );
                // create draw layer for bounding box:
                if ($scope.filters.spatial.layer !== undefined) {
                    var boundingBox = new L.Rectangle([
                        southWest,
                        northEast
                    ]);
                    $scope.loaded = boundingBox.addTo($scope.drawnItems);
                }
            }, 300);
        };

        // if dialog closes on success button
        $scope.hide = function () {
            $scope.errorOverlap = false;
            $scope.ptMissing = false;
            // check for errors:
            if (($scope.southWest.lat === undefined)
                    && ($scope.northEast.lat === undefined)) {
                // 0 or just 1 point is set by user:
                $scope.ptMissing = true;
            } else if (($scope.southWest.lat >= $scope.northEast.lat)
                    || ($scope.southWest.lng >= $scope.northEast.lng))
            {
                // If southwest coordinates are bigger than northeast
                $scope.errorOverlap = true;
            } else {
                // no errors:
                $scope.okay_pressed = true;
                var spatial_filter_sw = $scope.filters.spatial.params.southwest;
                var spatial_filter_ne = $scope.filters.spatial.params.northeast;
                spatial_filter_sw.lat = $scope.southWest.lat;
                spatial_filter_sw.lng = $scope.southWest.lng;
                spatial_filter_ne.lat = $scope.northEast.lat;
                spatial_filter_ne.lng = $scope.northEast.lng;
                UserService.getUserTracksBBox($scope.username, $scope.password,
                        $scope.filters.spatial.params.southwest.lng,
                        $scope.filters.spatial.params.southwest.lat,
                        $scope.filters.spatial.params.northeast.lng,
                        $scope.filters.spatial.params.northeast.lat).then(
                        function (data) {
                            $scope.filters.spatial.params.track_ids = [];
                            for (var i = 0; i < data.data.tracks.length; i++) {
                                var currTrack = data.data.tracks[i];
                                $scope.filters.spatial.params.track_ids.push(currTrack.id);
                            }
                            ;
                            $scope.filters.spatial.inUse = true;
                            FilterStateService.setSpatialFilterState(
                                    true,
                                    spatial_filter_sw.lat,
                                    spatial_filter_sw.lng,
                                    spatial_filter_ne.lat,
                                    spatial_filter_ne.lng,
                                    $scope.filters.spatial.params.track_ids
                                    );

                            //$scope.updateDialogMap();
                            $mdDialog.hide();
                            $scope.filtersChanged();
                        }, function (data) {
                    console.log("error " + data);
                    $timeout(function () {
                        $scope.okay_pressed = false;
                        $scope.errorServerRequest = true;
                        window.dispatchEvent(new Event('resize'));
                    },
                            300);
                    $timeout(function () {
                        window.dispatchEvent(new Event('resize'));
                    },
                            500);

                });
            }
        };

        $scope.cancel = function () {
            // The user clicked on cancel, so apply no changes
            $mdDialog.cancel();
        };
        $scope.$on('toolbar:language-changed', function (event, args) {
            // TODO: translation of leaflet buttons 'Draw a Rectangle' etc.
        });

    };
    angular.module('enviroCar.tracks')
            .controller('SpatialDialogCtrl', SpatialDialogCtrl);
})();
