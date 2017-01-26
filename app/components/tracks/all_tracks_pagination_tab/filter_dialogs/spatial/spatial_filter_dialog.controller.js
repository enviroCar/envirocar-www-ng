(function () {

    SpatialDialogCtrl = function (
            $scope,
            $mdDialog,
            $timeout,
            UserService,
            FilterStateService,
            leafletBoundsHelpers) {

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
                var type = e.layerType,
                        layer = e.layer;
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
            // if dialog openned for changing values, load previous bounding box coordinates:
            if ($scope.filters.spatial.inUse)
            {
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
                    // where to zoom to, if dialog is started first time?
                    // TODO: Get userspecific default lat/lng coordinates from UserStatistic!

                    // 52.2, 8.7    51.68, 7.25
                    $timeout(function () {
                        var southWest = new L.LatLng(51.68, 7.25),
                                northEast = new L.LatLng(52.2, 8.7),
                                bounds = new L.LatLngBounds(southWest, northEast);
                        $scope.mymap.fitBounds(
                                bounds
                                );
                        window.dispatchEvent(new Event('resize'));
                    },
                            300);
                    $timeout(function () {
                        window.dispatchEvent(new Event('resize'));
                    },
                            100);
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
        });

//        $scope.updateDialogMap = function () {
//            $timeout(function () {
//                if (drawWhite) {
//                    $scope.map3.geojson = {
//                        data: {
//                            type: "FeatureCollection",
//                            features: [
//                                {
//                                    type: "Feature",
//                                    geometry: {
//                                        type: "Polygon",
//                                        coordinates: [[
//                                                [$scope.filters.spatial.params.southwest.lng, $scope.filters.spatial.params.southwest.lat],
//                                                [$scope.filters.spatial.params.southwest.lng, $scope.filters.spatial.params.northeast.lat],
//                                                [$scope.filters.spatial.params.northeast.lng, $scope.filters.spatial.params.northeast.lat],
//                                                [$scope.filters.spatial.params.northeast.lng, $scope.filters.spatial.params.southwest.lat]
//                                            ]]
//                                    },
//                                    properties: {name: "Area1"}
//                                }
//                            ]
//                        },
//                        style: {
//                            fillColor: "rgba(255,255,255,0.3)",
//                            fillOpacity: 0.5,
//                            weight: 2,
//                            opacity: 1,
//                            color: "rgba(255,255,255,0.5)"
//                        }
//                    };
//                } else {
//                    $scope.map3.geojson = {
//                        data: {
//                            type: "FeatureCollection",
//                            features: [
//                                {
//                                    type: "Feature",
//                                    geometry: {
//                                        type: "Polygon",
//                                        coordinates: [[
//                                                [$scope.filters.spatial.params.southwest.lng, $scope.filters.spatial.params.southwest.lat],
//                                                [$scope.filters.spatial.params.southwest.lng, $scope.filters.spatial.params.northeast.lat],
//                                                [$scope.filters.spatial.params.northeast.lng, $scope.filters.spatial.params.northeast.lat],
//                                                [$scope.filters.spatial.params.northeast.lng, $scope.filters.spatial.params.southwest.lat]
//                                            ]]
//                                    },
//                                    properties: {name: "Area1"}
//                                }
//                            ]
//                        },
//                        style: {
//                            fillColor: "#1A80C1",
//                            fillOpacity: 0.3,
//                            weight: 2,
//                            opacity: 0.5,
//                            color: "#1A80C1"
//                        }
//                    };
//                    drawWhite = true;
//                }
//
//                window.dispatchEvent(new Event('resize'));
//                $timeout(function () {
//                    $scope.map3.spatial_bounds = leafletBoundsHelpers.createBoundsFromArray([
//                        [$scope.filters.spatial.params.southwest.lat, $scope.filters.spatial.params.southwest.lng],
//                        [$scope.filters.spatial.params.northeast.lat, $scope.filters.spatial.params.northeast.lng]
//                    ]);
//                    window.dispatchEvent(new Event('resize'));
//                },
//                        300);
//            },
//                    300);
//            $timeout(function () {
//                window.dispatchEvent(new Event('resize'));
//            },
//                    300);
//        };
//        var handle = {
//            created: function (e, leafletEvent, leafletObject, model, modelName) {
//                if ($scope.old !== undefined) {
//                    drawnItems.removeLayer($scope.old);
//                }
//                $scope.filters.spatial.layer = leafletEvent.layer;
//                drawnItems.addLayer($scope.filters.spatial.layer);
//                var coords = leafletEvent.layer._latlngs;
//                $scope.northEast = {
//                    lat: coords[2].lat,
//                    lng: coords[2].lng
//                };
//                $scope.southWest = {
//                    lat: coords[0].lat,
//                    lng: coords[0].lng
//                };
//                $scope.old = leafletEvent.layer;
//                $scope.map3.geojson = {
//                    data: {
//                        type: "FeatureCollection",
//                        features: [
//                            {
//                                type: "Feature",
//                                geometry: {
//                                    type: "Polygon",
//                                    coordinates: [[
//                                            [$scope.filters.spatial.params.southwest.lng, $scope.filters.spatial.params.southwest.lat],
//                                            [$scope.filters.spatial.params.southwest.lng, $scope.filters.spatial.params.northeast.lat],
//                                            [$scope.filters.spatial.params.northeast.lng, $scope.filters.spatial.params.northeast.lat],
//                                            [$scope.filters.spatial.params.northeast.lng, $scope.filters.spatial.params.southwest.lat]
//                                        ]]
//                                },
//                                properties: {name: "Area1"}
//                            }
//                        ]
//                    },
//                    style: {
//                        fillColor: "rgb(255,255,255)",
//                        fillOpacity: 0.5,
//                        weight: 2,
//                        opacity: 1,
//                        color: "rgba(255,255,255)"
//                    }
//                };
//
//            },
//            edited: function (arg) {
//            },
//            deleted: function (arg) {
//                var layers;
//                layers = arg.layers;
//                drawnItems.removeLayer(layers);
//            },
//            drawstart: function (arg) {},
//            drawstop: function (arg) {},
//            editstart: function (arg) {},
//            editstop: function (arg) {},
//            deletestart: function (arg) {},
//            deletestop: function (arg) {}
//        };
//        var drawEvents = [];//leafletDrawEvents.getAvailableEvents();
//        drawEvents.forEach(function (eventName) {
//            $scope.$on('leafletDirectiveDraw.' + eventName, function (e, payload) {
//                //{leafletEvent, leafletObject, model, modelName} = payload
//                var leafletEvent, leafletObject, model, modelName; //destructuring not supported by chrome yet :(
//                leafletEvent = payload.leafletEvent, leafletObject = payload.leafletObject, model = payload.model,
//                        modelName = payload.modelName;
//                handle[eventName.replace('draw:', '')](e, leafletEvent, leafletObject, model, modelName);
//            });
//        });
//        $scope.errorOverlap = false;
//        $scope.errorServerRequest = false;
//        $scope.northEast = {
//            lat: undefined,
//            lng: undefined
//        };
//        $scope.southWest = {
//            lat: undefined,
//            lng: undefined
//        };
//        // if dialog openned for changing values, load previous bounding box coordinates:
//        if ($scope.filters.spatial.inUse)
//        {
//            if ($scope.filters.spatial.params.southwest.lat !== undefined)
//                $scope.southWest.lat = $scope.filters.spatial.params.southwest.lat;
//            if ($scope.filters.spatial.params.southwest.lng !== undefined)
//                $scope.southWest.lng = $scope.filters.spatial.params.southwest.lng;
//            if ($scope.filters.spatial.params.northeast.lat !== undefined)
//                $scope.northEast.lat = $scope.filters.spatial.params.northeast.lat;
//            if ($scope.filters.spatial.params.northeast.lng !== undefined)
//                $scope.northEast.lng = $scope.filters.spatial.params.northeast.lng;
//            // zoom map to track:
//            $scope.updateDialogMap();
//        } else {
//            var state = FilterStateService.getSpatialFilterState();
//            if (state.northeast.lat !== undefined) {
//                if ($scope.filters.spatial.params.southwest.lat !== undefined)
//                    $scope.southWest.lat = $scope.filters.spatial.params.southwest.lat;
//                if ($scope.filters.spatial.params.southwest.lng !== undefined)
//                    $scope.southWest.lng = $scope.filters.spatial.params.southwest.lng;
//                if ($scope.filters.spatial.params.northeast.lat !== undefined)
//                    $scope.northEast.lat = $scope.filters.spatial.params.northeast.lat;
//                if ($scope.filters.spatial.params.northeast.lng !== undefined)
//                    $scope.northEast.lng = $scope.filters.spatial.params.northeast.lng;
//                // zoom map to track:
//                $scope.updateDialogMap();
//            } else {
//                // where to zoom to, if dialog is started first time?
//                // TODO: Get userspecific default lat/lng coordinates somehow!
//
//                // 52.2, 8.7    51.68, 7.25
//                $timeout(function () {
//                    $scope.map3.spatial_bounds = leafletBoundsHelpers.createBoundsFromArray([
//                        [51.68, 7.25], [52.2, 8.7]
//                    ]);
//                    window.dispatchEvent(new Event('resize'));
//                },
//                        1000);
//                $timeout(function () {
//                    window.dispatchEvent(new Event('resize'));
//                },
//                        500);
//            }
//        }
//        ;
//        // if dialog closes on success button
//        $scope.hide = function () {
//            $scope.errorOverlap = false;
//            $scope.ptMissing = false;
//            // 0 or just 1 point is set by user:
//            if (($scope.southWest.lat === undefined)
//                    && ($scope.northEast.lat === undefined)) {
//                $scope.ptMissing = true;
//            } else if (($scope.southWest.lat >= $scope.northEast.lat)
//                    || ($scope.southWest.lng >= $scope.northEast.lng))
//            {
//                // If southwest coordinates are bigger than northeast
//                $scope.errorOverlap = true;
//            } else {
//                // all happy.
//
//                $scope.okay_pressed = true;
//                var spatial_filter_sw = $scope.filters.spatial.params.southwest;
//                var spatial_filter_ne = $scope.filters.spatial.params.northeast;
//                spatial_filter_sw.lat = $scope.southWest.lat;
//                spatial_filter_sw.lng = $scope.southWest.lng;
//                spatial_filter_ne.lat = $scope.northEast.lat;
//                spatial_filter_ne.lng = $scope.northEast.lng;
//                UserService.getUserTracksBBox($scope.username, $scope.password,
//                        $scope.filters.spatial.params.southwest.lng,
//                        $scope.filters.spatial.params.southwest.lat,
//                        $scope.filters.spatial.params.northeast.lng,
//                        $scope.filters.spatial.params.northeast.lat).then(
//                        function (data) {
//                            $scope.filters.spatial.params.track_ids = [];
//                            for (var i = 0; i < data.data.tracks.length; i++) {
//                                var currTrack = data.data.tracks[i];
//                                $scope.filters.spatial.params.track_ids.push(currTrack.id);
//                            }
//                            ;
//                            $scope.filters.spatial.inUse = true;
//                            FilterStateService.setSpatialFilterState(
//                                    true,
//                                    spatial_filter_sw.lat,
//                                    spatial_filter_sw.lng,
//                                    spatial_filter_ne.lat,
//                                    spatial_filter_ne.lng,
//                                    $scope.filters.spatial.params.track_ids
//                                    );
//
//                            //$scope.updateDialogMap();
//                            $mdDialog.hide();
//                            $scope.filtersChanged();
//                        }, function (data) {
//                    console.log("error " + data);
//                    $timeout(function () {
//                        $scope.okay_pressed = false;
//                        $scope.errorServerRequest = true;
//                        window.dispatchEvent(new Event('resize'));
//                    },
//                            300);
//                    $timeout(function () {
//                        window.dispatchEvent(new Event('resize'));
//                    },
//                            500);
//
//                });
//            }
//        };
//        $scope.cancel = function () {
//            // The user clicked on cancel, so apply no changes
//            $mdDialog.cancel();
//        };
//        $scope.$on('toolbar:language-changed', function (event, args) {
//        });
    };
    angular.module('enviroCar.tracks')
            .controller('SpatialDialogCtrl', SpatialDialogCtrl);
})();
