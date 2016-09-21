(function () {

    function languageMenu() {
        'use strict';
        return {
            restrict: 'EA',
            templateUrl: '/app/components/toolbar/toolbar.partials/language_menu/language_menu.directive.html',
            controller: 'LanguageMenuCtrl'
            };
        };

    angular.module('enviroCar')
            .directive('languageMenu', languageMenu);
})();