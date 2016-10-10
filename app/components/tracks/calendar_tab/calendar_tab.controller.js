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
            $element,
            TrackService,
            MaterialCalendarData,
            UserCredentialsService,
            ecBaseUrl) {
        $scope.onload_calendar = false;
        $scope.nostatistics = true;
        $scope.Math = window.Math;
        
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;

        // pagination:
        $scope.currentPageTracks = {
            currentMonthTracks: [], // all tracks currently shown in current pagination page.
            currentSelectedTracks: [], // all tracks from this month in the current selection.
            tracks: []              // all tracks in current selected month, year
        };
        $scope.currentPage = 0;
        $scope.paging = {
            total: 5,
            current: 1,
            align: 'center start',
            onPageChanged: loadPages
        };

        var loadStatistics = function () {
            var time = 0;
            var distance = 0;
            var amountOfTracks = 0;
            // monthly overview:
            for (var i = 0; i < $scope.currentPageTracks.currentSelectedTracks.length; i++) {
                var currTrack = $scope.currentPageTracks.currentSelectedTracks[i];
                // get traveltime in seconds: 
                var seconds_passed = new Date(currTrack.end).getTime() - new Date(currTrack.begin).getTime();
                var seconds = seconds_passed / 1000;
                time += seconds;
                distance += currTrack.length;
                amountOfTracks++;
            }
            var date_for_seconds = new Date(null);
            date_for_seconds.setSeconds(time);
            var date_hh_mm_ss = date_for_seconds.toISOString().substr(11, 8)

            var travelTime = date_hh_mm_ss;

            $scope.total_time = travelTime;
            $scope.total_distance = distance.toFixed(1);
            $scope.total_tracks = amountOfTracks;
            $scope.nostatistics = false;
        };

        function loadPages() {
            $scope.currentPage = $scope.paging.current;
            // remove the 1-4 tracks from current pagination page:
            $scope.currentPageTracks.currentMonthTracks = [];

            var number_monthly_tracks = $scope.currentPageTracks.currentSelectedTracks.length;
            // take the 1-4 from page current and push into currentMonthTracks:
            for (var i = 4 * ($scope.currentPage - 1);
                    i < 4 * ($scope.currentPage) && i < number_monthly_tracks; i++) {
                $scope.currentPageTracks.currentMonthTracks.push($scope.currentPageTracks.currentSelectedTracks[i]);
            }
        }


        // calendar:
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;

        // a and b are javascript Date objects
        function dateDiffInDays(a, b) {
            // Discard the time and time-zone information.
            var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

            return Math.floor((utc2 - utc1) / _MS_PER_DAY);
        }

        $scope.setDayContent = function (date) {
            // set the content of the day when there are no tracks to an empty element.
            return ("<p></p>");
        };

        // If you want multi-date select, initialize it as an array.
        $scope.rangeSelection = [];

        // selecting a range:
        $scope.rangeStartDate;
        $scope.rangeEndDate;

        var removeDayHighlighting = function () {
            var fullMonth = new Date($scope.selectedYear, $scope.selectedMonth + 1, 0);
            var lastDay = fullMonth.getDate();
            for (var i = 1; i <= lastDay; i++) {
                var clickedDayDiv = angular.element(document.querySelectorAll('[tabindex="' + i + '"]'));
                clickedDayDiv.css("background-color", "transparent");
            }
        };

        var highLightRange = function (start, end) {
            if ($scope.numberClickedDays > 0) {
                for (var i = start; i <= end; i++) {
                    var clickedDayDiv = angular.element(document.querySelectorAll('[tabindex="' + i + '"]'));
                    clickedDayDiv.css("background-color", "#8CBF3F");
                }
            }
        };

        $scope.numberClickedDays = 0;
        $scope.dayClick = function (date) {
            if ($scope.numberClickedDays === 0) {          // if no day is selected:
                // select clicked Day:
                $scope.rangeStartDate = new Date(date.getFullYear(),
                        date.getMonth(),
                        date.getDate());
                $scope.rangeEndDate = new Date(date.getFullYear(),
                        date.getMonth(),
                        date.getDate());
                $scope.numberClickedDays++;
            } else if ($scope.numberClickedDays === 1) {   // if 1 day is selected:
                // if clicked day = selected day?
                if ($scope.rangeStartDate.getDate() === date.getDate()
                        && $scope.rangeStartDate.getMonth() === date.getMonth()
                        && $scope.rangeStartDate.getFullYear() === date.getFullYear()) {
                    // unselect the day:
                    // range start = 1st of selected month:
                    $scope.rangeStartDate = new Date($scope.selectedYear, $scope.selectedMonth, 1);
                    // range end = last of selected month:
                    $scope.rangeEndDate = new Date($scope.selectedYear, $scope.selectedMonth + 1, 0);
                    $scope.numberClickedDays = 0;
                } else if (dateDiffInDays(date, $scope.rangeStartDate) > 0) { // else if clicked day < selected day?
                    // update range start:
                    $scope.rangeStartDate = new Date(date.getFullYear(),
                            date.getMonth(),
                            date.getDate());
                    $scope.numberClickedDays = 2;
                } else if (dateDiffInDays($scope.rangeEndDate, date) > 0) {    // else if clicked day > selected day?
                    $scope.rangeEndDate = new Date(date.getFullYear(),
                            date.getMonth(),
                            date.getDate());
                    $scope.numberClickedDays = 2;
                }
            } else {          // if 2 days are selected already:
                // if click is outside current selection range:
                if (dateDiffInDays(date, $scope.rangeStartDate) > 0) {
                    // extend range to the left:
                    $scope.rangeStartDate = new Date(date.getFullYear(),
                            date.getMonth(),
                            date.getDate());
                } else if (dateDiffInDays($scope.rangeEndDate, date) > 0) {
                    // extend range to the right:
                    $scope.rangeEndDate = new Date(date.getFullYear(),
                            date.getMonth(),
                            date.getDate());
                } else if (dateDiffInDays(date, $scope.rangeStartDate) === 0) { // else if click is on range start:
                    // remove selected start:
                    $scope.rangeEndDate = new Date($scope.rangeStartDate.getFullYear(), $scope.rangeStartDate.getMonth(), $scope.rangeStartDate.getDate());
                    $scope.numberClickedDays = 1;
                } else if (dateDiffInDays($scope.rangeEndDate, date) === 0) { // else if click is on range end:
                    // remove selected start:
                    $scope.rangeEndDate = new Date($scope.rangeStartDate.getFullYear(), $scope.rangeStartDate.getMonth(), $scope.rangeStartDate.getDate());
                    $scope.numberClickedDays = 1;
                } else {
                    $scope.rangeEndDate = new Date(date.getFullYear(),
                            date.getMonth(),
                            date.getDate());
                    // else (e.g. click is inside current selected range) : do nothing yet
                }
            }

            // update calendar day selection:
            $scope.rangeSelection = [];

            for (var dateLooper = new Date($scope.rangeStartDate.getFullYear(),
                    $scope.rangeStartDate.getMonth(),
                    $scope.rangeStartDate.getDate());
                    dateLooper <= $scope.rangeEndDate;
                    dateLooper.setDate(dateLooper.getDate() + 1)) {
                $scope.rangeSelection.push(new Date(dateLooper));
            }

            removeDayHighlighting();
            highLightRange($scope.rangeStartDate.getDate(), $scope.rangeEndDate.getDate());

            // update pagination:
            // 1. delete current paged tracks and current selected tracks:
            $scope.currentPageTracks.currentMonthTracks = [];
            $scope.currentPageTracks.currentSelectedTracks = []; // all tracks from this month in the current selection.


            // 2. load tracks within selection into currentSelectedTracks:
            for (var i = 0; i < $scope.currentPageTracks.tracks.length; i++) {
                var currTrack = $scope.currentPageTracks.tracks[i];
                var currDate = new Date(currTrack.begin);
                // if currDate within [rangestart,rangeEnd]
                if (dateDiffInDays($scope.rangeStartDate, currDate) >= 0
                        && dateDiffInDays(currDate, $scope.rangeEndDate) >= 0) {
                    // put into currentSelectedTracks!
                    $scope.currentPageTracks.currentSelectedTracks.push(currTrack);
                }
            }
            // 3. calculate pagination:
            var number_selected_tracks = $scope.currentPageTracks.currentSelectedTracks.length;
            $scope.paging.total = Math.ceil(number_selected_tracks / 4);
            // 4. take the first 4:
            for (var i = 0; i < 4 && i < number_selected_tracks; i++) {
                $scope.currentPageTracks.currentMonthTracks.push($scope.currentPageTracks.tracks[i]);
            }
            $scope.currentPage = 1;
            $scope.paging.current = 1;
            loadStatistics();

            $timeout(function () {
                window.dispatchEvent(new Event('resize'));
                $timeout(function () {
                    window.dispatchEvent(new Event('resize'));
                }, 600);
            }, 400);
        };

        $scope.prevMonth = function (data) {
            // data.month = month; data.year = year;
            $scope.selectedMonth = data.month - 1;
            $scope.selectedYear = data.year;
            // get all tracks from current month&year:
            $scope.currentPageTracks = {
                currentMonthTracks: [],
                currentSelectedTracks: [], // all tracks from this month in the current selection.
                tracks: []
            };
            for (var i = 0; i < $scope.tracksCalendar.length; i++) {
                var currTrack = $scope.tracksCalendar[i];
                if (currTrack.year === $scope.selectedYear &&
                        currTrack.month === $scope.selectedMonth) {
                    $scope.currentPageTracks.tracks.push(currTrack);
                    $scope.currentPageTracks.currentSelectedTracks.push(currTrack);
                }
            }

            // selecting a range:
            // range start = 1st of selected month:
            $scope.rangeStartDate = new Date($scope.selectedYear, $scope.selectedMonth, 1);
            // range end = last of selected month:
            $scope.rangeEndDate = new Date($scope.selectedYear, $scope.selectedMonth + 1, 0);

            $scope.rangeSelection = [];

            for (var dateLooper = new Date($scope.selectedYear, $scope.selectedMonth, 1);
                    dateLooper <= $scope.rangeEndDate;
                    dateLooper.setDate(dateLooper.getDate() + 1)) {
                $scope.rangeSelection.push(new Date(dateLooper));
            }
            $scope.numberClickedDays = 0;

            // calculate pagination:
            var number_monthly_tracks = $scope.currentPageTracks.tracks.length;
            // number pages:
            $scope.paging.total = Math.ceil(number_monthly_tracks / 4);
            // take the first 4:
            for (var i = 0; i < 4 && i < number_monthly_tracks; i++) {
                $scope.currentPageTracks.currentMonthTracks.push($scope.currentPageTracks.tracks[i]);
            }
            $scope.paging.current = 1;
            removeDayHighlighting();
            loadStatistics();
        };

        $scope.nextMonth = function (data) {
            $scope.selectedMonth = data.month - 1;
            $scope.selectedYear = data.year;
            // get all tracks from current month&year:
            $scope.currentPageTracks = {
                currentMonthTracks: [],
                currentSelectedTracks: [], // all tracks from this month in the current selection.
                tracks: []
            };
            for (var i = 0; i < $scope.tracksCalendar.length; i++) {
                var currTrack = $scope.tracksCalendar[i];
                if (currTrack.year === $scope.selectedYear &&
                        currTrack.month === $scope.selectedMonth) {
                    $scope.currentPageTracks.tracks.push(currTrack);
                    $scope.currentPageTracks.currentSelectedTracks.push(currTrack);
                }
            }

            // selecting a range:
            // range start = 1st of selected month:
            $scope.rangeStartDate = new Date($scope.selectedYear, $scope.selectedMonth, 1);
            // range end = last of selected month:
            $scope.rangeEndDate = new Date($scope.selectedYear, $scope.selectedMonth + 1, 0);

            $scope.rangeSelection = [];

            for (var dateLooper = new Date($scope.selectedYear, $scope.selectedMonth, 1);
                    dateLooper <= $scope.rangeEndDate;
                    dateLooper.setDate(dateLooper.getDate() + 1)) {
                $scope.rangeSelection.push(new Date(dateLooper));
            }
            $scope.numberClickedDays = 0;
            $scope.paging.current = 1;
            
            // calculate pagination:
            var number_monthly_tracks = $scope.currentPageTracks.tracks.length;
            // number pages:
            $scope.paging.total = Math.ceil(number_monthly_tracks / 4);
            // take the first 4:
            for (var i = 0; i < 4 && i < number_monthly_tracks; i++) {
                $scope.currentPageTracks.currentMonthTracks.push($scope.currentPageTracks.tracks[i]);
            }
            removeDayHighlighting();
            loadStatistics();
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

                    for (var i = tracks.length - 1; i >= 0; i--) {
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
                        currentSelectedTracks: [], // all tracks from this month in the current selection.
                        tracks: []
                    };
                    for (var i = 0; i < $scope.tracksCalendar.length; i++) {
                        var currTrack = $scope.tracksCalendar[i];
                        if (currTrack.year === $scope.selectedYear &&
                                currTrack.month === $scope.selectedMonth) {
                            $scope.currentPageTracks.tracks.push(currTrack);
                            $scope.currentPageTracks.currentSelectedTracks.push(currTrack);
                        }
                    }

                    // selecting a range:
                    // range start = 1st of selected month:
                    $scope.rangeStartDate = new Date($scope.start_year, $scope.start_month, 1);
                    // range end = last of selected month:
                    $scope.rangeEndDate = new Date($scope.start_year, $scope.start_month + 1, 0);

                    $scope.rangeSelection = [];

                    for (var dateLooper = new Date($scope.start_year, $scope.start_month, 1);
                            dateLooper <= $scope.rangeEndDate;
                            dateLooper.setDate(dateLooper.getDate() + 1)) {
                        $scope.rangeSelection.push(new Date(dateLooper));
                    }

                    // calculate pagination:
                    var number_monthly_tracks = $scope.currentPageTracks.tracks.length;
                    // number pages:
                    $scope.paging.total = Math.ceil(number_monthly_tracks / 4);
                    // take the first 4:
                    for (var i = 0; i < 4 && i < number_monthly_tracks; i++) {
                        $scope.currentPageTracks.currentMonthTracks.push($scope.currentPageTracks.tracks[i]);
                    }
                    loadStatistics();
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