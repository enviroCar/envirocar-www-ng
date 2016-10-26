(function () {

    function ChartCtrl(
            $rootScope,
            $scope,
            $stateParams,
            $timeout,
            $translate,
            $element,
            $mdDialog,
            $mdMedia,
            TrackService,
            UserCredentialsService,
            PhenomenonService,
            leafletBoundsHelpers,
            trackAnalysisSettings) {
        $scope.$mdMedia = $mdMedia;
        var grey = '#737373';
        $rootScope.track_toolbar_fixed = false;
        $scope.slider = {
            minValue: 0,
            maxValue: 100,
            options: {
                floor: 0,
                ceil: 100,
                step: 1,
                draggableRange: true,
                getSelectionBarColor: function (value) {
                    return '#8cbf3f';
                },
                getPointerColor: function (value) {
                    return '#8cbf3f';
                },
                translate: function (value) {
                    return '<font color="white">' + value + '</font>';
                },
                id: 'slider1',
                onChange: function (id) {
                    $scope.changeSelectionRange($scope.slider.minValue, $scope.slider.maxValue);
                },
                onEnd: function (id) {
                    $scope.changeChartRange($scope.slider.minValue, $scope.slider.maxValue);
                    $rootScope.$broadcast('single_track_page:segment-changed', {'min': $scope.slider.minValue, 'max': $scope.slider.maxValue});
                }
            }
        };

        $scope.yellow_break = trackAnalysisSettings.yellow_break;
        $scope.red_break = trackAnalysisSettings.red_break;
        $scope.max_values = trackAnalysisSettings.max_values;
        $scope.errorColor = trackAnalysisSettings.errorColor;

        // on Range selection change:
        $scope.changeSelectionRange = function (start, end) {
            if (start === 0)
                start = 1;
            // grey-coloring the offrange part of the track:
            for (var index = 1; index < start; index++) {
                $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color'] = grey;
                $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['weight'] = 4;
            }
            
            // coloring the inrange part of the track:
            for (var index = start; index < end; index++) {
                if (data_global.data.features[index].properties.phenomenons[$scope.currentPhenomenon]) {
                    var value = data_global.data.features[index].properties.phenomenons[$scope.currentPhenomenon].value;
                    $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color']
                            = $scope.percentToRGB(
                                    $scope.yellow_break[$scope.currentPhenomenonIndex],
                                    $scope.red_break[$scope.currentPhenomenonIndex],
                                    $scope.max_values[$scope.currentPhenomenonIndex],
                                    value);
                } else {
                    $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color']
                            = $scope.errorColor;
                }
                $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['weight'] = 8;
            }
            
            // grey-coloring the offrange part of the track:
            var track_length = data_global.data.features.length - 1;
            for (var index = end; index <= track_length; index++) {
                $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color'] = grey;
                $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['weight'] = 4;
            }
        }
        ;

        $scope.changeChartRange = function (start, end) {
            // 1. redraw the new chart data:
            var temp_data_array = [
                {
                    key: $translate.instant('SPEED'),
                    values: [
                    ]
                },
                {
                    key: $translate.instant('CONSUMPTION'),
                    values: [
                    ]
                },
                {
                    key: $translate.instant('CO2'),
                    values: [
                    ]
                },
                {
                    key: $translate.instant('RPM'),
                    values: [
                    ]
                },
                {
                    key: $translate.instant('ENGINE_LOAD'),
                    values: [
                    ]
                }
            ];
            for (var phenomIndex = 0; phenomIndex < 5; phenomIndex++) {
                for (var index = 0; index < $scope.data_all[phenomIndex].values.length; index++) {
                    temp_data_array[phenomIndex].values[index] = $scope.data_all[phenomIndex].values[index];
                }
            }
            for (var index = 0; index < 5; index++) {
                temp_data_array[index].values = temp_data_array[index].values.slice(start, start + (end - start));
            }

            $scope.dataTrackChart[0] = temp_data_array[$scope.currentPhenomenonIndex];

            // 2. zoom to new selected track segment:
            if (start === 0)
                start = 1;
            var northeast = {
                lat: $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (start) ]['latlngs'][0].lat,
                lng: $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (start) ]['latlngs'][0].lng,
            };
            var southwest = {
                lat: $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (start) ]['latlngs'][0].lat,
                lng: $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (start) ]['latlngs'][0].lng,
            };

            for (var index = start + 1; index < end; index++) {
                var current_lat = $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['latlngs'][0].lat;
                if (current_lat > northeast.lat) {
                    northeast.lat = current_lat;
                }
                if (current_lat < southwest.lat) {
                    southwest.lat = current_lat;
                }
                var current_lng = $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['latlngs'][0].lng;
                if (current_lng > northeast.lng) {
                    northeast.lng = current_lng;
                }
                if (current_lng < southwest.lng) {
                    southwest.lng = current_lng;
                }
            }
            ;

            // zoom zo track segment:
            var padding_lat = (northeast.lat - southwest.lat) / 10;
            var padding_lng = (northeast.lng - southwest.lng) / 10;
            $scope.bounds = leafletBoundsHelpers.createBoundsFromArray([
                [northeast.lat + padding_lat, northeast.lng + padding_lng],
                [southwest.lat - padding_lat, southwest.lng - padding_lng]
            ]);
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

        // Scroll-fixing the single track analysis toolbar:
        $(window).scroll(function () {
            //console.log("Top-Scroll: " + $(window).scrollTop());
            ;
            if ($(window).scrollTop() > 300) {

                if (!$rootScope.track_toolbar_fixed) {
                    $('#track_toolbar').addClass('stuck_top');
                    $("#placeholder-toolbar-stp").css("min-height", "70px");
                    $("#placeholder-toolbar-stp").css("height", "70px");
                    $("#placeholder-toolbar-stp").css("max-height", "70px");
                    $rootScope.track_toolbar_fixed = true;
                    var width = document.getElementById('placeholder-left').offsetWidth;
                    var balance = 0;
                    if (width === 0) {
                        balance = 120;
                        $("#toolbar-ctrl-placeholder").css("min-width", "0px");
                        $("#toolbar-ctrl-placeholder").css("width", "0px");
                        $("#toolbar-ctrl-placeholder").css("max-width", "0px");
                    }
                    // TODO: remove after sidenav button include:
                    if ($scope.screenIsXS)
                        balance = balance - 60;

                    var innerWidth = window.innerWidth;
                    var tb_width = innerWidth - 2 * width - balance - 76;
                    $('#track_toolbar').css("width", tb_width + "px");

                    $timeout(function () {
                        window.dispatchEvent(new Event('resize'))
                    },
                            1);
                }
            } else {
                if ($rootScope.track_toolbar_fixed) {
                    $('#track_toolbar').removeClass('stuck_top');
                    $("#placeholder-toolbar-stp").css("min-height", "1px");
                    $("#placeholder-toolbar-stp").css("height", "1px");
                    $("#placeholder-toolbar-stp").css("max-height", "1px");
                    $rootScope.track_toolbar_fixed = false;
                    var width = document.getElementById('placeholder-left').offsetWidth;
                    if (width === 0) {
                        $("#toolbar-ctrl-placeholder").css("max-width", "120px");
                        $("#toolbar-ctrl-placeholder").css("width", "120px");
                        $("#toolbar-ctrl-placeholder").css("min-width", "120px");
                    }
                    $('#track_toolbar').css("width", "100%");
                    $timeout(function () {
                        window.dispatchEvent(new Event('resize'))
                    },
                            1);
                }
            }
        });
        $scope.trackid = $stateParams.trackid;
        $scope.onload_track_map = false;
        $scope.onload_track_chart = false;
        $scope.segmentActivated = false;
        $scope.currentPhenomenon = 'Speed';
        $scope.currentPhenomenonIndex = 0;
        // 0 - green; yellow_break - yellow; red_break - red; max_value --> black
        $scope.percentToRGB = function (yellow_break, red_break, max_value, value) {
            var r, g;
            if (value <= yellow_break) {
                r = Math.floor(255 * (value / yellow_break));
                g = 255;
            } else
            if (value <= red_break) {
                r = 255;
                g = Math.floor(255 * ((red_break - value) / (red_break - yellow_break)));
            } else
            if (value <= max_value) {
                r = Math.floor(255 * ((max_value - value) / (max_value - red_break)));
                g = 0;
            }
            return "rgb(" + r + "," + g + ",0)";
        };
        // scope: predefined legends:
        legend_all = [
            {
                // Speed:
                position: 'bottomright',
                colors: ['#00ff00',
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], $scope.yellow_break[0] / 2),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], $scope.yellow_break[0]),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], ($scope.yellow_break[0] + $scope.red_break[0]) / 2),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], $scope.red_break[0]),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], ($scope.red_break[0] + $scope.max_values[0]) / 2)],
                labels: ['  0 km/h',
                    ' ' + $scope.yellow_break[0] / 2 + ' km/h',
                    ' ' + $scope.yellow_break[0] + ' km/h',
                    ' ' + ($scope.yellow_break[0] + $scope.red_break[0]) / 2 + ' km/h',
                    ' ' + $scope.red_break[0] + ' km/h',
                    ' ' + ($scope.red_break[0] + $scope.max_values[0]) / 2 + ' km/h']
            }, {
                // Consumption:
                position: 'bottomright',
                colors: ['#00ff00',
                    $scope.percentToRGB($scope.yellow_break[1], $scope.red_break[1], $scope.max_values[1], $scope.yellow_break[1] / 2),
                    $scope.percentToRGB($scope.yellow_break[1], $scope.red_break[1], $scope.max_values[1], $scope.yellow_break[1]),
                    $scope.percentToRGB($scope.yellow_break[1], $scope.red_break[1], $scope.max_values[1], ($scope.yellow_break[1] + $scope.red_break[1]) / 2),
                    $scope.percentToRGB($scope.yellow_break[1], $scope.red_break[1], $scope.max_values[1], $scope.red_break[1]),
                    $scope.percentToRGB($scope.yellow_break[1], $scope.red_break[1], $scope.max_values[1], ($scope.red_break[1] + $scope.max_values[1]) / 2)],
                labels: [' 0 l/h',
                    ' ' + $scope.yellow_break[1] / 2 + ' l/h',
                    ' ' + $scope.yellow_break[1] + ' l/h',
                    ' ' + ($scope.yellow_break[1] + $scope.red_break[1]) / 2 + ' l/h',
                    ' ' + $scope.red_break[1] + ' l/h',
                    ' ' + ($scope.red_break[1] + $scope.max_values[1]) / 2 + ' l/h']
            }, {
                // CO2:
                position: 'bottomright',
                colors: ['#00ff00',
                    $scope.percentToRGB($scope.yellow_break[2], $scope.red_break[2], $scope.max_values[2], $scope.yellow_break[2] / 2),
                    $scope.percentToRGB($scope.yellow_break[2], $scope.red_break[2], $scope.max_values[2], $scope.yellow_break[2]),
                    $scope.percentToRGB($scope.yellow_break[2], $scope.red_break[2], $scope.max_values[2], ($scope.yellow_break[2] + $scope.red_break[2]) / 2),
                    $scope.percentToRGB($scope.yellow_break[2], $scope.red_break[2], $scope.max_values[2], $scope.red_break[2]),
                    $scope.percentToRGB($scope.yellow_break[2], $scope.red_break[2], $scope.max_values[2], ($scope.red_break[2] + $scope.max_values[2]) / 2)],
                labels: [' 0 kg/h',
                    ' ' + $scope.yellow_break[2] / 2 + ' kg/h',
                    ' ' + $scope.yellow_break[2] + ' kg/h',
                    ' ' + ($scope.yellow_break[2] + $scope.red_break[2]) / 2 + ' kg/h',
                    ' ' + $scope.red_break[2] + ' kg/h',
                    ' ' + ($scope.red_break[2] + $scope.max_values[2]) / 2 + ' kg/h']
            }, {
                // RPM:
                position: 'bottomright',
                colors: ['#00ff00',
                    $scope.percentToRGB($scope.yellow_break[3], $scope.red_break[3], $scope.max_values[3], $scope.yellow_break[3] / 2),
                    $scope.percentToRGB($scope.yellow_break[3], $scope.red_break[3], $scope.max_values[3], $scope.yellow_break[3]),
                    $scope.percentToRGB($scope.yellow_break[3], $scope.red_break[3], $scope.max_values[3], ($scope.yellow_break[3] + $scope.red_break[3]) / 2),
                    $scope.percentToRGB($scope.yellow_break[3], $scope.red_break[3], $scope.max_values[3], $scope.red_break[3]),
                    $scope.percentToRGB($scope.yellow_break[3], $scope.red_break[3], $scope.max_values[3], ($scope.red_break[3] + $scope.max_values[3]) / 2)],
                labels: ['   0 r/min',
                    ' ' + $scope.yellow_break[3] / 2 + ' r/min',
                    ' ' + $scope.yellow_break[3] + ' r/min',
                    ' ' + ($scope.yellow_break[3] + $scope.red_break[3]) / 2 + ' r/min',
                    ' ' + $scope.red_break[3] + ' r/min',
                    ' ' + ($scope.red_break[3] + $scope.max_values[3]) / 2 + ' r/min']
            }, {
                // Engine Load:
                position: 'bottomright',
                colors: ['#00ff00',
                    $scope.percentToRGB($scope.yellow_break[4], $scope.red_break[4], $scope.max_values[4], $scope.yellow_break[4] / 2),
                    $scope.percentToRGB($scope.yellow_break[4], $scope.red_break[4], $scope.max_values[4], $scope.yellow_break[4]),
                    $scope.percentToRGB($scope.yellow_break[4], $scope.red_break[4], $scope.max_values[4], ($scope.yellow_break[4] + $scope.red_break[4]) / 2),
                    $scope.percentToRGB($scope.yellow_break[4], $scope.red_break[4], $scope.max_values[4], $scope.red_break[4]),
                    $scope.percentToRGB($scope.yellow_break[4], $scope.red_break[4], $scope.max_values[4], ($scope.red_break[4] + $scope.max_values[4]) / 2)],
                labels: ['  0 %',
                    ' ' + $scope.yellow_break[4] / 2 + ' %',
                    ' ' + $scope.yellow_break[4] + ' %',
                    ' ' + ($scope.yellow_break[4] + $scope.red_break[4]) / 2 + ' %',
                    ' ' + $scope.red_break[4] + ' %',
                    ' ' + ($scope.red_break[4] + $scope.max_values[4]) / 2 + ' %']
            }
        ];
        // scope extension for the leaflet map:
        angular.extend($scope, {
            paths: {},
            bounds: {},
            maxbounds: {},
            markers: {
                ClickedPosition: {
                },
                HoveredPosition: {
                }
            },
            layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                        ,
                        layerParams: {
                            minZoom: 5
                        }
                    }
                }
            },
            legend: {// Speed by default:
                position: 'bottomright',
                colors: ['#00ff00',
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], $scope.yellow_break[0] / 2),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], $scope.yellow_break[0]),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], ($scope.yellow_break[0] + $scope.red_break[0]) / 2),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], $scope.red_break[0]),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], ($scope.red_break[0] + $scope.max_values[0]) / 2)],
                labels: ['  0 km/h',
                    ' ' + $scope.yellow_break[0] / 2 + ' km/h',
                    ' ' + $scope.yellow_break[0] + ' km/h',
                    ' ' + ($scope.yellow_break[0] + $scope.red_break[0]) / 2 + ' km/h',
                    ' ' + $scope.red_break[0] + ' km/h',
                    ' ' + ($scope.red_break[0] + $scope.max_values[0]) / 2 + ' km/h']
            },
            events: {
                paths: {
                    enable: ['click'],
                    logic: 'emit'
                }
            }
        });
        $scope.$on('toolbar:language-changed', function (event, args) {
            //1. translate
            $scope.data_all[0].key = $translate.instant('SPEED');
            $scope.data_all[1].key = $translate.instant('CONSUMPTION');
            $scope.data_all[2].key = $translate.instant('CO2');
            $scope.data_all[3].key = $translate.instant('RPM');
            $scope.data_all[4].key = $translate.instant('ENGINE_LOAD');
            //2. set previous selected phenomenon
            $scope.dataTrackChart[0] = $scope.data_all[$scope.currentPhenomenonIndex];
            //3. set previous selected selection range
            if ($scope.segmentActivated) {
                $scope.changeSelectionRange($scope.slider.minValue, $scope.slider.maxValue);
                $scope.changeChartRange($scope.slider.minValue, $scope.slider.maxValue);
            } else {
                $scope.changeSelectionRange(0, $scope.slider.options.ceil);
                $scope.changeChartRange(0, $scope.slider.options.ceil);
            }
        });
        $scope.$on('leafletDirectivePath.click', function (event, path) {
            //path.modelname
            $scope.clickedXPoint = parseInt(path.modelName.substring(1));
            $scope.showMeasurementX();
        });
        $scope.$on('track-toolbar:phenomenon-changed', function (event, args) {
            $scope.currentPhenomenon = args;
            switch ($scope.currentPhenomenon) {
                case 'Speed':
                    $scope.dataTrackChart[0] = $scope.data_all[0];
                    $scope.paths = $scope.paths_all[0];
                    $scope.legend = legend_all[0];
                    $scope.currentPhenomenonIndex = 0;
                    PhenomenonService.setPhenomenon('Speed', 0);
                    break;
                case 'Consumption':
                    $scope.dataTrackChart[0] = $scope.data_all[1];
                    $scope.paths = $scope.paths_all[1];
                    $scope.legend = legend_all[1];
                    $scope.currentPhenomenonIndex = 1;
                    PhenomenonService.setPhenomenon('Consumption', 1);
                    break;
                case 'CO2':
                    $scope.paths = $scope.paths_all[2];
                    $scope.dataTrackChart[0] = $scope.data_all[2];
                    $scope.legend = legend_all[2];
                    $scope.currentPhenomenonIndex = 2;
                    PhenomenonService.setPhenomenon('CO2', 2);
                    break;
                case 'Rpm':
                    $scope.dataTrackChart[0] = $scope.data_all[3];
                    $scope.paths = $scope.paths_all[3];
                    $scope.legend = legend_all[3];
                    $scope.currentPhenomenonIndex = 3;
                    PhenomenonService.setPhenomenon('Rpm', 3);
                    break;
                case 'Engine Load':
                    $scope.dataTrackChart[0] = $scope.data_all[4];
                    $scope.paths = $scope.paths_all[4];
                    $scope.legend = legend_all[4];
                    $scope.currentPhenomenonIndex = 4;
                    PhenomenonService.setPhenomenon('Engine Load', 4);
                    break;
            }
            if ($scope.segmentActivated) {
                $scope.changeSelectionRange($scope.slider.minValue, $scope.slider.maxValue);
                $scope.changeChartRange($scope.slider.minValue, $scope.slider.maxValue);
            } else {
                $scope.changeSelectionRange(0, $scope.slider.options.ceil);
                $scope.changeChartRange(0, $scope.slider.options.ceil);
            }
        });
        // chart options for the nvd3 line with focus chart:
        $scope.clickedXPoint = 0;
        $scope.hoveredXPoint = 0;
        $scope.optionsTrackChart = {
            chart: {
                type: 'lineWithFocusChart',
                height: 480,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 20,
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
                x2Axis: {
                    tickFormat: function (d) {
                        return d3.format(',f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function (d) {
                        var y;
                        if ($scope.currentPhenomenonIndex === 3) {
                            y = d.toFixed(0);
                        } else {
                            y = d3.format(',.2f')(d);
                        }
                        return y;
                    },
                    rotateYLabel: false
                },
                y2Axis: {
                    tickFormat: function (d) {
                        return d3.format(',.2f')(d);
                    }
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
                        },
                        onBrush: function (e) {
                            console.log(e);
                        }
                    }
                }
            }
        };

        // toggle Segment analysis:
        $scope.toggleSegmentAnalysis = function (model) {
            $scope.segmentActivated = !$scope.segmentActivated;

            if ($scope.segmentActivated) {
                $scope.changeSelectionRange($scope.slider.minValue, $scope.slider.maxValue);
                $scope.changeChartRange($scope.slider.minValue, $scope.slider.maxValue);
            } else {
                $scope.changeSelectionRange(0, $scope.slider.options.ceil);
                $scope.changeChartRange(0, $scope.slider.options.ceil);
            }
            $rootScope.$broadcast('single_track_page:segment-activated', $scope.segmentActivated);

            $timeout(function () {
                window.dispatchEvent(new Event('resize'));
            },
                    50);
            $timeout(function () {
                window.dispatchEvent(new Event('resize'));
            },
                    100);
        };
        // to be filled with server query:
        $scope.data_all = [
            {
                key: $translate.instant('SPEED'),
                values: [
                ]
            },
            {
                key: $translate.instant('CONSUMPTION'),
                values: [
                ]
            },
            {
                key: $translate.instant('CO2'),
                values: [
                ]
            },
            {
                key: $translate.instant('RPM'),
                values: [
                ]
            },
            {
                key: $translate.instant('ENGINE_LOAD'),
                values: [
                ]
            }
        ];
        $scope.paths_all = [
            {p1: 0},
            {p1: 0},
            {p1: 0},
            {p1: 0},
            {p1: 0}
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
                    focus: true
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
                    data_global = data;
                    // set slider ranges:
                    $scope.slider.maxValue = data_global.data.features.length;
                    $scope.slider.options.ceil = data_global.data.features.length;
                    // ask for each phenom, if track contains it's data:
                    var phenomsJSON = {};
                    if (data_global.data.features[0].properties.phenomenons['Speed'])
                        phenomsJSON['Speed'] = true;
                    if (data_global.data.features[0].properties.phenomenons['Consumption'])
                        phenomsJSON['Consumption'] = true;
                    if (data_global.data.features[0].properties.phenomenons['CO2'])
                        phenomsJSON['CO2'] = true;
                    if (data_global.data.features[0].properties.phenomenons['Rpm'])
                        phenomsJSON['Rpm'] = true;
                    if (data_global.data.features[0].properties.phenomenons['Engine Load'])
                        phenomsJSON['Engine Load'] = true;
                    $scope.name = data.data.properties.name;
                    $scope.created = data.data.properties.created;
                    // max bounds of the track:
                    var northeast = {
                        'lat': -1000,
                        'lng': 1000
                    };
                    var southwest = {
                        'lat': 1000,
                        'lng': -1000
                    };


                    // iterating through each measurement:
                    var speedMeasurement;
                    var consumptionMeasurement;
                    var co2Measurement;
                    var rpmMeasurement;
                    var engineLoadMeasurement;

                    // save measurements for each phenomenon:
                    for (var index = 0; index < data_global.data.features.length; index++) {
                        var pathObjSpeed = {};
                        var pathObjConsumption = {};
                        var pathObjCO2 = {};
                        var pathObjRPM = {};
                        var pathObjEngine_load = {};
                        // get coords:
                        var lat_coord = data_global.data.features[index].geometry.coordinates[1];
                        var lon_coord = data_global.data.features[index].geometry.coordinates[0];
                        if (northeast.lat < lat_coord)
                            northeast.lat = lat_coord;
                        if (northeast.lng > lon_coord)
                            northeast.lng = lon_coord;
                        if (southwest.lat > lat_coord)
                            southwest.lat = lat_coord;
                        if (southwest.lng < lon_coord)
                            southwest.lng = lon_coord;
                        // path width:
                        pathObjSpeed['weight'] = 8;
                        pathObjConsumption['weight'] = 8;
                        pathObjCO2['weight'] = 8;
                        pathObjRPM['weight'] = 8;
                        pathObjEngine_load['weight'] = 8;
                        // path coordinates:
                        if (index > 0)
                            pathObjSpeed['latlngs'] = [{
                                    'lat': data_global.data.features[index - 1].geometry.coordinates[1],
                                    'lng': data_global.data.features[index - 1].geometry.coordinates[0]
                                }, {
                                    'lat': lat_coord,
                                    'lng': lon_coord
                                }];
                        pathObjConsumption['latlngs'] = pathObjSpeed['latlngs'];
                        pathObjCO2['latlngs'] = pathObjSpeed['latlngs'];
                        pathObjRPM['latlngs'] = pathObjSpeed['latlngs'];
                        pathObjEngine_load['latlngs'] = pathObjSpeed['latlngs'];
                        // get the phenomenon's value and interpolate a color value from it:

                        if (data_global.data.features[index].properties.phenomenons.Speed) {
                            var value_speed = data_global.data.features[index].properties.phenomenons.Speed.value;
                            phenomsJSON['Speed'] = true;
                            pathObjSpeed['color'] = $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], value_speed);               //more information at percentToRGB().
                            speedMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Speed.value};
                        } else {
                            pathObjSpeed['color'] = $scope.errorColor;
                            speedMeasurement = {x: index, y: undefined};
                        }

                        if (data_global.data.features[index].properties.phenomenons.Consumption) {
                            var value_consumption = data_global.data.features[index].properties.phenomenons.Consumption.value;
                            phenomsJSON['Consumption'] = true;
                            pathObjConsumption['color'] = $scope.percentToRGB($scope.yellow_break[1], $scope.red_break[1], $scope.max_values[1], value_consumption);   //more information at percentToRGB().
                            consumptionMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Consumption.value};
                        } else {
                            pathObjConsumption['color'] = $scope.errorColor;
                            consumptionMeasurement = {x: index, y: undefined};
                        }

                        if (data_global.data.features[index].properties.phenomenons.CO2) {
                            var value_CO2 = data_global.data.features[index].properties.phenomenons.CO2.value;
                            phenomsJSON['CO2'] = true;
                            pathObjCO2['color'] = $scope.percentToRGB($scope.yellow_break[2], $scope.red_break[2], $scope.max_values[2], value_CO2);                   //more information at percentToRGB().
                            co2Measurement = {x: index, y: data_global.data.features[index].properties.phenomenons.CO2.value};
                        } else {
                            pathObjCO2['color'] = $scope.errorColor;
                            co2Measurement = {x: index, y: undefined};
                        }

                        if (data_global.data.features[index].properties.phenomenons.Rpm) {
                            var value_RPM = data_global.data.features[index].properties.phenomenons.Rpm.value;
                            phenomsJSON['Rpm'] = true;
                            pathObjRPM['color'] = $scope.percentToRGB($scope.yellow_break[3], $scope.red_break[3], $scope.max_values[3], value_RPM);                   //more information at percentToRGB().
                            rpmMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Rpm.value};
                        } else {
                            rpmMeasurement = {x: index, y: undefined};
                            pathObjRPM['color'] = $scope.errorColor;
                        }

                        if (data_global.data.features[index].properties.phenomenons["Engine Load"]) {
                            var value_EngineLoad = data_global.data.features[index].properties.phenomenons["Engine Load"].value;
                            phenomsJSON['Engine Load'] = true;
                            pathObjEngine_load['color'] = $scope.percentToRGB($scope.yellow_break[4], $scope.red_break[4], $scope.max_values[4], value_EngineLoad);    //more information at percentToRGB().
                            engineLoadMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons['Engine Load'].value};
                        } else {
                            pathObjEngine_load['color'] = $scope.errorColor;
                            engineLoadMeasurement = {x: index, y: undefined};
                        }

                        // enqueue pathObjects for each phenomenon to phenomPath:
                        if (index > 0) {
                            $scope.paths_all[0]['p' + (index)] = pathObjSpeed;
                            $scope.paths_all[1]['p' + (index)] = pathObjConsumption;
                            $scope.paths_all[2]['p' + (index)] = pathObjCO2;
                            $scope.paths_all[3]['p' + (index)] = pathObjRPM;
                            $scope.paths_all[4]['p' + (index)] = pathObjEngine_load;
                            // add 'speed'-path as default overlay to leaflet map:
                            $scope.paths['p' + (index)] = pathObjSpeed;
                        }
                        // save all data:
                        $scope.data_all[0].values.push(speedMeasurement);
                        $scope.data_all[1].values.push(consumptionMeasurement);
                        $scope.data_all[2].values.push(co2Measurement);
                        $scope.data_all[3].values.push(rpmMeasurement);
                        $scope.data_all[4].values.push(engineLoadMeasurement);
                    }
                    $rootScope.$broadcast('single_track_page:phenomenons-available', phenomsJSON);


                    // save 'speed'-data as default into time series chart 
                    $scope.dataTrackChart[0] = $scope.data_all[0];
                    // zoom map to track:
                    var padding_lat = (northeast.lat - southwest.lat) / 10;
                    var padding_lng = (northeast.lng - southwest.lng) / 10;
                    $scope.bounds = leafletBoundsHelpers.createBoundsFromArray([
                        [northeast.lat + padding_lat, northeast.lng + padding_lng],
                        [southwest.lat - padding_lat, southwest.lng - padding_lng]
                    ]);
                    // restrict panning with padding:
                    var delta_lat = Math.abs(northeast.lat - southwest.lat) / 2;
                    var delta_lng = Math.abs(northeast.lng - southwest.lng) / 2;

                    $scope.maxBounds = leafletBoundsHelpers.createBoundsFromArray([
                        [northeast.lat + delta_lat, northeast.lng - delta_lng],
                        [southwest.lat - delta_lat, southwest.lng + delta_lng]
                    ]);


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
    angular.module('enviroCar.track')
            .controller('ChartCtrl', ChartCtrl);
})();