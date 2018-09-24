(function () {

    LanguageMenuCtrl = function ($rootScope, $scope, $translate, $cookieStore) {
        "ngInject";
        
        
        $scope.currOption = {
            name: 'English',
            shortcut: 'en',
            image: 'app/components/assets/button_icons/engl-flag-40x30.jpg'
        };

        $scope.optionsLanguage = [
            {
                name: 'Deutsch',
                shortcut: 'de',
                image: 'app/components/assets/button_icons/germ-flag-40x30.jpg'
            },
            {
                name: 'English',
                shortcut: 'en',
                image: 'app/components/assets/button_icons/engl-flag-40x30.jpg'
            }
        ];

        $scope.currOption = $scope.optionsLanguage[1];
        var language = {
            'name': 'English',
            'shortcut': 'en',
        };
//        $scope.image_loaded = true;

        language = $cookieStore.get('language');

        $scope.saveLanguageSetting = function () {
            language = {
                'name': $scope.currOption.name,
                'shortcut': $scope.currOption.shortcut
            };
            $cookieStore.put('language', language);
        };

        if (!language) {
            // default language: english
            $translate.use('en');
            $scope.currOption = $scope.optionsLanguage[1];
            $scope.saveLanguageSetting();
        } else {
            // use language from cookies:
            $translate.use(language.shortcut);
            switch (language.shortcut) {
                case 'en':
                    $translate.use('en');
                    $scope.currOption = $scope.optionsLanguage[1];
                    break;
                case 'de':
                    $translate.use('de');
                    $scope.currOption = $scope.optionsLanguage[0];
                    break;
            }
        }

        $scope.changeLanguage = function () {
            if ($scope.currOption.shortcut === 'en') {
                // switch to DE:
                $scope.currOption = $scope.optionsLanguage[0];
            } else {
                // switch to EN:
                $scope.currOption = $scope.optionsLanguage[1];
            }
            $scope.saveLanguageSetting();
            $translate.use($scope.currOption.shortcut);
            $rootScope.$broadcast('toolbar:language-changed', $scope.language);
        };
    };

    angular.module('enviroCar')
            .controller('LanguageMenuCtrl', LanguageMenuCtrl);

})();
