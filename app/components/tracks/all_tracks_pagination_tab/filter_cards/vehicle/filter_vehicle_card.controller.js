(function () {
    'use strict';
    function FilterVehicleCardCtrl($scope) {
           console.log($scope.filters);
    }
    ;

    angular.module('enviroCar.tracks')
            .controller('FilterVehicleCardCtrl', FilterVehicleCardCtrl);
})();
