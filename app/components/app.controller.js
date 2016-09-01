(function() {
    'use strict';

    function AppCtrl($scope, $translate, UserCredentialsService) {
        $scope.message = 'Initial Setup';
        $scope.loggedIn = UserCredentialsService.getCredentials().username!=="";
        
        $scope.logout = function(){
            UserCredentialsService.clearCredentials();
            UserCredentialsService.clearCookies();
        };
        
        $scope.loggedIn = function(){
            return $scope.loggedIn;
        };
        
    };
   
    angular.module('enviroCar')
        .controller('AppCtrl', AppCtrl)
})();
