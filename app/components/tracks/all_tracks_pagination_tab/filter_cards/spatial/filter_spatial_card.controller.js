(function () {
    'use strict';
    function FilterSpatialCardCtrl(
            $rootScope,
            $scope,
            $timeout,
            $state,
            leafletData,
            leafletBoundsHelpers,
            leafletDrawEvents) {
        var drawnItems2 = new L.FeatureGroup();
        angular.extend($scope, {
            map2: {
                spatial_bounds_card: {
                },
                layers_card: {
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
                            },
                            edit: false
                        },
                        marker: false,
                        edit: false
                    },
                    edit: {
                        featureGroup: drawnItems2,
                        remove: false,
                        edit: false
                    }
                },
                geojson: {
                    data: {
                        type: "FeatureCollection",
                        features: [
                            {
                                type: "Feature",
                                geometry: {
                                    type: "Polygon",
                                    coordinates: [[
                                            [$scope.filters.spatial.params.southwest.lng, $scope.filters.spatial.params.southwest.lat],
                                            [$scope.filters.spatial.params.southwest.lng, $scope.filters.spatial.params.northeast.lat],
                                            [$scope.filters.spatial.params.northeast.lng, $scope.filters.spatial.params.northeast.lat],
                                            [$scope.filters.spatial.params.northeast.lng, $scope.filters.spatial.params.southwest.lat]
                                        ]]
                                },
                                properties: {name: "Area1"}
                            }
                        ]
                    },
                    style: {
                        fillColor: "#1A80C1",
                        fillOpacity: 0.3,
                        weight: 2,
                        opacity: 0.5,
                        color: "#1A80C1"
                    }
                },
                defaults: {
                    scrollWheelZoom: false,
                    zoomControl: false,
                    doubleClickZoom: false,
                    dragging: false
                }
            }
        });

        $scope.updateMap = function () {
            $timeout(function () {
                $scope.map2.geojson = {
                    data: {
                        type: "FeatureCollection",
                        features: [
                            {
                                type: "Feature",
                                geometry: {
                                    type: "Polygon",
                                    coordinates: [[
                                            [$scope.filters.spatial.params.southwest.lng, $scope.filters.spatial.params.southwest.lat],
                                            [$scope.filters.spatial.params.southwest.lng, $scope.filters.spatial.params.northeast.lat],
                                            [$scope.filters.spatial.params.northeast.lng, $scope.filters.spatial.params.northeast.lat],
                                            [$scope.filters.spatial.params.northeast.lng, $scope.filters.spatial.params.southwest.lat]
                                        ]]
                                },
                                properties: {name: "Area1"}
                            }
                        ]
                    },
                    style: {
                        fillColor: "#1A80C1",
                        fillOpacity: 0.3,
                        weight: 2,
                        opacity: 0.5,
                        color: "#1A80C1"
                    }
                };
                var paddingLat = ($scope.filters.spatial.params.northeast.lat - $scope.filters.spatial.params.southwest.lat) / 10;
                $scope.map2.spatial_bounds_card = leafletBoundsHelpers.createBoundsFromArray([
                    [$scope.filters.spatial.params.northeast.lat+paddingLat, $scope.filters.spatial.params.northeast.lng],
                    [$scope.filters.spatial.params.southwest.lat-paddingLat, $scope.filters.spatial.params.southwest.lng]
                ]);
                window.dispatchEvent(new Event('resize'));
            },
                    100);
            
            $timeout(function () {
                window.dispatchEvent(new Event('resize'))
            },
                    500);
        };

        $scope.updateMap();

        $scope.$on('filter:spatial-filter-changed', function (event, args) {
            $scope.updateMap();
        });

        $scope.$on('toolbar:language-changed', function (event, args) {
            $scope.updateMap();
        });
        
        $scope.filtersChanged();

        $timeout(function () {
            window.dispatchEvent(new Event('resize'))
        },
                50);
        
        $timeout(function () {
            window.dispatchEvent(new Event('resize'))
        },
                50);
    }
    ;
    angular.module('enviroCar.tracks')
            .controller('FilterSpatialCardCtrl', FilterSpatialCardCtrl);
})();
