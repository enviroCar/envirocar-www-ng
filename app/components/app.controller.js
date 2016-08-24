(function() {
    'use strict';

    function AppCtrl($scope) {
        $scope.message = 'Initial Setup';
    }

    angular.module('enviroCar')
        .controller('AppCtrl', AppCtrl);
})();
