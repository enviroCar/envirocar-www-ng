(function () {
    'use strict';

    function UserCredentialsService($cookieStore, $cookies, ecBaseUrl, ecBase) {
        "ngInject";

        console.log("UserCredentialsService started.");
        var usercredits = {
            'username': ''
        };

        this.setCredentials = function (username) {
            usercredits.username = username;
        };

        this.getCredentials = function () {
            return usercredits;
        };

        this.logout = function () {
            $.ajax({
                type: "POST",
                url: ecBase + "/logout",
                withCredentials: true,
                // log out at server
                success: function (data, status, jqxhr) {
                    $.ajax({
                        type: "GET",
                        url: ecBaseUrl + "/users",
                        crossDomain: true,
                        beforeSend: function (request) {
                            // reset Browser's Basic Auth
                            request.setRequestHeader("Authorization", "Basic " + btoa(usercredits.username + ":out"));
                        },
                        success: function () {
                            // 401 expected here
                            console.log("logout failed!")
                        },
                        error: function (request) {
                            if (request.status === 401) {
                                usercredits.username = '';
                                $cookies.remove('JSESSIONID');
                                $cookieStore.remove('JSESSIONID');
                                document.cookie.split(";").forEach(function (c) {
                                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                                });
                                // credentials resetted => redirect
                                // 
//                                window.location.replace(ecBaseUrl + "/logout-success");
                            } else {
                                console.log("logout failed!");
                            }
                        }
                    });
                }
            });
        };

        this.deleteCookies = function () {
            $cookies.remove('JSESSIONID');
            $cookieStore.remove('JSESSIONID');
            document.cookie.split(";").forEach(function (c) {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
        }
    }
    ;

    angular.module('enviroCar.auth')
            .service('UserCredentialsService', UserCredentialsService);
})();