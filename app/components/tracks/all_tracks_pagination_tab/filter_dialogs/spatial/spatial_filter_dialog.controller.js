(function () {

    SpatialDialogCtrl = function ($scope, $translate, $mdDialog, $timeout, UserService, leafletData, leafletBoundsHelpers, leafletDrawEvents) {
        console.log("SpatialDialogCtrl started.");
        var drawnItems = new L.FeatureGroup();
        $scope.updateDialogMap = function() {
            $timeout(function () {
                $scope.map3.spatial_bounds_dialog = leafletBoundsHelpers.createBoundsFromArray([
                    [$scope.filters.spatial.params.northeast.lat, $scope.filters.spatial.params.northeast.lng],
                    [$scope.filters.spatial.params.southwest.lat, $scope.filters.spatial.params.southwest.lng]
                ]);
                window.dispatchEvent(new Event('resize'));
            },
                    100);
            $timeout(function () {
                window.dispatchEvent(new Event('resize'))
            },
                    500);
        };

        angular.extend($scope, {
            map3: {
                spatial_bounds_dialog: {},
                layers: {
                    baselayers: {
                        osm: {
                            name: 'OpenStreetMap',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    }
                },
                drawOptions: {
                    position: "bottomright",
                    draw: {
                        polyline: false,
                        polygon: false,
                        circle: false,
                        rectangle: {
                            metric: false,
                            showArea: true,
                            shapeOptions: {
                                color: 'blue'
                            }
                        },
                        marker: false
                    },
                    edit: {
                        featureGroup: drawnItems,
                        remove: true
                    }
                }
            }
        });
        var handle = {
            created: function (e, leafletEvent, leafletObject, model, modelName) {
                if ($scope.old !== undefined) {
                    drawnItems.removeLayer($scope.old);
                }
                $scope.filters.spatial.layer = leafletEvent.layer;
                drawnItems.addLayer($scope.filters.spatial.layer);
                var coords = leafletEvent.layer._latlngs;
                $scope.northEast = {
                    lat: coords[2].lat,
                    lng: coords[2].lng
                };
                $scope.southWest = {
                    lat: coords[0].lat,
                    lng: coords[0].lng
                };
                $scope.old = leafletEvent.layer;
            },
            edited: function (arg) {
                console.log(arg);
            },
            deleted: function (arg) {
                console.log(arg);
                var layers;
                layers = arg.layers;
                drawnItems.removeLayer(layers);
            },
            drawstart: function (arg) {},
            drawstop: function (arg) {},
            editstart: function (arg) {},
            editstop: function (arg) {},
            deletestart: function (arg) {},
            deletestop: function (arg) {}
        };
        var drawEvents = leafletDrawEvents.getAvailableEvents();
        drawEvents.forEach(function (eventName) {
            $scope.$on('leafletDirectiveDraw.' + eventName, function (e, payload) {
                console.log(eventName, e, payload);
                //{leafletEvent, leafletObject, model, modelName} = payload
                var leafletEvent, leafletObject, model, modelName; //destructuring not supported by chrome yet :(
                leafletEvent = payload.leafletEvent, leafletObject = payload.leafletObject, model = payload.model,
                        modelName = payload.modelName;
                handle[eventName.replace('draw:', '')](e, leafletEvent, leafletObject, model, modelName);
            });
        });

        $scope.errorOverlap = false;
        $scope.northEast = {
            lat: undefined,
            lng: undefined
        };
        $scope.southWest = {
            lat: undefined,
            lng: undefined
        };

        // if dialog openned for changing values, load previous bounding box coordinates:
        if ($scope.filters.spatial.inUse)
        {
            console.log("in use.");
            if ($scope.filters.spatial.params.southwest.lat !== undefined)
                $scope.southWest.lat = $scope.filters.spatial.params.southwest.lat;
            if ($scope.filters.spatial.params.southwest.lng !== undefined)
                $scope.southWest.lng = $scope.filters.spatial.params.southwest.lng;
            if ($scope.filters.spatial.params.northeast.lat !== undefined)
                $scope.northEast.lat = $scope.filters.spatial.params.northeast.lat;
            if ($scope.filters.spatial.params.northeast.lng !== undefined)
                $scope.northEast.lng = $scope.filters.spatial.params.northeast.lng;
            // zoom map to track:
            $timeout(function () {
                console.log(
                        [$scope.filters.spatial.params.northeast.lat, $scope.filters.spatial.params.northeast.lng],
                        [$scope.filters.spatial.params.southwest.lat, $scope.filters.spatial.params.southwest.lng]);
                $scope.map3.spatial_bounds_dialog = leafletBoundsHelpers.createBoundsFromArray([
                    [$scope.filters.spatial.params.northeast.lat, $scope.filters.spatial.params.northeast.lng],
                    [$scope.filters.spatial.params.southwest.lat, $scope.filters.spatial.params.southwest.lng]
                ]);

                $scope.updateDialogMap();
                window.dispatchEvent(new Event('resize'));
            },
                    100);
            $timeout(function () {
                window.dispatchEvent(new Event('resize'))
            },
                    500);
            $scope.updateDialogMap();
        } else {
            console.log("not in use.");
            // where to zoom to, if dialog is started first time?
            // TODO: Get userspecific default lat/lng coordinates somehow!
            $timeout(function () {
                $scope.map3.spatial_bounds_dialog = leafletBoundsHelpers.createBoundsFromArray([
                    [52.025, 12.13],
                    [50.007, 10.48]
                ]);
                console.log($scope.map3.spatial_bounds_dialog);
                window.dispatchEvent(new Event('resize'))
            },
                    100);
            $timeout(function () {
                window.dispatchEvent(new Event('resize'))
            },
                    500);
        }
        ;
        // if dialog closes on success button
        $scope.hide = function () {
            $scope.errorOverlap = false;
            $scope.ptMissing = false;
            // 0 or just 1 point is set by user:
            if (($scope.southWest.lat === undefined)
                    && ($scope.northEast.lat === undefined)) {
                $scope.ptMissing = true;
            } else if (($scope.southWest.lat >= $scope.northEast.lat)
                    || ($scope.southWest.lng >= $scope.northEast.lng))
            {
                // If southwest coordinates are bigger than northeast
                $scope.errorOverlap = true;
            } else {
                // all happy.

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
                            console.log("rect selected");
                            $scope.updateDialogMap();
                            $mdDialog.hide();
                            $scope.filtersChanged();
                        }, function (data) {
                    console.log("error " + data)
                });
            }
        };
        $scope.cancel = function () {
            // The user clicked on cancel, so apply no changes
            $mdDialog.cancel();
        };
        $scope.$on('toolbar:language-changed', function (event, args) {
            console.log("language changed received in DistanceDialogCtrl.");
        });
    };
    angular.module('enviroCar.tracks')
            .controller('SpatialDialogCtrl', SpatialDialogCtrl);
})();
