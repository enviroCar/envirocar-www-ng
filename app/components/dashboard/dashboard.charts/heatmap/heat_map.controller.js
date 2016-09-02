(function() {
    'use strict';
    
    function HeatMapCtrl($scope, $state, $translate, TrackService, UserService, UserCredentialsService, ecBaseUrl) {
        var timeline = {};
        $scope.track_number = 0;
        $scope.onload_heat_map = false;
        $scope.username = UserCredentialsService.getCredentials().username;
        $scope.password = UserCredentialsService.getCredentials().password;
        
        var urlredirect = '#/dashboard/chart/';
        
      };  
        
    angular.module('enviroCar')
        .controller('HeatMapCtrl', HeatMapCtrl);
})();
