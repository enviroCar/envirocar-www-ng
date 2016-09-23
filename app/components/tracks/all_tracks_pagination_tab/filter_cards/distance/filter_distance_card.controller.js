(function () {
    'use strict';
    function FilterDistanceCardCtrl($scope) {
           console.log($scope.filters);
    }
    ;

    angular.module('enviroCar')
            .controller('FilterDistanceCardCtrl', FilterDistanceCardCtrl);
})();
