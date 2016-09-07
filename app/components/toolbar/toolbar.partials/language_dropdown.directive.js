(function () {

    function languageDropdown() {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            template: '' +
                    '<div class="language-select" >' +
                        '<label>' +
                            '<select ng-model="currentLocaleDisplayName"' +
                                'ng-options="localesDisplayName for localesDisplayName in localesDisplayNames"' +
                                'ng-change="changeLanguage(currentLocaleDisplayName)">' +
                            '</select>' +
                        '</label>' +
                    '</div>' +
                    '',
            controller: 'LanguageDropdownCtrl'
            };
        };

    angular.module('enviroCar')
            .directive('languageDropdown', languageDropdown);
})();