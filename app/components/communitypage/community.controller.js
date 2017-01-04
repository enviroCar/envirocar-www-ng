(function () {
    'use strict';
    function CommunityCtrl(
            $scope,
            $timeout,
            $mdDialog,
            $translate,
            StatisticsService,
            leafletDrawEvents) {

        $scope.onload_community_map = false;
        $scope.onload_community_data = true;
        $scope.onload_data = false;
        $scope.numberSegments = 2;
        $scope.currentPhenomIndex = 0; // 0 - Speed, 1 - Consumption, 2 - CO2
        var drawnItems = new L.FeatureGroup();
        $scope.segmentColors = [
            {
                0: '#550000',
                1: '#005500',
                2: '#000055',
                3: '#555500',
                4: '#550055',
                5: '#005555',
                6: '#552200',
                7: '#550022',
                8: '#005522',
                9: '#225500',
                10: '#220055',
                11: '#002255'
            },
            {
                0: '#aa0000',
                1: '#00aa00',
                2: '#0000aa',
                3: '#aaaa00',
                4: '#aa00aa',
                5: '#00aaaa',
                6: '#aa5500',
                7: '#aa0055',
                8: '#00aa55',
                9: '#55aa00',
                10: '#5500aa',
                11: '#0055aa'
            },
            {
                0: '#ff0000',
                1: '#00ff00',
                2: '#0000ff',
                3: '#ffff00',
                4: '#ff00ff',
                5: '#00ffff',
                6: '#ffaa00',
                7: '#ff00aa',
                8: '#00ffaa',
                9: '#aaff00',
                10: '#aa00ff',
                11: '#00aaff'
            }
        ];
        angular.extend($scope, {
            center_community: {
            },
            drawOptions_community: {
                position: "bottomright",
                draw: {
                    polyline: {
                        allowIntersection: true,
                        shapeOptions: {
                            color: "#1A80C1"
                        },
                        metric: true,
                        zIndexOffset: 2000
                    },
                    polygon: false,
                    circle: false,
                    rectangle: false,
                    marker: false
                },
                edit: {
                    featureGroup: drawnItems,
                    remove: false
                }
            },
            layers_community: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                    }
                }
            },
            paths_community: {
            },
            events_community: {
                paths: {
                    enable: ['click', 'mouseover'],
                    logic: 'emit'
                }
            }
        });

        $scope.$on('leafletDirectivePath.mouseover', function (event, path) {
            var segment = parseInt(path.modelName.substring(1));
            // show tooltip:
            console.log("segment " + segment + " hovered.");
        });

        $scope.dataCharts = [];
        $scope.options_community = {
            chart: {
                type: 'multiBarHorizontalChart',
                height: 600 / $scope.numberSegments,
                y: function (d) {
                    return d.value;
                },
                showControls: false,
                showValues: true,
                duration: 500,
                stacked: false,
                forceY: [0, 200],
                showLegend: false,
                showMinMax: false,
                margin: {
                    left: 16,
                    top: 8,
                    right: 8,
                    bottom: 24
                },
                color: function (d, i) {
                    return d.values[0].color;
                }
            }
        };

        $scope.showAlert = function (ev, title, description) {
            var dialog_title = $translate.instant(title);
            var dialog_desc = $translate.instant(description);
            $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title(dialog_title)
                    .textContent(dialog_desc)
                    .ariaLabel('Popover')
                    .ok('Okay!')
                    .targetEvent(ev)
                    .fullscreen(true)
                    );
        };
        // get the user location:
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        }

        function showPosition(position) {
            console.log(position);
            $scope.center_community = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                zoom: 13
            };
            $scope.onload_community_map = true;
            $timeout(function () {
                window.dispatchEvent(new Event('resize'));
                $timeout(function () {
                    window.dispatchEvent(new Event('resize'));
                }, 200);
            }, 100);
        }

        getLocation();

        $scope.onload_community_map = true;
        $timeout(function () {
            window.dispatchEvent(new Event('resize'));
            $timeout(function () {
                window.dispatchEvent(new Event('resize'));
            }, 200);
        }, 100);
        $scope.data = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [[7.604778, 51.950531],
                    [7.604778, 51.950531]]
            },
            "timeInterval": {
                "dateStart": "2010-06-08T11:29:10Z",
                "dateEnd": "2026-09-08T11:29:10Z",
                "daytimeStart": "1:30",
                "daytimeEnd": "15:30"
            },
            "tolerance": 25
        };

        var getPhenomStatisticValue = function (json, phenom) {
            var result = {
                min: 0,
                avg: 0,
                max: 0,
                count: 0
            };
            for (var j = 0; j < json.length; j++) {
                if (json[j])
                    if (json[j].name)
                        if (json[j].name === phenom) {
                            result.min = json[j].min;
                            result.avg = json[j].avg;
                            result.max = json[j].max;
                            result.count = json[j].count;
                        }
            }
            return result;
        };

        var getPhenomenonMaximum = function (jsondata, phenomenon) {
            console.log(jsondata);
            var max = 0;
            for (var index = 0; index < jsondata.length; index++) {
                var curr = getPhenomStatisticValue(jsondata[index].properties, phenomenon).max;
                console.log(curr);
                if (curr > max) {
                    max = curr;
                }
            }
            return max;
        };

        $scope.onPhenomenonChange = function (selected) {
            // remove old data:
            $scope.dataCharts = [];
            $scope.currentPhenomIndex = selected;

            // update data on charts for each segment:
            console.log(selected);
            console.log($scope.dataAll);
            for (var index = 0; index < $scope.numberSegments; index++) {
                var curr = $scope.dataAll[(3 * index) + selected];
                $scope.dataCharts.push(curr);
                console.log("Label: "+curr[0].values[0].label);
                // force new max  value in chart:
                $scope.options_community.chart.forceY = [0, $scope.max[selected]];
            }
            
        };

        $scope.dataAll = [];
        $scope.max = [
            0,
            0,
            0
        ];

        var loadCharts = function (data) {
            $scope.max = [
                0,
                0,
                0
            ];
            $scope.max[0] = getPhenomenonMaximum(data, "Speed");
            $scope.max[1] = getPhenomenonMaximum(data, "Consumption");
            $scope.max[2] = getPhenomenonMaximum(data, "CO2");

            $scope.options_community.chart.forceY = [0, $scope.max[0]];
            $scope.numberSegments = data.length;
            $scope.dataCharts = [];
            $scope.dataAll = [];
            for (var i = 0; i < $scope.numberSegments; i++) {
                var currSegment = data[i].properties;
                var currSegmentData = {
                    speed: getPhenomStatisticValue(currSegment, "Speed"),
                    consumption: getPhenomStatisticValue(currSegment, "Consumption"),
                    co2: getPhenomStatisticValue(currSegment, "CO2")
                };
                var exampledata = [
                    {
                        "key": "Minimum",
                        "values": [
                            {
                                "color": $scope.segmentColors[0][i],
                                "label": (i + 1) + "Speed",
                                "value": currSegmentData.speed.min
                            }
                        ]
                    },
                    {
                        "key": "Average",
                        "values": [
                            {
                                color: $scope.segmentColors[1][i],
                                "label": (i + 1) + "",
                                "value": currSegmentData.speed.avg
                            }
                        ]
                    },
                    {
                        "key": "Maximum",
                        "values": [
                            {
                                color: $scope.segmentColors[2][i],
                                "label": (i + 1) + "",
                                "value": currSegmentData.speed.max
                            }
                        ]
                    }
                ];
                $scope.dataAll.push(
                        exampledata
                        );
                $scope.dataCharts.push(
                        exampledata
                        );
                var exampledata = [
                    {
                        "key": "Minimum",
                        "values": [
                            {
                                "color": $scope.segmentColors[0][i],
                                "label": (i + 1) + "Consumption",
                                "value": currSegmentData.consumption.min
                            }
                        ]
                    },
                    {
                        "key": "Average",
                        "values": [
                            {
                                color: $scope.segmentColors[1][i],
                                "label": (i + 1) + "",
                                "value": currSegmentData.consumption.avg
                            }
                        ]
                    },
                    {
                        "key": "Maximum",
                        "values": [
                            {
                                color: $scope.segmentColors[2][i],
                                "label": (i + 1) + "",
                                "value": currSegmentData.consumption.max
                            }
                        ]
                    }
                ];
                $scope.dataAll.push(
                        exampledata
                        );
                var exampledata = [
                    {
                        "key": "Minimum",
                        "values": [
                            {
                                "color": $scope.segmentColors[0][i],
                                "label": (i + 1) + "CO2",
                                "value": currSegmentData.co2.min
                            }
                        ]
                    },
                    {
                        "key": "Average",
                        "values": [
                            {
                                color: $scope.segmentColors[1][i],
                                "label": (i + 1) + "",
                                "value": currSegmentData.co2.avg
                            }
                        ]
                    },
                    {
                        "key": "Maximum",
                        "values": [
                            {
                                color: $scope.segmentColors[2][i],
                                "label": (i + 1) + "",
                                "value": currSegmentData.co2.max
                            }
                        ]
                    }
                ];
                $scope.dataAll.push(
                        exampledata
                        );
            }
            ;
            $scope.options_community.chart.height = 600 / $scope.numberSegments;
            $scope.onload_community_data = true;
            $scope.onload_data = true;
            $timeout(function () {
                window.dispatchEvent(new Event('resize'));
                $timeout(function () {
                    window.dispatchEvent(new Event('resize'));
                }, 200);
            }, 100);
        };
        var drawEvents = leafletDrawEvents.getAvailableEvents();
        var handle = {
            created: function (e, leafletEvent, leafletObject, model, modelName) {
                var layerDrawn = leafletEvent.layer;
                var lineString = [];
                var layer = layerDrawn._latlngs;
                for (var i = 0; i < layer.length; i++) {
                    lineString.push(
                            [layer[i].lng, layer[i].lat]
                            );
                }
                $scope.data.geometry.coordinates = lineString;
                $scope.onload_community_data = false;
                StatisticsService.getSegmentAnalysis($scope.data).then(
                        function (data) {
                            loadCharts(data.data.features);
                        }, function (error) {
                    console.log("Error: " + error);
                });
                // create single path objects from linestring:
                $scope.paths_community = [];
                for (var i = 0; i < lineString.length - 1; i++) {
                    var pathObj = {};
                    var this_lng = lineString[i][0];
                    var this_lat = lineString[i][1];
                    var next_lng = lineString[i + 1][0];
                    var next_lat = lineString[i + 1][1];
                    // create path object:
                    pathObj['weight'] = 8;
                    pathObj['opacity'] = 0.75;
                    pathObj['latlngs'] = [{
                            'lat': this_lat,
                            'lng': this_lng
                        }, {
                            'lat': next_lat,
                            'lng': next_lng
                        }];
                    pathObj['color'] = $scope.segmentColors[2][i];
                    $scope.paths_community['p' + (i)] = pathObj;
                }
            },
            edited: function (arg) {
                console.log("edited");
            },
            deleted: function (arg) {
                var layers;
                layers = arg.layers;
                drawnItems.removeLayer(layers);
            },
            drawstart: function (arg) {
                console.log("drawstart");
            },
            drawstop: function (arg) {
                console.log("drawstop");
            },
            editstart: function (arg) {
                console.log("editstart");
            },
            editstop: function (arg) {
                console.log("editstop");
            },
            deletestart: function (arg) {
                console.log("deletestart");
            },
            deletestop: function (arg) {
                console.log("deletestop");
            }
        };
        drawEvents.forEach(function (eventName) {
            $scope.$on('leafletDirectiveDraw.' + eventName, function (e, payload) {
                //{leafletEvent, leafletObject, model, modelName} = payload
                var leafletEvent, leafletObject, model, modelName; //destructuring not supported by chrome yet :(
                leafletEvent = payload.leafletEvent, leafletObject = payload.leafletObject, model = payload.model,
                        modelName = payload.modelName;
                handle[eventName.replace('draw:', '')](e, leafletEvent, leafletObject, model, modelName);
            });
        });
    }
    ;
    angular.module('enviroCar.community')
            .controller('CommunityCtrl', CommunityCtrl);
})();
