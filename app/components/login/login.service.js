(function () {
    'use strict';

    function UserCredentialsService() {
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
    }
    ;

    angular.module('enviroCar.auth')
            .service('UserCredentialsService', UserCredentialsService);
})();