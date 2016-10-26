(function () {

    function phenomenonDropdown() {
        'use strict';
        return {
            restrict: 'A',
            replace: true, 
            template: '' +
                    '<div class="phenomenon-select" >' +
                        '<label>' +
                            '<select ng-model="currentPhenomenonDisplayName"' +
                                'ng-options="phenomenonName for phenomenonName in phenomenonNames"' +
                                'ng-change="changePhenomenon(currentPhenomenonDisplayName)">' +
                            '</select>' +
                        '</label>' +
                    '</div>' +
                    '',
            controller: 'PhenomenonDropdownCtrl'
            };
        };

    angular.module('enviroCar')
            .directive('phenomenonDropdown', phenomenonDropdown);
})();