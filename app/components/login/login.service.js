(function () {
    'use strict';

    function UserCredentialsService($cookieStore) {
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

        this.clearCredentials = function () {
            usercredits.username = '';
        };
        
        this.deleteCookies = function() {
            $cookieStore.put('language', "");
            $cookieStore.put('JSESSIONID', "");
            $cookieStore.remove('JSESSIONID');
            $cookieStore.remove('language');
        }
    }
    ;

    angular.module('enviroCar.auth')
            .service('UserCredentialsService', UserCredentialsService);
})();