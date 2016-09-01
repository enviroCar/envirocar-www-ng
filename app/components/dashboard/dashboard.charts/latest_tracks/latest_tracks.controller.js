(function() {
    'use strict';
    
    function LatestTracksChartCtrl($scope, $state, $translate, TrackService, UserService, UserCredentialsService, ecBaseUrl) {
        var timeline = {};
        $scope.track_number = 0;
        $scope.onload_tracks_timeline = false;
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;
        
        var urlredirect = '#/dashboard/chart/';
        
        $scope.goToActivity = function(trackid) {
            //redirect to the track analytics page.
            $state.go('home.chart', {
                'trackid': trackid
            });
        };
        
        var helperevents = [];
        
        UserService.getTotalUserTracks($scope.username, $scope.password).then(
                function(data){
                    $scope.track_number = data.headers('Content-Range').split("/")[1];
                    console.log(data.data);
                }, function(data){
                    console.log("error " + data)
                }
        );

        // tracks holen:
        TrackService.getUserTracks($scope.username, $scope.password). then(
                function(data){
                    console.log(data);
                    $scope.number = data.tracks.length;
                    var limit = 0;
                    // The latest tracks display shows latest 5 tracks. If the user only has a total of lesser than 5 tracks, then we update that number to avoid exceptions
                    if ($scope.number >= 5)
                        limit = 5;
                    else
                        limit = $scope.number;
                    for (var i = 0; i < limit; i++) {
                        (function(cntr) {

                            var helper_events = {};
                            helper_events['car'] = data.tracks[cntr].sensor.properties.model;
                            console.log(data.tracks[cntr].sensor.properties.model);
                            helper_events['manufacturer'] = data.tracks[cntr].sensor.properties.manufacturer;
                            helper_events['id'] = data.tracks[cntr].id;
                            helper_events['title'] = data.tracks[cntr].name;
                            helper_events['urlredirect'] = urlredirect + data.tracks[cntr].id;
                            helper_events['url'] = ecBaseUrl + '/tracks/'+ data.tracks[cntr].id + "/preview";
                            console.log(helper_events['url']);
                            var seconds_passed = new Date(data.tracks[cntr].end).getTime() - new Date(data.tracks[cntr].begin).getTime();
                            var seconds = seconds_passed / 1000;
                            var timeoftravel = seconds / 60;
                            // time of travel is in minutes
                            // convert to the right format. of hh:mm:ss;
                            var date_for_seconds = new Date(null);
                            date_for_seconds.setSeconds(seconds);
                            var date_hh_mm_ss = date_for_seconds.toISOString().substr(11, 8)
                            helper_events['travelTime'] = date_hh_mm_ss;
                            helper_events['begin'] = new Date(data.tracks[cntr].begin);
                            helper_events['distance'] = (data.tracks[cntr]['length'] != undefined) ? data.tracks[cntr]['length'].toFixed(2) : "NA";
                            helperevents.push(helper_events);
                        })(i);
                    }
                    $scope.timelinevalues = timeline;
                    $scope.events = helperevents;
                    $scope.onload_tracks_timeline = true;
                    window.dispatchEvent(new Event('resize'));
                }, function(data){
                    console.log("error " + data)
                }
        );
      };  
        
    angular.module('enviroCar')
        .controller('LatestTracksChartCtrl', LatestTracksChartCtrl);
})();
