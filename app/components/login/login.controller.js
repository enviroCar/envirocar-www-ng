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
        $scope.login_active = true;

        $scope.username_register = "";
        $scope.email_register = "";
        $scope.password_register = "";
        $scope.password_repeat = "";
        $scope.error_name_in_use = false;
        $scope.error_pw_not_match = false;
        $scope.error_pw_empty = false;
        $scope.error_pw_repeat_empty = false;
        $scope.error_mail = false;
        $scope.error_name = false;
        $scope.name_in_use_alrdy = "";

        $scope.register = function () {
            console.log($scope.username_register);
            console.log($scope.email_register);
            console.log($scope.password_register);
            console.log($scope.password_repeat);
            // init as: no errors:
            $scope.error_name_in_use = false;
            $scope.error_pw_not_match = false;
            $scope.error_pw_empty = false;
            $scope.error_pw_repeat_empty = false;
            $scope.error_mail = false;
            $scope.error_name = false;
            $scope.name_in_use_alrdy = "";

            // check for errors:
            if ($scope.username_register === "")
                $scope.error_name = true;
            if ($scope.email_register === "")
                $scope.error_mail = true;
            if ($scope.password_register === "")
                $scope.error_pw_empty = true;
            if ($scope.password_repeat === "")
                $scope.error_pw_repeat_empty = true;
            if (($scope.password_register !== $scope.password_repeat)
                && (!$scope.error_pw_empty) && (!$scope.error_pw_repeat_empty))
                $scope.error_pw_not_match = true;

            // if no error yet, send register request to server:
            if ((!$scope.error_pw_empty) 
                    && (!$scope.error_pw_repeat_empty) 
                    && (!$scope.error_pw_not_match) 
                    && (!$scope.error_mail) 
                    && (!$scope.error_name)) {
                var userdata = {
                    name: $scope.username_register,
                    mail: $scope.email_register,
                    token: $scope.password_register
                };
                UserService.postUser($scope.username_register, userdata).then(
                        function (res) {
                            $scope.username = $scope.username_register;
                            $scope.password = $scope.password_register;
                            $scope.login_active = true;
                            $scope.error = false;
                            $scope.error_name_in_use = false;
                            $scope.error_pw_not_match = false;
                            $scope.error_pw_repeat_empty = false;
                            $scope.error_pw_empty = false;
                            $scope.error_mail = false;
                            $scope.error_name = false;
                            $scope.name_in_use_alrdy = "";
                        },
                        function (error) {
                            console.log(error);
                            if (error.status === 409) {
                                $scope.error_name_in_use = true;
                                $scope.name_in_use_alrdy = $scope.username_register;
                            }
                            if (error.status === 400) {
                                $scope.error_mail = true;
                            }
                        });
            } else {
                console.log("error in registration.");
            }
        };

        $scope.login = function () {
            console.log($scope.username);
            console.log($scope.password);
            $scope.dataLoading = true;
            //console.log("logging in attempt with: " + $scope.username + "|" + $scope.password);
            UserService.getUserStatistics($scope.username, $scope.password).then(
                    function (res) { // success response
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
                    },
                    function (error) { // error response
                        console.log("getUser error: " + error);
                        // If wrong credentials are provided
                        $scope.error = true;
                        $scope.dataLoading = false;
                        UserCredentialsService.clearCredentials();
                        UserCredentialsService.clearCookies();
                    }
            );

            $scope.logout = function () {
                //console.log("LOGGED OUT!!!!!!!!!!!!!");
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