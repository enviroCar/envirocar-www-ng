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
            $state,
            $translate,
            $timeout,
            $element,
            $mdMedia,
            $mdDialog,
            TrackService,
            UserCredentialsService,
            ecBaseUrl) {

        $scope.onload_pagination_tab = false;
        $scope.Math = window.Math;

        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;

        // Filters:
        $scope.filters = {
            distance: {
                name: 'distance',
                label: $translate.instant('FILTER_DISTANCE'),
                params: {
                    min: 0,
                    max: undefined
                },
                inUse: false
            },
            date: {
                name: 'date',
                label: $translate.instant('FILTER_DATE'),
                params: {
                    min: 0,
                    max: undefined
                },
                inUse: false
            },
            duration: {
                name: 'duration',
                label: $translate.instant('FILTER_DURATION'),
                params: {
                    min: 0,
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
                    }
                },
                inUse: false
            }
        };

        $scope.addFilter = function (filter)
        {
            // An utility map to replace writing switch cases for each of the filter
            if (!filter.inUse)
            {
                // open the filter dialog to enter its parameters
                $scope.commonDialog(filter);
            }
        };

        $scope.commonDialog = function(filter)
        {
            var showObject = {};
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

            if (filter.name === "distance")
            {
                showObject = {
                    controller: 'DistanceDialogCtrl',
                    templateUrl: 'app/components/tracks/all_tracks_pagination_tab/filter_dialogs/distance/distance_filter_dialog.html',
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
            var filterByDistance = $scope.filters.distance.inUse;
            var filterByDuration = $scope.filters.duration.inUse;
            var filterByDate = $scope.filters.date.inUse;
            var filterByVehicle = $scope.filters.vehicle.inUse;

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

                // if all filters passed, add to resultTracks:
                resultTracks.push(currTrack);
            }

            $scope.currentPaginationTracks.currentSelectedTracks = resultTracks;
            
            // calculate pagination:
            var number_monthly_tracks = $scope.currentPaginationTracks.currentSelectedTracks.length;
            $scope.currentPaginationTracks.currentMonthTracks = [];
            // number pages:
            $scope.pagingTab.total = Math.ceil(number_monthly_tracks / 4);
            // take the first 4:
            for (var i = 0; i < 4 && i < number_monthly_tracks; i++) {
                $scope.currentPaginationTracks.currentMonthTracks.push($scope.currentPaginationTracks.currentSelectedTracks[i]);
            }
            
        };

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
            // take the 1-4 from page current and push into currentMonthTracks:
            for (var i = 4 * ($scope.currentPageTab - 1);
                    i < 4 * ($scope.currentPageTab) && i < number_monthly_tracks; i++) {
                $scope.currentPaginationTracks.currentMonthTracks.push($scope.currentPaginationTracks.currentSelectedTracks[i]);
            }
        }

        $scope.tracksPagination = [];

        // tracks holen:
        TrackService.getUserTracks($scope.username, $scope.password).then(
                function (data) {
                    // Erstelle eine Tagestabelle
                    var date_count = [];
                    var tracks = data.data.tracks;
                    var date_min = new Date(tracks[0].begin);
                    var date_max = new Date(tracks[0].begin);
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
                        if (currDate < date_min) {
                            date_min = new Date(currDate.getTime());
                        }
                        if (currDate > date_max) {
                            date_max = new Date(currDate.getTime());
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
                        var date_hh_mm_ss = date_for_seconds.toISOString().substr(11, 8)

                        var travelTime = date_hh_mm_ss;
                        var travelStart = new Date(currTrack.begin);
                        var travelEnd = new Date(currTrack.end);
                        var travelDistance = currTrack['length'].toFixed(1);
                        var resultTrack = {
                            year: year,
                            month: month,
                            day: day,
                            car: currTrack.sensor.properties.model,
                            manufacturer: currTrack.sensor.properties.manufacturer,
                            id: currTrack.id,
                            url: ecBaseUrl + '/tracks/' + currTrack.id + "/preview",
                            travelTime: travelTime,
                            begin: travelStart,
                            end: travelEnd,
                            length: parseFloat(travelDistance)
                        };
                        $scope.tracksPagination.push(resultTrack);

                    }

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
                    $scope.pagingTab.total = Math.ceil(number_monthly_tracks / 4);
                    // take the first 4:
                    for (var i = 0; i < 4 && i < number_monthly_tracks; i++) {
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