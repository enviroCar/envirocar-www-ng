// What is a controller?


(function () {
    angular.module('enviroCar.auth')
            .controller('LoginCtrl', LoginCtrl);
            
    function LoginCtrl(
            $scope, // built-in object, contains application data and methods
            $rootScope, //
            $location,
            $stateParams,
            $state,
            $timeout,
            UserCredentialsService,
            UserService,
            FilterStateService,
            ecBaseUrl) {
        "ngInject"; //ngInject is needed for the application to work when minified once the app is deployed in production
        console.log("LoginCtrl started.");
        if ($stateParams.username) {
            $scope.username = $stateParams.username;
        } else {
            $scope.username = "";
        }
        if ($stateParams.user && $stateParams.code) {
            $scope.new_password = true;
            $scope.reset_password = false;
        } else {
        }
        $scope.password = "";
        $scope.error = false;
        $scope.login_active = true;
        $scope.reset_password = false;
        $scope.register_success = false;
        $scope.username_register = "";
        $scope.email_register = "";
        $scope.password_register = "";
        $scope.password_repeat = "";
        $scope.error_pw_not_match = false;
        $scope.error_pw_empty = false;
        $scope.error_pw_repeat_empty = false;
        $scope.error_mail = false;
        $scope.error_name = false;
        $scope.error_name_too_short = false;
        $scope.error_name_in_use = false;
        $scope.name_in_use_alrdy = "";
        $scope.reset_success = false;
        $scope.reset_name = "";
        $scope.reset_mail = "";
        $scope.error_username_empty = false;
        $scope.error_username_too_short = false;
        $scope.error_mail = false;
        $scope.error_usermail_not_exist = false;
        $scope.error_request_sent_alrdy = false;
        $scope.login_request_running = false;
        $scope.register_request_running = false;
        $scope.passwordreset_request_running = false;
        $scope.new_password_request_running = false;
        $scope.set_new_pw_failed = false;
        $scope.acceptedTerms = false;
        $scope.acceptedPrivacy = false;
        $scope.TOUVersion = UserService.getTOUVersion()

        $scope.resetPassword = function () {
            // init as: no errors:
            $scope.error_username_empty = false;
            $scope.error_username_too_short = false;
            $scope.error_mail = false;
            $scope.error_usermail_not_exist = false;
            $scope.error_request_sent_alrdy = false;
            $scope.reset_success = false;
            // check for errors:
            if ($scope.reset_name === "")
                $scope.error_username_empty = true;
            if ((!$scope.error_username_empty) && ($scope.reset_name.length < 4))
                $scope.error_username_too_short = true;
            if ($scope.reset_mail === "")
                $scope.error_mail = true;
            // if no errors: try a password reset POST request:
            if ((!$scope.error_username_empty)
                    && (!$scope.error_username_too_short)
                    && (!$scope.error_mail)) {
                $scope.passwordreset_request_running = true;
                var userData = {
                    "user": {
                        "name": $scope.reset_name,
                        "mail": $scope.reset_mail
                    }
                };
                UserService.postPasswordReset(userData).then(
                        function (res) {
                            if (res.status < 300) {
                                $scope.reset_success = true;
                                $scope.error_username_empty = false;
                                $scope.error_username_too_short = false;
                                $scope.error_mail = false;
                                $scope.error_usermail_not_exist = false;
                                $scope.error_request_sent_alrdy = false;
                                $scope.passwordreset_request_running = false;
                            } else {
                                $scope.reset_success = false;
                                if (res.status === 400) {
                                    if (res.data.errors["0"]) {
                                        if (typeof res.data.errors["0"] === 'string' || res.data.errors["0"] instanceof String) {
                                            if (res.data.errors["0"].startsWith("The given combination"))
                                                $scope.error_usermail_not_exist = true;
                                            if (res.data.errors["0"].startsWith("The given user already"))
                                                $scope.error_request_sent_alrdy = true;
                                            if (res.data.errors["0"].startsWith("instance failed"))
                                                $scope.error_mail = true;
                                        } else if (typeof res.data.errors["0"].message === 'string' || res.data.errors["0"].message instanceof String) {
                                            if (res.data.errors["0"].message.startsWith("The given combination"))
                                                $scope.error_usermail_not_exist = true;
                                            if (res.data.errors["0"].message.startsWith("The given user already"))
                                                $scope.error_request_sent_alrdy = true;
                                            if (res.data.errors["0"].message.startsWith("instance failed"))
                                                $scope.error_mail = true;
                                        }
                                    }
                                }
                                $scope.passwordreset_request_running = false;
                            }
                        });
            }
        };

        $scope.set_new_password = function () {
            // init as no errors:
            $scope.error_pw_not_match = false;
            $scope.error_pw_empty = false;
            $scope.error_pw_repeat_empty = false;
            if ($scope.password_new_one === "")
                $scope.error_pw_empty = true;
            if ($scope.password_new_two === "")
                $scope.error_pw_repeat_empty = true;
            if (($scope.password_new_one !== $scope.password_new_two)
                    && (!$scope.error_pw_empty) && (!$scope.error_pw_repeat_empty)) {
                $scope.error_pw_not_match = true;
            }
            if (!$scope.error_pw_not_match
                    && !$scope.error_pw_repeat_empty
                    && !$scope.error_pw_empty) {
                UserService.putPasswordReset(
                        $stateParams.user,
                        $scope.password_new_two,
                        $stateParams.code)
                        .then(function (res) {
                            if (res.status === 204) {
                                $scope.set_new_pw_failed = false;
                                $state.go('dashboard', {});
                            } else {
                                $scope.set_new_pw_failed = true;
                                $timeout(function () {
                                    $state.go('dashboard', {});
                                    window.dispatchEvent(new Event('resize'));
                                }, 8000);
                            }
                        });
            }
        }
        ;

        $scope.register = function () {
            // init as: no errors:
            $scope.error_pw_not_match = false;
            $scope.error_pw_empty = false;
            $scope.error_pw_repeat_empty = false;
            $scope.error_mail = false;
            $scope.error_name = false;
            $scope.error_name_too_short = false;
            $scope.error_name_in_use = false;
            $scope.name_in_use_alrdy = "";
            $scope.mail_in_use_alrdy = "";
            $scope.register_success = false;
            $scope.error_terms = false;
            $scope.error_privacy = false;
            // check for errors:
            if ($scope.username_register === "")
                $scope.error_name = true;
            if ((!$scope.error_name) && ($scope.username_register.length < 4))
                $scope.error_name_too_short = true;
            if ($scope.email_register === "")
                $scope.error_mail = true;
            if ($scope.password_register === "")
                $scope.error_pw_empty = true;
            if ($scope.password_repeat === "")
                $scope.error_pw_repeat_empty = true;
            if (($scope.password_register !== $scope.password_repeat)
                    && (!$scope.error_pw_empty) && (!$scope.error_pw_repeat_empty))
                $scope.error_pw_not_match = true;
            if (!$scope.acceptedTerms) {
                $scope.error_terms = true;
            }
            if (!$scope.acceptedPrivacy) {
                $scope.error_privacy = true;
            }
            // if no error yet, send register request to server:
            if ((!$scope.error_pw_empty)
                    && (!$scope.error_pw_repeat_empty)
                    && (!$scope.error_pw_not_match)
                    && (!$scope.error_mail)
                    && (!$scope.error_name)
                    && (!$scope.error_name_too_short)
                    && $scope.acceptedTerms
                    && $scope.acceptedPrivacy) {
                $scope.register_request_running = true;
                var userdata = {
                    name: $scope.username_register,
                    mail: $scope.email_register,
                    token: $scope.password_register,
                    acceptedTerms: $scope.acceptedTerms,
                    acceptedPrivacy: $scope.acceptedPrivacy
                };
                UserService.postUser(userdata).then(
                        function (res) {
                            if (res.status < 300) {
                                $scope.username = $scope.username_register;
                                $scope.password = $scope.password_register;
                                $scope.register_success = true;
                                $scope.error = false;
                                $scope.error_name_in_use = false;
                                $scope.error_name_too_short = false;
                                $scope.error_pw_not_match = false;
                                $scope.error_pw_repeat_empty = false;
                                $scope.error_pw_empty = false;
                                $scope.error_mail = false;
                                $scope.error_name = false;
                                $scope.error_privacy = false;
                                $scope.error_terms = false;
                                $scope.name_in_use_alrdy = "";
                                $scope.mail_in_use_alrdy = "";
                                $scope.register_request_running = false;
                                $scope.acceptedTerms = false;
                                $scope.acceptedPrivacy = false;
                            } else {
                                if (res.status === 409) { // name or email alrdy in use
                                    $scope.error_name_in_use = true;
                                    $scope.name_in_use_alrdy = $scope.username_register;
                                    $scope.mail_in_use_alrdy = $scope.email_register;
                                }
                                if (res.status === 400) {
                                    $scope.error_mail = true;
                                }
                                
                                $scope.register_success = false;
                                $scope.register_request_running = false;
                            }
                        });
            } else {
                console.log("error in registration.");
            }
        };

        $scope.login = function () {
            $scope.dataLoading = true; // this is just the cirling loading symbol
            $scope.login_request_running = true;
            $.ajax({ // here an ajax request is executed
                url: ecBaseUrl + "/users", // this is the url of the api 
                beforeSend: function (request) { //beforeSend is used here to set custom headers
                    request.setRequestHeader("Authorization", "Basic " + btoa($scope.username + ":" + $scope.password));
                },
                xhrFields: {
                    withCredentials: true
                }
            }).then(function (data, status, jqxhr) { // data here holds all users and their stored information, including the date of the accepted terms of use
                // https://stackoverflow.com/questions/14221722/set-cookie-on-browser-with-ajax-request-via-cors
                // http://dontpanic.42.nl/2015/04/cors-with-spring-mvc.html

                UserService.getUserWithAuth($scope.username, $scope.password).then(function (data, status, jqxhr) {
                    if ($scope.username === data.data.name) { //search in the data the username given by the user => // When the right credentials are provided.
                        $scope.error = false;                      
                        UserCredentialsService.setCredentials($scope.username);
                            if (!(typeof $rootScope.url_redirect_on_login !== "undefined")) {
                                $scope.TOUVersion.then(function(tou_string) {
                                    //Here first check if the accepted TOU Version is the same as the actual version, then send to relevant path (tou or dashboard). 
                                    //Here better: if(data.data.acceptedTermsOfUseVersion < tou_string)--> date time object from strings
                                    if(data.data.acceptedTermsOfUseVersion !== tou_string){ 
                                        $location.path('/tou');
                                    }
                                    else{
                                        $location.path('/dashboard');
                                    }                
                                });
                            }
                    } 
                    else {
                        $scope.error = true;
                    }
                    $scope.login_request_running = false;
                    $scope.dataLoading = false;
                }, function (err) {
                    $scope.error = true;
                    $scope.login_request_running = false;
                    $scope.dataLoading = false;
                });
            }, function (err) {
                $scope.error = true;
                $scope.login_request_running = false;
                $scope.dataLoading = false;
                $timeout(function () {
                    window.dispatchEvent(new Event('resize'));
                }, 200);
            });
        };
//                        $scope.error = false;
//                        console.log(res);
//                        // When the right credentials are provided.
//                        UserCredentialsService.setCredentials($scope.username, $scope.password);
//                        if (typeof $rootScope.url_redirect_on_login !== "undefined") {
//                            // Used to redirect the user to the single track page.
//                            // When a unlogged user accesses the single track page anonymously and then
//                            // goes through our login flow, the user will be redirected back to the single track page
//                            $location.path($rootScope.url_redirect_on_login);
//                        } else {
//                            // If the user logged in straight without visiting the single track page anonymously, then redirect to home.
//                            $location.path('/home');
//                        }
//
//                        UserCredentialsService.setCredentials($scope.username, $scope.password);
//                        $scope.login_request_running = false;
//                    },
//                    function (error) { // error response
//                        console.log(error);
//                        console.log("getUser error: " + error);
//                        // If wrong credentials are provided
//                        $scope.error = true;
//                        $scope.login_request_running = false;
//                        $scope.dataLoading = false;
//                        UserCredentialsService.clearCredentials();
//                        UserCredentialsService.clearCookies();
//                        $scope.login_request_running = false;
//                    }
//            );

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
)();