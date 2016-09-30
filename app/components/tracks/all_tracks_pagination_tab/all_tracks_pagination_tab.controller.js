/* CalendarController:
 This controller handles the calendar functionality in the tracks page. The tracks.html file makes
 use of this calendar controller
 1) We have made use of the calendar directive to achieve this.
 2) There are 4 important functions of this controller(PrevMonth,NextMonth,DateClicked,Populating the calendar)
 */

(function () {
    'use strict';
    function AllTracksPaginationTabCtrl(
            $rootScope,
            $scope,
            $translate,
            $mdMedia,
            $mdDialog,
            TrackService,
            UserCredentialsService,
            ecBaseUrl) {

        $scope.onload_pagination_tab = false;
        $scope.Math = window.Math;
        $scope.filterOrder = [];

        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;

        // Filters:
        $scope.filters = {
            distance: {
                name: 'distance',
                label: $translate.instant('FILTER_DISTANCE'),
                params: {
                    min: undefined,
                    max: undefined
                },
                inUse: false
            },
            date: {
                name: 'date',
                label: $translate.instant('FILTER_DATE'),
                params: {
                    min: undefined,
                    max: undefined
                },
                inUse: false
            },
            duration: {
                name: 'duration',
                label: $translate.instant('FILTER_DURATION'),
                params: {
                    min: undefined,
                    max: undefined
                },
                inUse: false
            },
            vehicle: {
                name: 'vehicle',
                label: $translate.instant('FILTER_VEHICLE'),
                params: {
                    cars_all: [],
                    cars_set: []
                },
                inUse: false
            },
            spatial: {
                name: 'spatial',
                label: $translate.instant('FILTER_SPATIAL'),
                params: {
                    southwest: {
                        lat: undefined,
                        lng: undefined
                    },
                    northeast: {
                        lat: undefined,
                        lng: undefined
                    },
                    track_ids: [
                    ]
                },
                inUse: false,
                layer: 0
            }
        };
        $scope.filtered_tracks = 0;

        $scope.addFilter = function (filter) {
            // An utility map to replace writing switch cases for each of the filter
            if (!filter.inUse)
            {
                filter.inUse = true;
                if (filter.name === 'spatial') {
                    filter.inUse = false;
                    $scope.commonDialog(filter);
                }
                $scope.filterOrder.push(filter);
            }
            console.log($scope.filterOrder);
        };

        $scope.removeFilter = function (filter) {
            var index = $scope.filterOrder.indexOf(filter);
            if (index > -1) {
                $scope.filterOrder.splice(index, 1);
            }
        };

        $scope.commonDialog = function (filter)
        {
            var showObject = {};
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

            if (filter.name === "distance")
            {
                showObject = {
                    controller: 'DistanceDialogCtrl',
                    templateUrl: 'app/components/tracks/all_tracks_pagination_tab/filter_dialogs/distance/distance_filter_dialog.html',
                    //templateUrl: 'app/components/tracks/all_tracks_pagination_tab/filter_dialogs/distance/distance_filter_dialog.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new(),
                    clickOutsideToClose: false,
                    fullscreen: useFullScreen
                }
            } else if (filter.name === "date")
            {
                showObject = {
                    controller: 'DateDialogCtrl',
                    templateUrl: 'app/components/tracks/all_tracks_pagination_tab/filter_dialogs/date/date_filter_dialog.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new(),
                    clickOutsideToClose: false,
                    fullscreen: useFullScreen
                }
            } else if (filter.name === "duration")
            {
                showObject = {
                    controller: 'DurationDialogCtrl',
                    templateUrl: 'app/components/tracks/all_tracks_pagination_tab/filter_dialogs/duration/duration_filter_dialog.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new(),
                    clickOutsideToClose: false,
                    fullscreen: useFullScreen
                }
            } else if (filter.name === "vehicle")
            {
                showObject = {
                    controller: 'VehicleDialogCtrl',
                    templateUrl: 'app/components/tracks/all_tracks_pagination_tab/filter_dialogs/vehicle/vehicle_filter_dialog.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new(),
                    clickOutsideToClose: false,
                    fullscreen: useFullScreen
                }
            } else if (filter.name === "spatial")
            {
                showObject = {
                    controller: 'SpatialDialogCtrl',
                    templateUrl: 'app/components/tracks/all_tracks_pagination_tab/filter_dialogs/spatial/spatial_filter_dialog.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new(),
                    clickOutsideToClose: false,
                    fullscreen: useFullScreen
                }
            }

            $mdDialog.show(showObject)
                    .then(function (answer) {
                        $scope.status = 'You said the information was "' + answer +
                                '".';
                    }, function () {
                        $scope.status = 'You cancelled the dialog.';
                    });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        var originatorEv;
        $scope.openMenu = function ($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        $scope.filtersChanged = function () {
            // filter GO!
            var amount_of_user_tracks = $scope.currentPaginationTracks.tracks.length;
            $scope.amount_of_user_tracks = amount_of_user_tracks;
            var filterByDistance = $scope.filters.distance.inUse;
            var filterByDuration = $scope.filters.duration.inUse;
            var filterByDate = $scope.filters.date.inUse;
            var filterByVehicle = $scope.filters.vehicle.inUse;
            var filterBySpatial = $scope.filters.spatial.inUse;

            $scope.filtered_tracks = 0; // counts tracks, that are filtered into the result.

            var resultTracks = [];

            for (var i = 0; i < amount_of_user_tracks; i++) {

                var currTrack = $scope.currentPaginationTracks.tracks[i];
                // filter by distance:
                if (filterByDistance) {
                    var currDistance = currTrack.length;
                    if ($scope.filters.distance.params.max === undefined) {
                        if (!(currDistance >= $scope.filters.distance.params.min)) {
                            continue;
                        }
                    } else {
                        if (!((currDistance >= $scope.filters.distance.params.min) &&
                                (currDistance <= $scope.filters.distance.params.max))) {
                            continue;
                        }
                    }
                }

                // filter by date:
                if (filterByDate) {
                    var currDate = currTrack.begin;
                    if (($scope.filters.date.params.min === undefined)
                            && ($scope.filters.date.params.max !== undefined)) {
                        if (!(currDate <= $scope.filters.date.params.max)) {
                            continue;
                        }
                    } else if (($scope.filters.date.params.max === undefined)
                            && ($scope.filters.date.params.min !== undefined)) {
                        if (!(currDate >= $scope.filters.date.params.min)) {
                            continue;
                        }
                    } else
                    if ((!(currDate <= $scope.filters.date.params.max))
                            || (!(currDate >= $scope.filters.date.params.min))) {
                        continue;
                    }
                }

                // filter by duration:
                if (filterByDuration) {
                    var seconds_passed = new Date(currTrack.end).getTime() - new Date(currTrack.begin).getTime();
                    var seconds = seconds_passed / 1000;
                    var currTravelTime = seconds / 60;

                    if (($scope.filters.duration.params.min === undefined)
                            && ($scope.filters.duration.params.max !== undefined)) {
                        if (!(currTravelTime < $scope.filters.duration.params.max)) {
                            continue;
                        }
                    } else if (($scope.filters.duration.params.max === undefined)
                            && ($scope.filters.duration.params.min !== undefined)) {
                        if (!(currTravelTime >= $scope.filters.duration.params.min)) {
                            continue;
                        }
                    } else
                    if ((!(currTravelTime < $scope.filters.duration.params.max))
                            || (!(currTravelTime >= $scope.filters.duration.params.min))) {
                        continue;
                    }
                }

                // filter by vehicle:
                if (filterByVehicle) {
                    var car = currTrack.car;
                    var manu = currTrack.manufacturer;
                    var carCombo = manu + "-" + car;
                    if (!$scope.containsVehicle($scope.filters.vehicle.params.cars_set, carCombo)) {
                        continue;
                    }
                }

                // filter by spatial:
                if (filterBySpatial) {
                    var currID = currTrack.id;

                    var found = $scope.filters.spatial.params.track_ids.filter(function (id) {
                        return currID === id;
                    })[0];
                    if (!found)
                        continue;
                }

                // if all filters passed, add to resultTracks:
                resultTracks.push(currTrack);
                $scope.filtered_tracks++;
            }

            $scope.currentPaginationTracks.currentSelectedTracks = resultTracks;

            // calculate pagination:
            var number_monthly_tracks = $scope.currentPaginationTracks.currentSelectedTracks.length;
            $scope.currentPaginationTracks.currentMonthTracks = [];
            // number pages:
            $scope.pagingTab.total = Math.ceil(number_monthly_tracks / 5);
            // take the first 5:
            for (var i = 0; i < 5 && i < number_monthly_tracks; i++) {
                $scope.currentPaginationTracks.currentMonthTracks.push($scope.currentPaginationTracks.currentSelectedTracks[i]);
            }
            $scope.pagingTab.current = 1;
            loadPages();


            $rootScope.$broadcast('filter:spatial-filter-changed');
        };

        $scope.$on('toolbar:language-changed', function (event, args) {
            console.log("language changed received in AllTracksPaginationCtrl.");
            // translate filter labels:
            $translate([
                'FILTER_DISTANCE',
                'FILTER_DATE',
                'FILTER_DURATION',
                'FILTER_VEHICLE',
                'FILTER_SPATIAL']).then(
                    function (translations) {
                        console.log(translations);
                        $scope.filters.distance.label = translations['FILTER_DISTANCE'];
                        $scope.filters.date.label = translations['FILTER_DATE'];
                        $scope.filters.duration.label = translations['FILTER_DURATION'];
                        $scope.filters.vehicle.label = translations['FILTER_VEHICLE'];
                        $scope.filters.spatial.label = translations['FILTER_SPATIAL'];
                    });
        });

        // pagination:
        $scope.currentPaginationTracks = {
            currentMonthTracks: [], // all tracks currently shown in current pagination page.
            currentSelectedTracks: [], // all tracks from this month in the current selection.
            tracks: []                  // all tracks
        };

        $scope.currentPageTab = 0;
        $scope.pagingTab = {
            total: 5,
            current: 1,
            align: 'center start',
            onPageChanged: loadPages
        };

        function loadPages() {
            $scope.currentPageTab = $scope.pagingTab.current;
            // remove the 1-4 tracks from current pagination page:
            $scope.currentPaginationTracks.currentMonthTracks = [];

            var number_monthly_tracks = $scope.currentPaginationTracks.currentSelectedTracks.length;
            // take the 1-5 from page current and push into currentMonthTracks:
            for (var i = 5 * ($scope.currentPageTab - 1);
                    i < 5 * ($scope.currentPageTab) && i < number_monthly_tracks; i++) {
                $scope.currentPaginationTracks.currentMonthTracks.push($scope.currentPaginationTracks.currentSelectedTracks[i]);
            }
        }

        $scope.tracksPagination = [];

        $scope.containsVehicle = function (array, car) {
            var indexLooper = array.length;
            while (indexLooper--) {
                if (array[indexLooper] === car) {
                    return true;
                }
            }
            return false;
        };

        // tracks holen:
        TrackService.getUserTracks($scope.username, $scope.password).then(
                function (data) {
                    console.log(data);
                    // Erstelle eine Tagestabelle
                    var date_count = [];
                    var tracks = data.data.tracks;
                    // mins and max's for card starting values:
                    $scope.date_min = new Date(tracks[0].begin);
                    $scope.date_max = new Date(tracks[0].begin);
                    $scope.distance_min = parseFloat(tracks[0]['length'].toFixed(2));
                    $scope.distance_max = parseFloat(tracks[0]['length'].toFixed(2));
                    var seconds_passed = new Date(tracks[0].end).getTime() - new Date(tracks[0].begin).getTime();
                    var minutes = seconds_passed / 60000;
                    $scope.duration_min = Math.floor(minutes);
                    $scope.duration_max = Math.ceil(minutes);

                    var contains = function (array, obj) {
                        var i = array.length;
                        while (i--) {
                            if (array[i].year === obj.year && array[i].month === obj.month) {
                                return true;
                            }
                        }
                        return false;
                    };

                    $scope.tracksPagination = [];
                    for (var i = 0; i < tracks.length; i++) {
                        var currTrack = tracks[i];
                        // get date of track and increase date_count:
                        var datestart = currTrack['begin'];
                        var dateobject = new Date(datestart);
                        var string_date = dateobject.toString();
                        var array_string_date = string_date.split(" ");
                        var stripped_date = (array_string_date[1] + array_string_date[2] + array_string_date[3]);
                        if (date_count[stripped_date] !== undefined) {
                            date_count[stripped_date]++;
                        } else {
                            date_count[stripped_date] = 1;
                        }
                        // get track begin date:
                        var currDate = new Date(currTrack.begin);
                        // update date_min and date_max:
                        if (currDate < $scope.date_min) {
                            $scope.date_min = new Date(currDate.getTime());
                        }
                        if (currDate > $scope.date_max) {
                            $scope.date_max = new Date(currDate.getTime());
                        }

                        // get current Track's month:
                        var month = currDate.getUTCMonth(); //months from 0-11
                        var year = currDate.getUTCFullYear(); //year
                        var day = currDate.getDate();       // days from 1-31
                        var month_year = {
                            'year': year,
                            'month': month,
                            'day': day
                        };
                        if (!contains($scope.monthsWithTracksCalendar, month_year)) {
                            $scope.monthsWithTracksCalendar.push(month_year);
                        }

                        var seconds_passed = new Date(currTrack.end).getTime() - new Date(currTrack.begin).getTime();
                        var seconds = seconds_passed / 1000;
                        // time of travel is in minutes
                        // convert to the right format. of hh:mm:ss;
                        var date_for_seconds = new Date(null);
                        date_for_seconds.setSeconds(seconds);
                        var date_hh_mm_ss = date_for_seconds.toISOString().substr(11, 8);

                        var travelTime = date_hh_mm_ss;
                        var travelStart = new Date(currTrack.begin);
                        var travelEnd = new Date(currTrack.end);
                        var travelDistance = parseFloat(currTrack['length'].toFixed(2));
                        // update distance_min and distance_max:
                        if (travelDistance < $scope.distance_min) {
                            $scope.distance_min = travelDistance;
                        }
                        if (travelDistance > $scope.distance_max) {
                            $scope.distance_max = travelDistance;
                        }

                        var seconds_passed = new Date(currTrack.end).getTime() - new Date(currTrack.begin).getTime();
                        var minutes = seconds_passed / 60000;
                        // update distance_min and distance_max:
                        if (minutes < $scope.duration_min) {
                            $scope.duration_min = Math.floor(minutes);
                        }
                        if (minutes > $scope.duration_max) {
                            $scope.duration_max = Math.ceil(minutes);
                        }


                        var carType = currTrack.sensor.properties.model;
                        var carManu = currTrack.sensor.properties.manufacturer;
                        var carCombo = carManu + "-" + carType;

                        if (!$scope.containsVehicle($scope.filters.vehicle.params.cars_all, carCombo)) {
                            $scope.filters.vehicle.params.cars_all.push(carCombo);
                        }
                        ;

                        var resultTrack = {
                            year: year,
                            month: month,
                            day: day,
                            car: carType,
                            manufacturer: carManu,
                            id: currTrack.id,
                            url: ecBaseUrl + '/tracks/' + currTrack.id + "/preview",
                            travelTime: travelTime,
                            begin: travelStart,
                            end: travelEnd,
                            length: travelDistance
                        };
                        $scope.tracksPagination.push(resultTrack);
                    }
                    $scope.distance_max = Math.ceil($scope.distance_max);
                    $scope.distance_min = Math.floor($scope.distance_min);

                    // get all tracks from current month&year:
                    $scope.currentPaginationTracks = {
                        currentMonthTracks: [],
                        currentSelectedTracks: [], // all tracks from this month in the current selection.
                        tracks: []
                    };
                    for (var i = 0; i < $scope.tracksPagination.length; i++) {
                        var currTrack = $scope.tracksPagination[i];
                        $scope.currentPaginationTracks.tracks.push(currTrack);
                        $scope.currentPaginationTracks.currentSelectedTracks.push(currTrack);
                    }

                    // calculate pagination:
                    var number_monthly_tracks = $scope.currentPaginationTracks.tracks.length;
                    // number pages:
                    $scope.pagingTab.total = Math.ceil(number_monthly_tracks / 5);
                    // take the first 5:
                    for (var i = 0; i < 5 && i < number_monthly_tracks; i++) {
                        $scope.currentPaginationTracks.currentMonthTracks.push($scope.currentPaginationTracks.tracks[i]);
                    }

                    $scope.onload_pagination_tab = true;
                    $rootScope.$broadcast('trackspage:pagination_tab-loaded');
                    window.dispatchEvent(new Event('resize'));

                }, function (data) {
            console.log("error " + data)
        }
        );
    }
    ;
    angular.module('enviroCar.tracks')
            .controller('AllTracksPaginationTabCtrl', AllTracksPaginationTabCtrl);
})()