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
        'ui-leaflet',
        //'leaflet-directive',
        'enviroCar.api',
        'enviroCar.track',
        'enviroCar.tracks',
        'materialCalendar',
        'cl.paging',
        'rzModule'])
            .value("ecBaseUrl", "https://enviroCar.org/api/stable")
            .run(function ($rootScope, $state, $location, $stateParams, $cookieStore, UserCredentialsService) {
                console.log('app started');
                $rootScope.previewurl = "";
                //$rootScope.$location = $location;
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
                UserCredentialsService.clearCredentials();
                
                $rootScope.$on("$stateChangeStart", function (event, toState, toParams,
                        fromState, fromParams) {
                    
                    console.log(fromState);
                    if (fromState.name==='tracks'){
                        console.log("komme von tracks page!");
                        
                    }
                    if (toState.name==='tracks'){
                        console.log("gehe zur tracks page!");
                    }
                   
                    var credits = UserCredentialsService.getCredentials();
                    console.log(credits);
                    if (toState.authenticate && (!credits.username)) {
                        $state.transitionTo("login");
                        event.preventDefault();
                    }

                });
                

            });


    angular.module('enviroCar.api', []);

    angular.module('enviroCar.auth', []);

    angular.module('enviroCar.track', []);

    angular.module('enviroCar.tracks', []);

})();
