/* CalendarController:
 This controller handles the calendar functionality in the tracks page. The tracks.html file makes
 use of this calendar controller
 1) We have made use of the calendar directive to achieve this.
 2) There are 4 important functions of this controller(PrevMonth,NextMonth,DateClicked,Populating the calendar)
 */
(function () {
    'use strict';
    function AllTracksTabCtrl(
            $rootScope,
            $scope,
            $state,
            $translate,
            $timeout,
            $element,
            TrackService,
            UserCredentialsService,
            ecBaseUrl) {

        $scope.onload_all_tracks = false;
        
        var tablist = angular.element($element[0].querySelector('#track_list_tab'));
        $scope.tablistheight = window.innerHeight - 135;

        $(window).resize(function () {
            $scope.$apply(function () {
                $scope.tablistheight = window.innerHeight - 135;
            });
        });

        var imagePath = 'app/components/assets/enviroCar_logo_final.png';

        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;
        $scope.constants = {
            months: [
            ],
            colors: [
                '#F44336',
                '#E91E63',
                '#9C27B0',
                '#3F51B5',
                '#2196F3',
                '#009688',
                '#8BC34A',
                '#CDDC39',
                '#FFC107',
                '#FF9800',
                '#FF5722',
                '#795548'
            ]
        };
        $translate(
                ['JAN', 'FEB', 'MAR', 'APR',
                    'MAY', 'JUN', 'JUL', 'AUG',
                    'SEP', 'OCT', 'NOV', 'DEZ']).then(function (translations) {
            $scope.constants.months[0] = translations['JAN'];
            $scope.constants.months[1] = translations['FEB'];
            $scope.constants.months[2] = translations['MAR'];
            $scope.constants.months[3] = translations['APR'];
            $scope.constants.months[4] = translations['MAY'];
            $scope.constants.months[5] = translations['JUN'];
            $scope.constants.months[6] = translations['JUL'];
            $scope.constants.months[7] = translations['AUG'];
            $scope.constants.months[8] = translations['SEP'];
            $scope.constants.months[9] = translations['OCT'];
            $scope.constants.months[10] = translations['NOV'];
            $scope.constants.months[11] = translations['DEZ'];
            $timeout(function () {
                window.dispatchEvent(new Event('resize'))
            },
                    50);
        });
        //var urlredirect = '#/dashboard/chart/';

        $scope.goToActivity = function (trackid) {
            //redirect to the track analytics page.
            $state.go('chart', {
                'trackid': trackid
            });
        };
        $scope.tracks = [
        ];
        // tracks holen:
        TrackService.getUserTracks($scope.username, $scope.password).then(
                function (data) {
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
                    $scope.start_month = date_max.getUTCMonth(); //months from 0-11
                    $scope.start_year = date_max.getUTCFullYear(); //year

                    $scope.onload_all_tracks = true;
                    $rootScope.$broadcast('trackspage:all_tracks_tab-loaded');
                    window.dispatchEvent(new Event('resize'));
                }, function (data) {
            console.log("error " + data)
        }
        );
    }
    ;
    angular.module('enviroCar.tracks')
            .controller('AllTracksTabCtrl', AllTracksTabCtrl);
})()