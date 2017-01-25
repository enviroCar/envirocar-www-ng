(function () {
    'use strict';

    angular.module('enviroCar', [
        'ngMaterial',
        'ui-leaflet',
        'ngAnimate',
        'ngCookies',
        'ui.router',
        'pascalprecht.translate',
        'translations',
        'nvd3',
        'enviroCar.api',
        'enviroCar.auth',
        'enviroCar.track',
        'enviroCar.tracks',
        'enviroCar.profile',
        'enviroCar.community',
        'materialCalendar',
        'cl.paging',
        'rzModule'])
            .value("ecBaseUrl", "https://enviroCar.org/api/stable")
            .run(function ($rootScope, $state, $stateParams, UserCredentialsService) {
                console.log('app started');
                $rootScope.previewurl = "";
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
                UserCredentialsService.clearCredentials();
                
                $rootScope.$on("$stateChangeStart", function (event, toState, toParams,
                        fromState, fromParams) {
                            
                    var credits = UserCredentialsService.getCredentials();
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
    
    angular.module('enviroCar.profile', []);
    
    angular.module('enviroCar.community', []);

})();