/* CalendarController:
 This controller handles the calendar functionality in the tracks page. The tracks.html file makes
 use of this calendar controller
 1) We have made use of the calendar directive to achieve this.
 2) There are 4 important functions of this controller(PrevMonth,NextMonth,DateClicked,Populating the calendar)
 */
(function () {
    'use strict';
    function CalendarTabCtrl(
            $rootScope,
            $scope,
            $state,
            $translate,
            $timeout,
            $http,
            $filter,
            TrackService,
            MaterialCalendarData,
            UserCredentialsService,
            ecBaseUrl) {
        $scope.onload_calendar = false;

        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;

        $scope.currentPageTracks = {
            currentMonthTracks: [],
            tracks: []
        };

        $scope.currentPage = 0;
        $scope.paging = {
            total: 5,
            current: 1,
            align: 'center start',
            onPageChanged: loadPages
        };

        function loadPages() {
            console.log('Current page is : ' + $scope.paging.current);

            $scope.currentPage = $scope.paging.current;
            
            // load the 1-4 tracks into current Page:
            $scope.currentPageTracks.currentMonthTracks = [];
            var number_monthly_tracks = $scope.currentPageTracks.tracks.length;
            // take the 1-4 from page current:
            for (var i = 4*($scope.currentPage-1); 
                    i < 4*($scope.currentPage) && i < number_monthly_tracks; i++) {
                $scope.currentPageTracks.currentMonthTracks.push($scope.currentPageTracks.tracks[i]);
            }
        }

        $scope.setDayContent = function (date) {
            // set the content of the day when there are no tracks to an empty element.
            return ("<p></p>");
        };

        $scope.prevMonth = function (data) {
            console.log("You clicked (prev) month " + data.month + ", " + data.year);
            $scope.selectedMonth = data.month - 1;
            $scope.selectedYear = data.year;
            // get all tracks from current month&year:
            $scope.currentPageTracks = {
                currentMonthTracks: [],
                tracks: []
            };
            for (var i = 0; i < $scope.tracksCalendar.length; i++) {
                var currTrack = $scope.tracksCalendar[i];
                if (currTrack.year === $scope.selectedYear &&
                        currTrack.month === $scope.selectedMonth) {
                    $scope.currentPageTracks.tracks.push(currTrack);
                }
            }

            // calculate pagination:
            var number_monthly_tracks = $scope.currentPageTracks.tracks.length;
            // number pages:
            $scope.paging.total = Math.ceil(number_monthly_tracks / 4);
            // take the first 4:
            for (var i = 0; i < 4 && i < number_monthly_tracks; i++) {
                $scope.currentPageTracks.currentMonthTracks.push($scope.currentPageTracks.tracks[i]);
            }
        };

        $scope.nextMonth = function (data) {
            console.log("You clicked (next) month " + data.month + ", " + data.year);
            $scope.selectedMonth = data.month - 1;
            $scope.selectedYear = data.year;
            // get all tracks from current month&year:
            $scope.currentPageTracks = {
                currentMonthTracks: [],
                tracks: []
            };
            for (var i = 0; i < $scope.tracksCalendar.length; i++) {
                var currTrack = $scope.tracksCalendar[i];
                if (currTrack.year === $scope.selectedYear &&
                        currTrack.month === $scope.selectedMonth) {
                    $scope.currentPageTracks.tracks.push(currTrack);
                }
            }

            // calculate pagination:
            var number_monthly_tracks = $scope.currentPageTracks.tracks.length;
            // number pages:
            $scope.paging.total = Math.ceil(number_monthly_tracks / 4);
            // take the first 4:
            for (var i = 0; i < 4 && i < number_monthly_tracks; i++) {
                $scope.currentPageTracks.currentMonthTracks.push($scope.currentPageTracks.tracks[i]);
            }
        };

        $scope.tracksCalendar = [
        ];
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
                    $scope.monthsWithTracksCalendar = [];

                    for (var i = tracks.length-1; i >= 0; i--) {
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
                        var month_year = {
                            'year': year,
                            'month': month
                        };
                        if (!contains($scope.monthsWithTracksCalendar, month_year)) {
                            $scope.monthsWithTracksCalendar.push(month_year);
                        }

// get time:
                        var seconds_passed = new Date(currTrack.end).getTime() - new Date(currTrack.begin).getTime();
                        var seconds = seconds_passed / 1000;
                        var timeoftravel = seconds / 60;
                        // time of travel is in minutes
                        // convert to the right format. of hh:mm:ss;
                        var date_for_seconds = new Date(null);
                        date_for_seconds.setSeconds(seconds);
                        var date_hh_mm_ss = date_for_seconds.toISOString().substr(11, 8)

                        var travelTime = date_hh_mm_ss;
                        var travelStart = new Date(currTrack.begin);
                        var travelDistance = currTrack['length'].toFixed(1);
                        var resultTrack = {
                            year: year,
                            month: month,
                            car: currTrack.sensor.properties.model,
                            manufacturer: currTrack.sensor.properties.manufacturer,
                            id: currTrack.id,
                            url: ecBaseUrl + '/tracks/' + currTrack.id + "/preview",
                            travelTime: travelTime,
                            begin: travelStart,
                            length: travelDistance
                        };
                        $scope.tracksCalendar.push(resultTrack);

                        MaterialCalendarData.setDayContent(dateobject, ('<i class="material-icons">directions_car</i><span>' + date_count[stripped_date] + '</span>'));
                    }


                    $scope.start_month = date_max.getUTCMonth(); //months from 0-11
                    $scope.start_year = date_max.getUTCFullYear(); //year
                    $scope.selectedMonth = $scope.start_month;
                    $scope.selectedYear = $scope.start_year;

                    // get all tracks from current month&year:
                    $scope.currentPageTracks = {
                        currentMonthTracks: [],
                        tracks: []
                    };
                    for (var i = 0; i < $scope.tracksCalendar.length; i++) {
                        var currTrack = $scope.tracksCalendar[i];
                        if (currTrack.year === $scope.selectedYear &&
                                currTrack.month === $scope.selectedMonth) {
                            $scope.currentPageTracks.tracks.push(currTrack);
                        }
                    }

                    // calculate pagination:
                    var number_monthly_tracks = $scope.currentPageTracks.tracks.length;
                    // number pages:
                    $scope.paging.total = Math.ceil(number_monthly_tracks / 4);
                    // take the first 4:
                    for (var i = 0; i < 4 && i < number_monthly_tracks; i++) {
                        $scope.currentPageTracks.currentMonthTracks.push($scope.currentPageTracks.tracks[i]);
                    }


                    /**
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
                     $scope.monthsWithTracks = [];
                     for (var i = 0; i < tracks.length; i++) {
                     var currTrack = tracks[i];
                     // get track begin date:
                     var currDate = new Date(currTrack.begin);
                     // update date_min and date_max:
                     if (currDate < date_min) {
                     date_min = new Date(currDate.getTime());
                     }
                     if (currDate > date_max) {
                     date_max = new Date(currDate.getTime());
                     }
                     
                     // get current Date's month:
                     var month = currDate.getUTCMonth(); //months from 0-11
                     var year = currDate.getUTCFullYear(); //year
                     var month_year = {
                     'year': year,
                     'month': month
                     };
                     if (!contains($scope.monthsWithTracks, month_year)) {
                     $scope.monthsWithTracks.push(month_year);
                     }
                     
                     // get time:
                     var seconds_passed = new Date(currTrack.end).getTime() - new Date(currTrack.begin).getTime();
                     var seconds = seconds_passed / 1000;
                     var timeoftravel = seconds / 60;
                     // time of travel is in minutes
                     // convert to the right format. of hh:mm:ss;
                     var date_for_seconds = new Date(null);
                     date_for_seconds.setSeconds(seconds);
                     var date_hh_mm_ss = date_for_seconds.toISOString().substr(11, 8)
                     
                     var travelTime = date_hh_mm_ss;
                     var travelStart = new Date(currTrack.begin);
                     var travelDistance = currTrack['length'].toFixed(1);
                     var resultTrack = {
                     year: year,
                     month: month,
                     car: currTrack.sensor.properties.model,
                     manufacturer: currTrack.sensor.properties.manufacturer,
                     id: currTrack.id,
                     url: ecBaseUrl + '/tracks/' + currTrack.id + "/preview",
                     travelTime: travelTime,
                     begin: travelStart,
                     length: travelDistance
                     };
                     $scope.tracks.push(resultTrack);
                     
                     }
                     console.log($scope.monthsWithTracks);
                     */
                    $scope.onload_calendar = true;
                    $rootScope.$broadcast('trackspage:calendar_tab-loaded');
                    window.dispatchEvent(new Event('resize'));

                }, function (data) {
            console.log("error " + data)
        }
        );
    }
    ;

    angular.module('enviroCar.tracks')
            .controller('CalendarTabCtrl', CalendarTabCtrl);
})()