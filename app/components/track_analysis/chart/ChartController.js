(function () {

    function ChartCtrl(
            $rootScope,
            $scope,
            $state,
            $stateParams,
            $timeout,
            $translate,
            $mdDialog,
            $mdMedia,
            TrackService,
            UserCredentialsService,
            PhenomenonService,
            leafletBoundsHelpers,
            trackAnalysisSettings) {

        $scope.downloadTrack = function () {
            window.location.href = "http://envirocar.org/api/stable/tracks/" + $scope.trackid;
        };

        $scope.goToDashboard = function () {
            //redirect to the track analytics page.
            $state.go('dashboard', {
            });
        };

        $scope.$mdMedia = $mdMedia;
        $scope.markerBlue = {
            iconUrl: 'app/components/assets/marker-icon.png',
            shadowUrl: 'app/components/assets/marker-shadow.png',
            iconSize: [30, 40], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [15, 39], // point of the icon which will correspond to marker's location
            shadowAnchor: [20, 62], // the same for the shadow
        };
        $scope.markerGreen = {
            iconUrl: 'app/components/assets/marker-icon-green.png',
            shadowUrl: 'app/components/assets/marker-shadow.png',
            iconSize: [30, 40], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [15, 39], // point of the icon which will correspond to marker's location
            shadowAnchor: [20, 62], // the same for the shadow
        };
        var grey = '#737373';
        $rootScope.track_toolbar_fixed = false;
        $scope.timestamps = [
        ];
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
                    return '<font color="white">' + $scope.timestamps[value] + '</font>';
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
        $scope.errorColorTrans = trackAnalysisSettings.errorColorTransparent;
        $scope.opacity = trackAnalysisSettings.opacity;

        $scope.highlightedInterval = false;
        $scope.intervalStart;
        $scope.intervalEnd;

        // on Range selection change:
        $scope.changeSelectionRange = function (start, end) {
            if (start === 0)
                start = 1;
            // redraw paths:
            // grey-coloring the offrange part of the track:
            for (var index = 1; index <= start; index++) {
                $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color'] = grey;
                $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['weight'] = 4;
            }

            // coloring the inrange part of the track:
            for (var index = start + 1; index <= end; index++) {
                if (data_global.data.features[index].properties.phenomenons[$scope.currentPhenomenon] !== undefined) {
                    var value = data_global.data.features[index].properties.phenomenons[$scope.currentPhenomenon].value;

                    // value not within selected interval? --> opacity.
                    if ((value < $scope.intervalStart) || (value > $scope.intervalEnd)) {
                        // set other color::
                        $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color']
                                = $scope.percentToRGB(
                                        $scope.yellow_break[$scope.currentPhenomenonIndex],
                                        $scope.red_break[$scope.currentPhenomenonIndex],
                                        $scope.max_values[$scope.currentPhenomenonIndex],
                                        value, $scope.opacity);
                        $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['weight'] = 5;
                    } else {
                        $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color']
                                = $scope.percentToRGB(
                                        $scope.yellow_break[$scope.currentPhenomenonIndex],
                                        $scope.red_break[$scope.currentPhenomenonIndex],
                                        $scope.max_values[$scope.currentPhenomenonIndex],
                                        value, 1);
                        $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['weight'] = 8;
                    }
                } else {
                    if ($scope.highlightedInterval) {
                        $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color']
                                = $scope.errorColorTrans;
                        $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['weight'] = 5;
                    } else {
                        $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color']
                                = $scope.errorColor;
                        $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['weight'] = 8;
                    }
                }
            }

            // grey-coloring the offrange part of the track:
            var track_length = data_global.data.features.length - 1;
            for (var index = end + 1; index <= track_length; index++) {
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
                },
                {
                    key: $translate.instant('GPS_SPEED'),
                    values: [
                    ]
                }
            ];
            for (var phenomIndex = 0; phenomIndex < 6; phenomIndex++) {
                for (var index = 0; index < $scope.data_all[phenomIndex].values.length; index++) {
                    temp_data_array[phenomIndex].values[index] = $scope.data_all[phenomIndex].values[index];
                }
            }
            for (var index = 0; index < 6; index++) {
                temp_data_array[index].values = temp_data_array[index].values.slice(start, start + (end - start) + 1);
            }

            $scope.dataTrackChart[0] = temp_data_array[$scope.currentPhenomenonIndex];

            // 2. zoom to new selected track segment:
            start = start + 1;
            var northeast = {
                lat: $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (start) ]['latlngs'][0].lat,
                lng: $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (start) ]['latlngs'][0].lng,
            };
            var southwest = {
                lat: $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (start) ]['latlngs'][0].lat,
                lng: $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (start) ]['latlngs'][0].lng,
            };

            for (var index = start + 1; index <= end; index++) {
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

            // last end index as well:
            var current_lat = $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (end) ]['latlngs'][1].lat;
            if (current_lat > northeast.lat) {
                northeast.lat = current_lat;
            }
            if (current_lat < southwest.lat) {
                southwest.lat = current_lat;
            }
            var current_lng = $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (end) ]['latlngs'][1].lng;
            if (current_lng > northeast.lng) {
                northeast.lng = current_lng;
            }
            if (current_lng < southwest.lng) {
                southwest.lng = current_lng;
            }

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
                        window.dispatchEvent(new Event('resize'));
                    },
                            1);
                }
            }
        });
        $scope.trackid = $stateParams.trackid;
        $scope.created = "";
        $scope.onload_track_map = false;
        $scope.onload_track_chart = false;
        $scope.segmentActivated = false;
        // FIXME: Speed not always awaylable and cannot be the default anymore.
        $scope.currentPhenomenon = 'Speed';
        $scope.currentPhenomenonIndex = 0;
        $scope.intervalStart = 0;
        $scope.intervalEnd = $scope.max_values[$scope.currentPhenomenonIndex];

        // 0 - green; yellow_break - yellow; red_break - red; max_value --> black
        $scope.percentToRGB = function (yellow_break, red_break, max_value, value, opacity) {
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
            return "rgba(" + r + "," + g + ",0," + opacity + ")";
        };
        // scope: predefined legends:
        legend_all = [
            {
                // Speed:
                position: 'bottomright',
                colors: ['#00ff00',
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], $scope.yellow_break[0] / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], $scope.yellow_break[0], 1),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], ($scope.yellow_break[0] + $scope.red_break[0]) / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], $scope.red_break[0], 1),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], ($scope.red_break[0] + $scope.max_values[0]) / 2, 1)],
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
                    $scope.percentToRGB($scope.yellow_break[1], $scope.red_break[1], $scope.max_values[1], $scope.yellow_break[1] / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[1], $scope.red_break[1], $scope.max_values[1], $scope.yellow_break[1], 1),
                    $scope.percentToRGB($scope.yellow_break[1], $scope.red_break[1], $scope.max_values[1], ($scope.yellow_break[1] + $scope.red_break[1]) / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[1], $scope.red_break[1], $scope.max_values[1], $scope.red_break[1], 1),
                    $scope.percentToRGB($scope.yellow_break[1], $scope.red_break[1], $scope.max_values[1], ($scope.red_break[1] + $scope.max_values[1]) / 2, 1)],
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
                    $scope.percentToRGB($scope.yellow_break[2], $scope.red_break[2], $scope.max_values[2], $scope.yellow_break[2] / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[2], $scope.red_break[2], $scope.max_values[2], $scope.yellow_break[2], 1),
                    $scope.percentToRGB($scope.yellow_break[2], $scope.red_break[2], $scope.max_values[2], ($scope.yellow_break[2] + $scope.red_break[2]) / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[2], $scope.red_break[2], $scope.max_values[2], $scope.red_break[2], 1),
                    $scope.percentToRGB($scope.yellow_break[2], $scope.red_break[2], $scope.max_values[2], ($scope.red_break[2] + $scope.max_values[2]) / 2, 1)],
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
                    $scope.percentToRGB($scope.yellow_break[3], $scope.red_break[3], $scope.max_values[3], $scope.yellow_break[3] / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[3], $scope.red_break[3], $scope.max_values[3], $scope.yellow_break[3], 1),
                    $scope.percentToRGB($scope.yellow_break[3], $scope.red_break[3], $scope.max_values[3], ($scope.yellow_break[3] + $scope.red_break[3]) / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[3], $scope.red_break[3], $scope.max_values[3], $scope.red_break[3], 1),
                    $scope.percentToRGB($scope.yellow_break[3], $scope.red_break[3], $scope.max_values[3], ($scope.red_break[3] + $scope.max_values[3]) / 2, 1)],
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
                    $scope.percentToRGB($scope.yellow_break[4], $scope.red_break[4], $scope.max_values[4], $scope.yellow_break[4] / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[4], $scope.red_break[4], $scope.max_values[4], $scope.yellow_break[4], 1),
                    $scope.percentToRGB($scope.yellow_break[4], $scope.red_break[4], $scope.max_values[4], ($scope.yellow_break[4] + $scope.red_break[4]) / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[4], $scope.red_break[4], $scope.max_values[4], $scope.red_break[4], 1),
                    $scope.percentToRGB($scope.yellow_break[4], $scope.red_break[4], $scope.max_values[4], ($scope.red_break[4] + $scope.max_values[4]) / 2, 1)],
                labels: ['  0 %',
                    ' ' + $scope.yellow_break[4] / 2 + ' %',
                    ' ' + $scope.yellow_break[4] + ' %',
                    ' ' + ($scope.yellow_break[4] + $scope.red_break[4]) / 2 + ' %',
                    ' ' + $scope.red_break[4] + ' %',
                    ' ' + ($scope.red_break[4] + $scope.max_values[4]) / 2 + ' %']
            },
            {
                // GPS Speed:
                position: 'bottomright',
                colors: ['#00ff00',
                    $scope.percentToRGB($scope.yellow_break[5], $scope.red_break[5], $scope.max_values[5], $scope.yellow_break[5] / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[5], $scope.red_break[5], $scope.max_values[5], $scope.yellow_break[5], 1),
                    $scope.percentToRGB($scope.yellow_break[5], $scope.red_break[5], $scope.max_values[5], ($scope.yellow_break[5] + $scope.red_break[5]) / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[5], $scope.red_break[5], $scope.max_values[5], $scope.red_break[5], 1),
                    $scope.percentToRGB($scope.yellow_break[5], $scope.red_break[5], $scope.max_values[5], ($scope.red_break[5] + $scope.max_values[5]) / 2, 1)],
                labels: ['  0 km/h',
                    ' ' + $scope.yellow_break[5] / 2 + ' km/h',
                    ' ' + $scope.yellow_break[5] + ' km/h',
                    ' ' + ($scope.yellow_break[5] + $scope.red_break[5]) / 2 + ' km/h',
                    ' ' + $scope.red_break[5] + ' km/h',
                    ' ' + ($scope.red_break[5] + $scope.max_values[5]) / 2 + ' km/h']
            }
        ];

        // scope extension for the leaflet map:
        angular.extend($scope, {
            paths: {},
            bounds: {},
            maxbounds: {},
            markers: {
                ClickedPosition: {
                    'lat': -1000,
                    'lng': -1000,
                    focus: false,
                    icon: $scope.markerGreen
                },
                HoveredPosition: {
                    'lat': -1000,
                    'lng': -1000,
                    focus: false,
                    icon: $scope.markerBlue
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
            // FIXME: Speed is no more the default available phenomenon.
            legend: {// Speed by default:
                legendClass: "info legend",
                position: 'bottomright',
                colors: ['#00ff00',
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], $scope.yellow_break[0] / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], $scope.yellow_break[0], 1),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], ($scope.yellow_break[0] + $scope.red_break[0]) / 2, 1),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], $scope.red_break[0], 1),
                    $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], ($scope.red_break[0] + $scope.max_values[0]) / 2, 1)],
                labels: ['  0 km/h',
                    ' ' + $scope.yellow_break[0] / 2 + ' km/h',
                    ' ' + $scope.yellow_break[0] + ' km/h',
                    ' ' + ($scope.yellow_break[0] + $scope.red_break[0]) / 2 + ' km/h',
                    ' ' + $scope.red_break[0] + ' km/h',
                    ' ' + ($scope.red_break[0] + $scope.max_values[0]) / 2 + ' km/h']
            },
            events: {
                paths: {
                    enable: ['click', 'mouseover'],
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
            $scope.data_all[5].key = $translate.instant('GPS_SPEED');
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

        $scope.highlightInterval = function (interval_low, interval_high) {
            var start;  // start of slider selected focused segment
            var end;    // end of slider selected focused segment
            if ($scope.segmentActivated) {
                start = $scope.slider.minValue;
                end = $scope.slider.maxValue;
            } else {
                start = 1;
                end = $scope.slider.options.ceil;
            }
            if (start === 0)
                start = 1;

            // redraw paths:
            // grey-coloring the offrange part of the track:
            for (var index = 1; index < start; index++) {
                $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color'] = grey;
                $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['weight'] = 4;
            }

            // coloring the inrange part of the track:
            for (var index = start; index < end; index++) {
                if (data_global.data.features[index].properties.phenomenons[$scope.currentPhenomenon] !== undefined) {
                    var value = data_global.data.features[index].properties.phenomenons[$scope.currentPhenomenon].value;

                    // value not within selected interval? --> opacity.
                    if ((value < interval_low) || (value > interval_high)) {
                        // set other color::
                        $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color']
                                = $scope.percentToRGB(
                                        $scope.yellow_break[$scope.currentPhenomenonIndex],
                                        $scope.red_break[$scope.currentPhenomenonIndex],
                                        $scope.max_values[$scope.currentPhenomenonIndex],
                                        value,
                                        $scope.opacity);
                        $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['weight'] = 5;
                    } else {
                        $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color']
                                = $scope.percentToRGB(
                                        $scope.yellow_break[$scope.currentPhenomenonIndex],
                                        $scope.red_break[$scope.currentPhenomenonIndex],
                                        $scope.max_values[$scope.currentPhenomenonIndex],
                                        value,
                                        1);
                        $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['weight'] = 8;
                    }
                } else {
                    if ($scope.highlightedInterval) {
                        $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color']
                                = $scope.errorColorTrans;
                        $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['weight'] = 5;
                    } else {
                        $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color']
                                = $scope.errorColor;
                        $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['weight'] = 8;
                    }
                }
            }

            // grey-coloring the offrange part of the track:
            var track_length = data_global.data.features.length - 1;
            for (var index = end; index <= track_length; index++) {
                $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['color'] = grey;
                $scope.paths_all[$scope.currentPhenomenonIndex]['p' + (index) ]['weight'] = 4;
            }

        };

        var lastInterval = 5;
        $scope.$on('single_track_page:interval-clicked', function (event, args) {
            var low;
            var high;
            switch (args) {
                case 0:
                    low = 0;
                    high = 0;
                    break;
                case 1:
                    low = 0;
                    high = $scope.yellow_break[$scope.currentPhenomenonIndex] / 2;
                    break;
                case 2:
                    low = $scope.yellow_break[$scope.currentPhenomenonIndex] / 2;
                    high = $scope.yellow_break[$scope.currentPhenomenonIndex];
                    break;
                case 3:
                    low = $scope.yellow_break[$scope.currentPhenomenonIndex];
                    high = ($scope.yellow_break[$scope.currentPhenomenonIndex] + $scope.red_break[$scope.currentPhenomenonIndex]) / 2;
                    break;
                case 4:
                    low = ($scope.yellow_break[$scope.currentPhenomenonIndex] + $scope.red_break[$scope.currentPhenomenonIndex]) / 2;
                    high = $scope.red_break[$scope.currentPhenomenonIndex];
                    break;
                case 5:
                    low = $scope.red_break[$scope.currentPhenomenonIndex];
                    high = $scope.max_values[$scope.currentPhenomenonIndex];
                    break;
            }
            ;

            if (lastInterval === args) {
                $scope.highlightedInterval = !$scope.highlightedInterval;
                if ($scope.highlightedInterval) {
                    $scope.highlightInterval(low, high);
                    $scope.intervalStart = low;
                    $scope.intervalEnd = high;
                } else {
                    $scope.highlightInterval(0, $scope.max_values[$scope.currentPhenomenonIndex]);
                    $scope.intervalStart = 0;
                    $scope.intervalEnd = $scope.max_values[$scope.currentPhenomenonIndex];
                }
            } else {
                $scope.highlightedInterval = true;
                $scope.highlightInterval(low, high);
                $scope.intervalStart = low;
                $scope.intervalEnd = high;
            }

            lastInterval = args;

            $timeout(function () {
                window.dispatchEvent(new Event('resize'))
            },
                    1);

        });

        $scope.$on('leafletDirectivePath.click', function (event, path) {
            //path.modelname
            $scope.clickedXPoint = parseInt(path.modelName.substring(1));
            $scope.showMeasurementXInChart();
            $scope.showMeasurementX();
        });

        $scope.$on('leafletDirectivePath.mouseover', function (event, path) {
            //path.modelName;
            $scope.hoveredXPoint = parseInt(path.modelName.substring(1));
            if ($scope.segmentActivated)
                $scope.hoveredXPoint = $scope.hoveredXPoint - $scope.slider.minValue;
            // add sliderMin point on top:
            $scope.showHoveredPointInChart();
        });

        $scope.$on('track-toolbar:phenomenon-changed', function (event, args) {
            console.log(args);
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
                case 'GPS Speed':
                    $scope.dataTrackChart[0] = $scope.data_all[5];
                    $scope.paths = $scope.paths_all[5];
                    $scope.legend = legend_all[5];
                    $scope.currentPhenomenonIndex = 5;
                    PhenomenonService.setPhenomenon('GPS Speed', 5);
                    break;
            }
            lastInterval = 5;
            $scope.highlightedInterval = false;
            $scope.intervalStart = 0;
            $scope.intervalEnd = $scope.max_values[$scope.currentPhenomenonIndex];
            if ($scope.segmentActivated) {
                $scope.changeSelectionRange($scope.slider.minValue, $scope.slider.maxValue);
                $scope.changeChartRange($scope.slider.minValue, $scope.slider.maxValue);
            } else {
                $scope.changeSelectionRange(0, $scope.slider.options.ceil);
                $scope.changeChartRange(0, $scope.slider.options.ceil);
            }
            console.log($scope.legend);
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
                    axisLabel: "",
                    tickFormat: function (d) {
                        return $scope.timestamps[d];
                    },
                    staggerLabels: true,
                    showMaxMin: false
                },
                x2Axis: {
                    tickFormat: function (d) {
                        return $scope.timestamps[d];
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
                        var y;
                        if ($scope.currentPhenomenonIndex === 3) {
                            y = d.toFixed(0);
                        } else {
                            y = d3.format(',.2f')(d);
                        }
                        return y;
                    }
                },
                interactiveLayer: {
                    dispatch: {
                        elementClick: function (e) {
                            $scope.clickedXPoint = Math.round(e.pointXValue);
                            $scope.showMeasurementX();
                            $scope.removeHoveredPointInChart();
                            $scope.showMeasurementXInChart();
                        },
                        elementMousemove: function (e) {
                            if ($scope.hoveredXPoint !== Math.round(e.pointXValue)) {
                                $scope.removeHoveredPointInChart();
                                $scope.hoveredXPoint = Math.round(e.pointXValue);
                                $scope.showHoveredX();
                            }
                        },
                        elementMouseout: function (e) {
                            $scope.removeHoveredPointInChart();
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
            },
            {
                key: $translate.instant('GPS_SPEED'),
                values: [
                ]
            }
        ];
        $scope.paths_all = [
            {p1: 0},
            {p1: 0},
            {p1: 0},
            {p1: 0},
            {p1: 0},
            {p1: 0}
        ];
        // Chart data setup for Track Chart:
        // FIXME: // Speed is not always available anymore
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
                icon: $scope.markerGreen
            };
        };
        $scope.removeHoverMarker = function () {
            $scope.markers.HoveredPosition = {
                'lat': -1000,
                'lng': -1000,
                focus: false,
                icon: $scope.markerBlue
            };
            $timeout(function () {
                window.dispatchEvent(new Event('resize'))
            },
                    1);
        };

        $scope.lastHoveredXPoint = undefined;

        $scope.removeHoveredPointInChart = function () {
            var selector = 'nv-point-' + $scope.lastHoveredXPoint;
            var x = document.getElementsByClassName(selector);
            if (x["0"]) {
                x["0"].style["fillOpacity"] = "0";
                x["0"].style["strokeOpacity"] = "0";
                x["0"].style["stroke"] = "#1A80C1";
            }
        };

        $scope.showHoveredPointInChart = function () {
            if (($scope.hoveredXPoint !== $scope.lastClickedXPoint)) {
                // remove highlight of previous hovered point:
                if ($scope.lastHoveredXPoint !== $scope.lastClickedXPoint) {
                    var selector = 'nv-point-' + $scope.lastHoveredXPoint;
                    var x = document.getElementsByClassName(selector);
                    if (x["0"]) {
                        x["0"].style["fillOpacity"] = "0";
                        x["0"].style["strokeOpacity"] = "0";
                        x["0"].style["stroke"] = "#1A80C1";
                    }
                }

                // highlight the point in the chart:
                var selector = 'nv-point-' + $scope.hoveredXPoint;
                var x = document.getElementsByClassName(selector);
                if (x["0"]) {
                    x["0"].style["fillOpacity"] = "1";
                    x["0"].style["strokeWidth"] = "7px";
                    x["0"].style["strokeOpacity"] = "1";
                    x["0"].style["stroke"] = "#1A80C1";
                }
                $scope.lastHoveredXPoint = $scope.hoveredXPoint;
            }
        };

        $scope.showHoveredX = function () {
            // get the lat/lng coordinates:
            if ($scope.hoveredXPoint > 0) {
                var lat_coord = data_global.data.features[$scope.hoveredXPoint].geometry.coordinates[1];
                var lon_coord = data_global.data.features[$scope.hoveredXPoint].geometry.coordinates[0];
                $scope.markers.HoveredPosition = {
                    lat: lat_coord,
                    lng: lon_coord,
                    focus: false,
                    icon: $scope.markerBlue
                };
            }
            ;

            $timeout(function () {
                window.dispatchEvent(new Event('resize'))
            },
                    1);
        };

        $scope.lastClickedXPoint = undefined;

        $scope.showMeasurementXInChart = function () {
            // remove highlight of previous clicked point:
            if ($scope.lastClickedXPoint) {
                var selector = 'nv-point-' + $scope.lastClickedXPoint;
                var x = document.getElementsByClassName(selector);
                if (x["0"]) {
                    x["0"].style["fillOpacity"] = "0";
                    x["0"].style["strokeOpacity"] = "0";
                    x["0"].style["stroke"] = "#1A80C1";
                }
            }

            // highlight the point in the chart:
            var selector = 'nv-point-' + $scope.clickedXPoint;
            if ($scope.segmentActivated)
                selector = 'nv-point-' + ($scope.clickedXPoint - $scope.slider.minValue);
            var x = document.getElementsByClassName(selector);
            if (x["0"]) {
                x["0"].style["fillOpacity"] = "1";
                x["0"].style["strokeWidth"] = "7px";
                x["0"].style["strokeOpacity"] = "1";
                x["0"].style["stroke"] = "#8CBF3F";
            }
            $scope.lastClickedXPoint = ($scope.clickedXPoint - $scope.slider.minValue);
        };

        $scope.showMeasurementX = function () {
            // move the clickedPosition marker to the coordinates of the clicked path:
            if ($scope.clickedXPoint > 0) {
                $scope.markers.ClickedPosition.lat = data_global.data.features[$scope.clickedXPoint].geometry.coordinates[1];
                $scope.markers.ClickedPosition.lng = data_global.data.features[$scope.clickedXPoint].geometry.coordinates[0];
            }
            $timeout(function () {
                window.dispatchEvent(new Event('resize'));
            },
                    1);
        };

        var data_global = {};
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;
        TrackService.getTrack($scope.username, $scope.password, $scope.trackid).then(
                function (data) {
                    console.log(data);
                    data_global = data;
                    // set slider ranges:
                    $scope.slider.maxValue = data_global.data.features.length - 1;
                    $scope.slider.options.ceil = data_global.data.features.length - 1;
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
                    if (data_global.data.features[0].properties.phenomenons['GPS Speed'])
                        phenomsJSON['GPS Speed'] = true;
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
                    var gpsSpeedMeasurement;
                    $scope.timestamps = [
                    ];

                    // save measurements for each phenomenon:
                    for (var index = 0; index < data_global.data.features.length; index++) {
                        var pathObjSpeed = {};
                        var pathObjConsumption = {};
                        var pathObjCO2 = {};
                        var pathObjRPM = {};
                        var pathObjEngine_load = {};
                        var pathObjGPS_Speed = {};
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
                        pathObjGPS_Speed['weight'] = 8;
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
                        pathObjGPS_Speed['latlngs'] = pathObjSpeed['latlngs'];

                        // get timestamp:
                        var time1 = data_global.data.features[index].properties.time;
                        var date_hh_mm_ss = new Date(time1).toLocaleTimeString();

                        $scope.timestamps.push(date_hh_mm_ss);

                        // get the phenomenon's value and interpolate a color value from it:
                        // FIXME: Speed is not always available anymore
                        if (data_global.data.features[index].properties.phenomenons.Speed) {
                            var value_speed = data_global.data.features[index].properties.phenomenons.Speed.value;
                            phenomsJSON['Speed'] = true;
                            pathObjSpeed['color'] = $scope.percentToRGB($scope.yellow_break[0], $scope.red_break[0], $scope.max_values[0], value_speed, 1);               //more information at percentToRGB().
                            speedMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Speed.value};
                        } else {
                            pathObjSpeed['color'] = $scope.errorColor;
                            speedMeasurement = {x: index, y: undefined};
                        }

                        if (data_global.data.features[index].properties.phenomenons.Consumption) {
                            var value_consumption = data_global.data.features[index].properties.phenomenons.Consumption.value;
                            phenomsJSON['Consumption'] = true;
                            pathObjConsumption['color'] = $scope.percentToRGB($scope.yellow_break[1], $scope.red_break[1], $scope.max_values[1], value_consumption, 1);   //more information at percentToRGB().
                            consumptionMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Consumption.value, z: index};
                        } else {
                            pathObjConsumption['color'] = $scope.errorColor;
                            consumptionMeasurement = {x: index, y: undefined, z: index};
                        }

                        if (data_global.data.features[index].properties.phenomenons.CO2) {
                            var value_CO2 = data_global.data.features[index].properties.phenomenons.CO2.value;
                            phenomsJSON['CO2'] = true;
                            pathObjCO2['color'] = $scope.percentToRGB($scope.yellow_break[2], $scope.red_break[2], $scope.max_values[2], value_CO2, 1);                   //more information at percentToRGB().
                            co2Measurement = {x: index, y: data_global.data.features[index].properties.phenomenons.CO2.value, z: index};
                        } else {
                            pathObjCO2['color'] = $scope.errorColor;
                            co2Measurement = {x: index, y: undefined, z: index};
                        }

                        if (data_global.data.features[index].properties.phenomenons.Rpm) {
                            var value_RPM = data_global.data.features[index].properties.phenomenons.Rpm.value;
                            phenomsJSON['Rpm'] = true;
                            pathObjRPM['color'] = $scope.percentToRGB($scope.yellow_break[3], $scope.red_break[3], $scope.max_values[3], value_RPM, 1);                   //more information at percentToRGB().
                            rpmMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons.Rpm.value, z: index};
                        } else {
                            rpmMeasurement = {x: index, y: undefined, z: index};
                            pathObjRPM['color'] = $scope.errorColor;
                        }

                        if (data_global.data.features[index].properties.phenomenons["Engine Load"]) {
                            var value_EngineLoad = data_global.data.features[index].properties.phenomenons["Engine Load"].value;
                            phenomsJSON['Engine Load'] = true;
                            pathObjEngine_load['color'] = $scope.percentToRGB($scope.yellow_break[4], $scope.red_break[4], $scope.max_values[4], value_EngineLoad, 1);    //more information at percentToRGB().
                            engineLoadMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons['Engine Load'].value, z: index};
                        } else {
                            pathObjEngine_load['color'] = $scope.errorColor;
                            engineLoadMeasurement = {x: index, y: undefined, z: index};
                        }

                        if (data_global.data.features[index].properties.phenomenons["GPS Speed"]) {
                            var value_GPSSPeed = data_global.data.features[index].properties.phenomenons["GPS Speed"].value;
                            phenomsJSON['GPS Speed'] = true;
                            pathObjGPS_Speed['color'] = $scope.percentToRGB($scope.yellow_break[5], $scope.red_break[5], $scope.max_values[5], value_GPSSPeed, 1);    //more information at percentToRGB().
                            gpsSpeedMeasurement = {x: index, y: data_global.data.features[index].properties.phenomenons['GPS Speed'].value, z: index};
                        } else {
                            pathObjGPS_Speed['color'] = $scope.errorColor;
                            gpsSpeedMeasurement = {x: index, y: undefined, z: index};
                        }

                        // enqueue pathObjects for each phenomenon to phenomPath:
                        if (index > 0) {
                            $scope.paths_all[0]['p' + (index)] = pathObjSpeed;
                            $scope.paths_all[1]['p' + (index)] = pathObjConsumption;
                            $scope.paths_all[2]['p' + (index)] = pathObjCO2;
                            $scope.paths_all[3]['p' + (index)] = pathObjRPM;
                            $scope.paths_all[4]['p' + (index)] = pathObjEngine_load;
                            $scope.paths_all[5]['p' + (index)] = pathObjGPS_Speed;
                            // add 'speed'-path as default overlay to leaflet map:
                            // FIXME: speed is not always available and the default phenomenon must be choosen differently.
                            $scope.paths['p' + (index)] = pathObjSpeed;
                        }
                        // save all data:
                        $scope.data_all[0].values.push(speedMeasurement);
                        $scope.data_all[1].values.push(consumptionMeasurement);
                        $scope.data_all[2].values.push(co2Measurement);
                        $scope.data_all[3].values.push(rpmMeasurement);
                        $scope.data_all[4].values.push(engineLoadMeasurement);
                        console.log($scope.data_all);
                        console.log(gpsSpeedMeasurement);
                        $scope.data_all[5].values.push(gpsSpeedMeasurement);
                    }
                    $rootScope.$broadcast('single_track_page:phenomenons-available', phenomsJSON);


                    // save 'speed'-data as default into time series chart 
                    // FIXME: Speed data not always available, change the default phenomenon!
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
        });

        $scope.deleteTrack = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirmDeleteTrack = $mdDialog.confirm()
                    .title($translate.instant("DIALOG_DELETE_TRACK_TITLE"))
                    .textContent($translate.instant("DIALOG_DELETE_TRACK_TEXT"))
                    .ariaLabel('delete user profile dialog')
                    .targetEvent(ev)
                    .ok($translate.instant("DIALOG_DELETE_TRACK_CONFIRM"))
                    .cancel($translate.instant("DIALOG_DELETE_TRACK_CANCEL"));
            $mdDialog.show(confirmDeleteTrack).then(function () {
                TrackService.deleteTrack($scope.username, $scope.password, $scope.trackid).then(
                        function (data) {
                            console.log(data);
                            // redirect to dashboard:
                            $scope.goToDashboard();
                        }, function (error) {
                    console.log(error);
                });
            }, function () {
                // do nothing
            });
        };

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