
(function(){
    "use strict";
  
    angular
     .module('enviroCar.tou', ['ngMaterial'])
     .controller('TouCtrl', TouController);
  
    function TouController(
      $scope, 
      $mdDialog, 
      $location, 
      $mdMedia,
      UserService,
      UserCredentialsService,
      ShareLocalDataService,
      $stateParams,
      ecBaseUrl) {
      "ngInject";
      console.log("TouController started.");
      

      $scope.username = ShareLocalDataService.getUsername();
      $scope.password = ShareLocalDataService.getPassword();
     
      $scope.TOUVersion = UserService.getTOUVersion();
       
      function login(user, pass) {
        UserService.getUserWithAuth(user, pass).then(
          function (response) {
          if (user === response.data.name) {
            UserCredentialsService.setCredentials(user);
            $location.path('/dashboard');
          }
        }, function (err) {
          console.log(err);
        });
      };

      function login2(user, pass) {
        $.ajax({ 
            url: ecBaseUrl + "/users/",
            beforeSend: function (request) { 
                request.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pass));
            },
            xhrFields: {
                withCredentials: true
            }
        }).then(
          function (data, status, jqxhr) {
              UserService.getUserWithAuth(user, pass).then(function (data, status, jqxhr) {
                  if (user === data.data.name) {
                      UserCredentialsService.setCredentials(user);
                      $location.path('/dashboard');
                  }
              }, function (err) {
                  console.log(err);
              });
          }, 
          function (err) {
              console.log(err);
          })
      };
      
      //If user clicks'Accept', user profile is updated with a put request which updates the accepted TOU to the newest terms of use 
      $scope.acceptTou = function() {
        console.log('scopeUser: '+ $scope.username);
        console.log('scopePW: '+ $scope.password) ;

        $scope.TOUVersion.then(function(touString){
          console.log(touString);
          UserService.putAcceptedTermsVersion($scope.username, $scope.password, touString)
            .then(function(response) {
              login($scope.username, $scope.password);

              //$location.path('/dashboard');
              return response; 
            }, function(error) {
              console.log(error)
              console.log('putAcceptedTermsVersion', error);
              return error;
            }
          );
        })    
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

      $scope.deleteAccount = function(ev) {
        $scope.deleteUserDialog();
      };

      $scope.deleteUserDialog = function() {
        var showObject = {};
        var useFullScreen =
          ($mdMedia("sm") || $mdMedia("xs")) && $scope.customFullscreen;
        showObject = {
          controller: "DeleteUserCtrl",
          templateUrl: "app/components/profile/delete/delete_confirm_dialog.html",
          parent: angular.element(document.body),
          scope: $scope.$new(),
          clickOutsideToClose: false,
          fullscreen: useFullScreen
        };
        $mdDialog.show(showObject).then(function(deleteContent) {
          // 2. finally delete the user:
          UserService.deleteUserBasicAuth($scope.username, $scope.password, deleteContent).then(
            function(data) {
              console.log(data);
              // log out from page:
              ShareLocalDataService.setUsername("");
              ShareLocalDataService.setPassword("");
            },
            function(error) {
              console.log(error);
              //                        });
              console.log("dialog confirmed with deleteContent answer: " + deleteContent);
              $scope.status = 'You said the information was "' + deleteContent + '".';
            },
            function() {
              console.log("dialog canceled without deleteContent answer");
              $scope.status = "You cancelled the dialog.";
            }
          );
          $scope.$watch(
            function() {
              return $mdMedia("xs") || $mdMedia("sm");
            },
            function(wantsFullScreen) {
              $scope.customFullscreen = wantsFullScreen === true;
            }
          );
        });
      };
        
    }
  })();
  


  



