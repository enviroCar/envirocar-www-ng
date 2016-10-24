(function () {
    'use strict';
    function HeatMapCtrl(
            $scope,
            $http,
            UserCredentialsService) {

        $scope.onload_heat_map = false;
        angular.extend($scope, {
            map: {
                center2: {
                    lat: 10.5,
                    lng: 10.5,
                    zoom: 10
                },
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
                    }
                },
                defaults : {
                    scrollWheelZoom: false,
                    zoomControl: true,
                    doubleClickZoom: false,
                    dragging: false
                }
            }
        });
        console.log($scope.map.layers2.overlays);
        var timeline = {};
        $scope.track_number = 0;
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;
        var urlredirect = '#/dashboard/chart/';
        var points = [];
        var mid_point = [0, 0];
        var heat_dataset = [];
        var dataset_start = [];
        var dataset_end = [];
        $http({
            method: 'GET',
            url: "app/components/assets/tracksummaries.json",
            headers: {
                'Content-Type': "application/json"
            }
        }).then(function (data) {
            // create new json array for trackArray:
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
                mid_point[0] += coord_push_start[1];
                mid_point[1] += coord_push_start[0];
                coord_push_end[1] = tracksummary[i]
                ['endPosition']
                ['geometry']
                ['coordinates'][0];
                coord_push_end[0] = tracksummary[i]
                ['endPosition']
                ['geometry']
                ['coordinates'][1];
                coord_push_end[2] = 1;
                mid_point[0] += coord_push_end[1];
                mid_point[1] += coord_push_end[0];
                dataset_start.push(coord_push_start);
                dataset_end.push(coord_push_end);
                heat_dataset.push(coord_push_start);
                heat_dataset.push(coord_push_end);
            }
            mid_point[0] = mid_point[0] / (tracksummary.length * 2);
            mid_point[1] = mid_point[1] / (tracksummary.length * 2);
            $scope.map.center2 = {
                lat: mid_point[1],
                lng: mid_point[0],
                zoom: 10
            };
            $scope.map.layers2.overlays = {
                heat:
                        {
                            name: 'Heat Map',
                            type: 'heat',
                            data: heat_dataset,
                            layerOptions: {
                                radius: 20,
                                blur: 30,
                                minopacity: 0,
                                maxZoom: 8
                            },
                            visible: true
                        }
            };
            console.log($scope.map.layers2.overlays.heat);
        }
        , function (error) {
            console.log(error);
        });
        /** serverseitiger CORS Fehler
         $http({
         method: 'GET',
         url: "https://envirocar.org/ng-user-stats.json",
         cache: true,
         headers: {
         'Content-Type': 'Accept',
         'X-User'    :   $scope.username,
         'X-Token'   :   $scope.password
         }
         }).then(function (res) {
         console.log("heatmap log:");
         console.log(res);
         }, function (error) {
         console.log("ResponseError @GET" + "https://envirocar.org/ng-user-stats.json");
         return error;
         }
         );
         */
    }
    ;
    angular.module('enviroCar')
            .controller('HeatMapCtrl', HeatMapCtrl);
})();
