
(function(){
    "use strict";
  
    angular
     .module('enviroCar.tou', ['ngMaterial'])//Module name 
     .controller('TouCtrl', TouController); // Kontroller, der für dieses Modul zuständig ist(wird hier definiert)

  
    function TouController(
      $scope, 
      $mdDialog, 
      $location, 
      UserService,
      UserCredentialsService,
      
    
      ) {
      "ngInject";
      console.log("TouController started.");
      $scope.username = UserCredentialsService.getCredentials().username;
      $scope.notAccpted = 'blabla'
      $scope.TOUVersion = UserService.getTOUVersion()

      
      //If user clicks'Accept', user profile is updated with a put request which updates the accepted TOU to the newest terms of use 
      $scope.acceptTou = function() {
        $scope.TOUVersion.then(
          function(touString){
            UserService.putAcceptedTermsVersion($scope.username, touString).then(
              function(response) { $location.path('/dashboard'); return response },
              function(error) { return error; }
            );
          }, 
          function(error){
            return error
          }
        )    
        return true          
      };

      // If user clicks 'Deny'--> cookies deleted, user logged out and sent back to login page 
      $scope.dontAcceptTou = function() {
        console.log('TOU not accepted')
        UserCredentialsService.deleteCookies();
        UserCredentialsService.logout();
        $location.path('/login');
        return true
      };

        
    }
  })(angular);
  


  



