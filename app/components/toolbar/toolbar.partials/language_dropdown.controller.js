(function () {

    LanguageDropdownCtrl = function($scope, $translate, $cookieStore) {
        $scope.language = 'en_EN';
        $scope.localesDisplayNames = [
            'Deutsch',
            'English'
        ];
        $scope.currentLocaleDisplayName = "English";
        
        var language = {
            'name': 'English',
            'shortcut': 'en'
        };
        
        language = $cookieStore.get('language');
        
        $scope.saveLanguageSetting = function(){
            language = {
                'name'      : $scope.currentLocaleDisplayName,
                'shortcut'  : $scope.language
            };
            $cookieStore.put('language', language);
        };
        
        console.log(language);
        if (!language){
            console.log("language undefined");
            $translate.use('en');
            $scope.language = 'en';
            $scope.currentLocaleDisplayName = 'English';
            $scope.saveLanguageSetting();
        } else {
            console.log("language undefined");
            $translate.use(language.shortcut);
            $scope.language = language.shortcut;
            $scope.currentLocaleDisplayName = language.name;
            $scope.saveLanguageSetting();
        }
        
        $scope.changeLanguage = function () {
            if ($scope.language === 'de') {
                $translate.use('en');
                $scope.language = 'en';
                $scope.currentLocaleDisplayName = 'English';
                $scope.saveLanguageSetting();
            } else {
                $translate.use('de');
                $scope.language = 'de';
                $scope.currentLocaleDisplayName = 'Deutsch';
                $scope.saveLanguageSetting();
            }
        };
    };

    angular.module('enviroCar')
            .controller('LanguageDropdownCtrl', LanguageDropdownCtrl);

})();
