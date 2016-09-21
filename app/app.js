(function () {
    'use strict';

    angular.module('enviroCar', [
        'ngMaterial',
        'ngAnimate',
        'ngCookies',
        'ui.router',
        'pascalprecht.translate',
        'translations',
        'nvd3',
        'enviroCar.auth',
        'leaflet-directive',
        'enviroCar.api',
        'enviroCar.track',
        'enviroCar.tracks',
        'materialCalendar',
        'cl.paging',
        'rzModule'])
            .value("ecBaseUrl", "https://enviroCar.org/api/stable")
            .run(function ($rootScope, $state, $cookieStore, UserCredentialsService) {
                console.log('app started');
                $rootScope.previewurl = "";
                UserCredentialsService.clearCredentials();
                var credits = $cookieStore.get('usercredits') || {};
                var credits2 = UserCredentialsService.getCredentials();
                console.log("creditsscheck:");
                if (!credits.username) {
                    console.log(credits);
                } else {
                    console.log(credits);
                    console.log(credits2);
                }

                $rootScope.$on("$stateChangeStart", function (event, toState, toParams,
                        fromState, fromParams) {
                    var credits = UserCredentialsService.getCredentials();
                    console.log('from ' + fromState.toString() + ' to ' + toState.toString());
                    console.log("creditsscheck:");
                    if (!credits.username) {
                        console.log(credits);
                    } else {
                        console.log(credits);
                    }
                    if (credits.username === "" || !credits.username) {
                    } else {
                        //UserCredentialsService.setCredentials(credits.username, credits.password);
                    }
                    console.log('Usercredits: ' + credits.username + " , " + credits.password);
                    if (toState.authenticate && (!credits.username)) {
                        $state.transitionTo("login");
                        event.preventDefault();
                    }

                })

            });


    angular.module('enviroCar.api', []);

    angular.module('enviroCar.auth', []);

    angular.module('enviroCar.track', []);

    angular.module('enviroCar.tracks', []);

})();
