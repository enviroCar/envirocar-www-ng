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
            $state.go('chart', {
                'trackid': trackid
            });
        };
        
        var helperevents = [];
        
        UserService.getTotalUserTracks($scope.username, $scope.password).then(
                function(data){
                    $scope.track_number = data.headers('Content-Range').split("/")[1];
                }, function(data){
                    console.log("error " + data)
                }
        );

        // tracks holen:
        TrackService.getUserTracks($scope.username, $scope.password). then(
                function(data){
                    $scope.number = data.data.tracks.length;
                    var limit = 0;
                    // The latest tracks display shows latest 6 tracks. If the user only has a total of less than 6 tracks, then we update that number to avoid exceptions
                    if ($scope.number >= 6)
                        limit = 6;
                    else
                        limit = $scope.number;
                    for (var i = 0; i < limit; i++) {
                        (function(cntr) {

                            var helper_events = {};
                            helper_events['car'] = data.data.tracks[cntr].sensor.properties.model;
                            helper_events['manufacturer'] = data.data.tracks[cntr].sensor.properties.manufacturer;
                            helper_events['id'] = data.data.tracks[cntr].id;
                            helper_events['title'] = data.data.tracks[cntr].name;
                            helper_events['urlredirect'] = urlredirect + data.data.tracks[cntr].id;
                            helper_events['url'] = ecBaseUrl + '/tracks/'+ data.data.tracks[cntr].id + "/preview";
                            var seconds_passed = new Date(data.data.tracks[cntr].end).getTime() - new Date(data.data.tracks[cntr].begin).getTime();
                            var seconds = seconds_passed / 1000;
                            var timeoftravel = seconds / 60;
                            // time of travel is in minutes
                            // convert to the right format. of hh:mm:ss;
                            var date_for_seconds = new Date(null);
                            date_for_seconds.setSeconds(seconds);
                            var date_hh_mm_ss = date_for_seconds.toISOString().substr(11, 8)
                            helper_events['travelTime'] = date_hh_mm_ss;
                            helper_events['begin'] = new Date(data.data.tracks[cntr].begin);
                            helper_events['distance'] = (data.data.tracks[cntr]['length'] != undefined) ? data.data.tracks[cntr]['length'].toFixed(2) : "NA";
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
