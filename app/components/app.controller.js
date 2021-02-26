(function() {
  "use strict";
  angular.module("enviroCar").controller("AppCtrl", AppCtrl);

  function AppCtrl(
    $scope,//binding part between the HTML (view) and the JavaScript (controller), it is the Model, which is the data available for the current view,  
            //scope is a JavaScript object with properties and methods, which are available for both the view and the controller
    $mdMedia,
    UserCredentialsService,
    FilterStateService
  ) {
    "ngInject";
    $scope.message = "Initial Setup";
    $scope.screenIsXS = $mdMedia("xs");
    $scope.screenIsSM = $mdMedia("sm");
    $scope.screenIsGTSM = $mdMedia("gt-sm");
    $scope.screenIsMD = $mdMedia("md");
    $scope.screenIsGTMD = $mdMedia("gt-md");

    // $scope.hasAccepted = recv_acceptance_from_server();
    $scope.hasAccepted = false; //

    $scope.acceptTOU = function() { //
      // send acceptance to server...

      $scope.hasAccepted = true;
    };

    $scope.$watch(
      function() {
        return $mdMedia("xs");
      },
      function(big) {
        console.log("screen is XS:" + big);
        $scope.screenIsXS = big;
      }
    );

    $scope.$watch(
      function() {
        return $mdMedia("sm");
      },
      function(big) {
        console.log("screen is SM:" + big);
        $scope.screenIsSM = big;
      }
    );

    $scope.$watch(
      function() {
        return $mdMedia("gt-sm");
      },
      function(big) {
        console.log("screen is gt-SM:" + big);
        $scope.screenIsGTSM = big;
      }
    );

    $scope.$watch(
      function() {
        return $mdMedia("md");
      },
      function(big) {
        console.log("screen is MD:" + big);
        $scope.screenIsMD = big;
      }
    );

    $scope.$watch(
      function() {
        return $mdMedia("gt-md");
      },
      function(big) {
        console.log("screen is gt-MD:" + big);
        $scope.screenIsGTMD = big;
      }
    );

    $scope.logout = function() {
      UserCredentialsService.logout();
      FilterStateService.resetFilterStates();
    };

    $scope.loggedIn = function() {
      return UserCredentialsService.getCredentials().username !== "";
    };
  }
  
})();
