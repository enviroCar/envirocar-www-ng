(function () {
    'use strict';
    function HeatMapCtrl(
            $scope,
            $timeout,
            UserCredentialsService,
            UserService,
            leafletBoundsHelpers) {
        "ngInject";

        $scope.onload_heat_map = false;
        angular.extend($scope, {
            map: {
                layers2: {
                    baselayers: {
                        osm: {
                            name: 'OpenStreetMap',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        },
                        mapbox_light: {
                            name: 'Mapbox Light',
                            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                            type: 'xyz',
                            layerOptions: {
                                apikey: 'pk.eyJ1IjoibmF2ZWVuamFmZXIiLCJhIjoiY2lsYnVmamE0MDA1MXdnbHpvNGZianRuOCJ9.5KqDlJGBKr7ZF9Rdg6j_yQ',
                                mapid: 'naveenjafer.0n3ooo76'
                            }
                        }
                    },
                    overlays: {
                        heat:
                                {
                                    name: 'Heat Map',
                                    type: 'heat',
                                    data: $scope.heat_dataset,
                                    layerOptions: {
                                        radius: 20,
                                        blur: 30,
                                        minopacity: 0,
                                        maxZoom: 12
                                    },
                                    visible: true,
                                    doRefresh: true
                                }
                    }
                },
                defaults2: {
                    maxZoom: 10,
                    zoomControlPosition: 'topright',
                    scrollWheelZoom: false,
                    zoomControl: false,
                    doubleClickZoom: false,
                    dragging: false
                },
                bounds2: {
                }
            }
        });
        $scope.track_number = 0;
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;
        $scope.heat_dataset = [];
        var dataset_start = [];
        var dataset_end = [];
        UserService.getUserStatistic($scope.username, $scope.password).then(
                function (data) {
                    console.log(data);
                    var tracksummary = data.data.trackSummaries;
                    for (var i = 0; i < tracksummary.length; i++) {
                        var coord_push_start = [];
                        var coord_push_end = [];
                        coord_push_start[1] = tracksummary[i]
                        ['startPosition']
                        ['geometry']
                        ['coordinates'][0];
                        coord_push_start[0] = tracksummary[i]
                        ['startPosition']
                        ['geometry']
                        ['coordinates'][1];
                        coord_push_start[2] = 1;
                        coord_push_end[1] = tracksummary[i]
                        ['endPosition']
                        ['geometry']
                        ['coordinates'][0];
                        coord_push_end[0] = tracksummary[i]
                        ['endPosition']
                        ['geometry']
                        ['coordinates'][1];
                        coord_push_end[2] = 1;
                        dataset_start.push(coord_push_start);
                        dataset_end.push(coord_push_end);
                        $scope.heat_dataset.push(coord_push_start);
                        $scope.heat_dataset.push(coord_push_end);
                    }
                    $scope.map.layers2.overlays = {
                        heat:
                                {
                                    name: 'Heat Map',
                                    type: 'heat',
                                    data: $scope.heat_dataset,
                                    layerOptions: {
                                        radius: 20,
                                        blur: 30,
                                        minopacity: 0,
                                        maxZoom: 8
                                    },
                                    visible: true,
                                    doRefresh: true
                                }
                    };
                    var lat_min, lat_max, lng_min, lng_max;
                    // get southWest and northEast:
                    if (tracksummary[0].endPosition.geometry.coordinates[1]
                            < tracksummary[0].startPosition.geometry.coordinates[1]) {
                        lat_min = tracksummary[0].endPosition.geometry.coordinates[1];
                        lat_max = tracksummary[0].startPosition.geometry.coordinates[1];
                    } else {
                        lat_min = tracksummary[0].startPosition.geometry.coordinates[1];
                        lat_max = tracksummary[0].endPosition.geometry.coordinates[1];
                    }
                    if (tracksummary[0].endPosition.geometry.coordinates[0]
                            < tracksummary[0].startPosition.geometry.coordinates[0]) {
                        lng_min = tracksummary[0].endPosition.geometry.coordinates[0];
                        lng_max = tracksummary[0].startPosition.geometry.coordinates[0];
                    } else {
                        lng_min = tracksummary[0].startPosition.geometry.coordinates[0];
                        lng_max = tracksummary[0].endPosition.geometry.coordinates[0];
                    }
                    for (var i = 1; i < tracksummary.length; i++) {
                        var curr_start = tracksummary[i].startPosition.geometry.coordinates;
                        var curr_end = tracksummary[i].endPosition.geometry.coordinates;
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
                    $scope.southwest = {
                        lat: lat_min,
                        lng: lng_min
                    };
                    $scope.northeast = {
                        lat: lat_max,
                        lng: lng_max
                    };
                    var padding_lat = ($scope.northeast.lat - $scope.southwest.lat) / 10;
                    var padding_lng = ($scope.northeast.lng - $scope.southwest.lng) / 10;
                    $scope.map.bounds2 = leafletBoundsHelpers.createBoundsFromArray([
                        [$scope.northeast.lat + padding_lat, $scope.northeast.lng + padding_lng],
                        [$scope.southwest.lat - padding_lat, $scope.southwest.lng - padding_lng]
                    ]);
                    $timeout(function () {
                        $scope.onload_heat_map = true;
                        window.dispatchEvent(new Event('resize'));
                    }, 300);
                }, function (error) {
            console.log(error);
        });

        $scope.$on('sidenav:item-selected', function (event, args) {
            $timeout(function () {
                console.log("heatmap reloading...");
                $scope.map.layers2.overlays = {};
                $scope.map.layers2.overlays = {
                    heat:
                            {
                                name: 'Heat Map',
                                type: 'heat',
                                data: $scope.heat_dataset,
                                layerOptions: {
                                    radius: 20,
                                    blur: 30,
                                    minopacity: 0,
                                        maxZoom: 8
                                },
                                visible: true,
                                doRefresh: true
                            }
                };
                
                    var padding_lat = ($scope.northeast.lat - $scope.southwest.lat) / 10;
                    var padding_lng = ($scope.northeast.lng - $scope.southwest.lng) / 10;
                    $scope.map.bounds2 = leafletBoundsHelpers.createBoundsFromArray([
                        [$scope.northeast.lat + padding_lat, $scope.northeast.lng + padding_lng],
                        [$scope.southwest.lat - padding_lat, $scope.southwest.lng - padding_lng]
                    ]);
                    $timeout(function () {
                        $scope.onload_heat_map = true;
                        window.dispatchEvent(new Event('resize'));
                    }, 300);
                
                $scope.map.layers2.overlays.doRefresh = true;
            }, 500);
        });

};
    angular.module('enviroCar')
            .controller('HeatMapCtrl', HeatMapCtrl);
})();
