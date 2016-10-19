(function () {

    function LoginCtrl(
            $scope,
            $rootScope,
            $location,
            UserCredentialsService,
            UserService,
            FilterStateService) {
        console.log("LoginCtrl started.");
        $scope.username = "";
        $scope.password = "";
        $scope.error = false;

        // clear credentials or tokens to reset the login status.
        // UserCredentialsService.clearCredentials();

        $scope.login = function () {
            $scope.dataLoading = true;
            console.log("logging in attempt with: " + $scope.username + "|" + $scope.password);
            UserService.getUserStatistics($scope.username, $scope.password).then(
                    function (res) { // success response
                        console.log("getUser success: " + res);
                        $scope.error = false;
                        // When the right credentials are provided.
                        UserCredentialsService.setCredentials($scope.username, $scope.password);
                        if (typeof $rootScope.url_redirect_on_login !== "undefined") {
                            // Used to redirect the user to the single track page.
                            // When a unlogged user accesses the single track page anonymously and then
                            // goes through our login flow, the user will be redirected back to the single track page
                            $location.path($rootScope.url_redirect_on_login);
                        } else {
                            // If the user logged in straight without visiting the single track page anonymously, then redirect to home.
                            $location.path('/home');
                        }
                        UserCredentialsService.setCredentials($scope.username, $scope.password);
                    }, function (error) { // error response
                console.log("getUser error: " + error);
                // If wrong credentials are procided
                $scope.error = true;
                $scope.dataLoading = false;
                UserCredentialsService.clearCredentials();
                UserCredentialsService.clearCookies();
            }
            );

            $scope.logout = function () {
                console.log("LOGGED OUT!!!!!!!!!!!!!");
                $scope.error = false;
                UserCredentialsService.clearCredentials();
                UserCredentialsService.clearCookies();
                $scope.username = "";
                $scope.password = "";
                FilterStateService.resetFilterStates();
            };
        };
    }

    angular.module('enviroCar.auth')
            .controller('LoginCtrl', LoginCtrl);

})();