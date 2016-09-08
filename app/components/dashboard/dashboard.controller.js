(function() {
    'use strict';
     
    function DashboardCtrl($scope, UserCredentialsService, UserService, TrackService, StatisticsService) {
        console.log('DashboardCtrl started.');
        
        var username;
        var token;
        
        var credits = UserCredentialsService.getCredentials();
        if (credits){
            username = credits.username;
            token = credits.password;
        } else {
            console.log("error: dird not receive usercredits.");
        }
        $scope.name_of_user = username;
        $scope.track_number = 0;
        $scope.friends_number = 0;
        $scope.distance_driven = 0;
        $scope.groups_number = 0;
        $scope.emailId = "";
        $scope.total_users = 0;
        $scope.total_tracks = 0;
        $scope.total_distance = 0;
        
        /**
         * START: validation of methods:
         */
       
        // ask server for number of total community tracks:
        TrackService.getTotalTracks(username, token).then(
               function(data){
                    $scope.total_tracks = data.headers('Content-Range').split("/")[1];
                    console.log("number users: " + data.headers('Content-Range').split("/")[1]);
                }, function(data){
                    console.log("error " + data);
                } 
        );
        
        // ask server for number of total users:
        UserService.getTotalUsers(username, token).then(
                function(data){
                    $scope.total_users = data.headers('Content-Range').split("/")[1];
                    console.log("number users: " + data.headers('Content-Range').split("/")[1]);
                }, function(data){
                    console.log("error " + data);
                }
        );
        
        // ask server for number user tracks:
        UserService.getTotalUserTracks(username, token).then(
                function(data){
                    $scope.track_number = data.headers('Content-Range').split("/")[1];
                    console.log($scope.track_number);
                }, function(data){
                    console.log("error " + data)
                }
        );

        // ask server for number of friends:
        UserService.getUserFriends(username, token).then(
                function(data){
                    console.log(data);
                    $scope.friends_number = data.data.users.length;
                }, function(data){
                    console.log("Error: "+data);
                }
        );

        // ask server user email:
        UserService.getUserEmail(username, token).then(
                function(data){
                    console.log(data);
                    $scope.emailId = data.data.mail;
                }, function(data){
                    console.log("Error: "+data);
                }
        );

        UserService.getUserGroups(username, token).then(
                function(data){
                    console.log(data);
                    $scope.groups_number = data.data.groups.length;
                }, function(data){
                    console.log("Error: "+data);
                }
        );

        /** getUserDistance is not available yet, but:
        UserService.getUserDistance(username, token).then(
                function(data){
                    console.log(data);
                    $scope.distance_driven = data.distance;
                }, function(data){
                    console.log("Error: "+data);
                }
        );
         **/
        
    };
        
    angular.module('enviroCar')
            .controller('DashboardCtrl', DashboardCtrl);
})();
