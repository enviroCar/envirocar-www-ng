(function () {
    'use strict';
    function HeatMapCtrl($scope, $http, $state, $translate, TrackService, UserService, UserCredentialsService, ecBaseUrl) {
        $scope.onload_heat_map = false;
        angular.extend($scope, {
            center: {},
            layers: {
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
                }
            }
        });
        var timeline = {};
        $scope.track_number = 0;
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;

        //$scope.layers = {};
        //$scope.layers.overlays = {};
        var urlredirect = '#/dashboard/chart/';
        var points = [];
        var mid_point = [0, 0];
        var dataset = [];
        var dataset_start = [];
        var dataset_end = [];
        $http({
            method: 'GET',
            url: "app/components/assets/tracksummaries.json",
            headers: {
                'Content-Type': "application/json",
            }
        }).then(function (data) {
            console.log(data);
            // create new json array for trackArray:
            var tracksummary = data.data.trackSummaries;
            console.log(tracksummary);
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
                dataset.push(coord_push_start);
                dataset.push(coord_push_end);
            }
            console.log(dataset);
            mid_point[0] = mid_point[0] / (tracksummary.length * 2);
            mid_point[1] = mid_point[1] / (tracksummary.length * 2);
            console.log(mid_point[0]);
            console.log(mid_point[1]);
            $scope.center = {
                lat: mid_point[1],
                lng: mid_point[0],
                zoom: 6
            }
            $scope.layers.overlays = {
                heat: {
                    name: 'Heat Map',
                    type: 'heat',
                    data: dataset,
                    layerOptions: {
                        radius: 20,
                        blur: 30,
                        minopacity: 0,
                        maxZoom: 8
                    },
                    visible: true
                }
            };
            console.log($scope.layers.overlays);
            console.log($scope.layers);
            $scope.onload_heat_map = true;
        }, function (error) {
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
         });
         */
    }
    ;



    angular.module('enviroCar')
            .controller('HeatMapCtrl', HeatMapCtrl);
})();