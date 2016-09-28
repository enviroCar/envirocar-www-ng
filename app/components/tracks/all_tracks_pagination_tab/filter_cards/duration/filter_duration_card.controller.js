(function () {
    'use strict';
    function FilterDurationCardCtrl($scope) {
           console.log($scope.filters);
    }
    ;

    angular.module('enviroCar.tracks')
            .controller('FilterDurationCardCtrl', FilterDurationCardCtrl);
})();
