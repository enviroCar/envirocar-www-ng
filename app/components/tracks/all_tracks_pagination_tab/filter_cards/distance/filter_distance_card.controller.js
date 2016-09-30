(function () {
    'use strict';
    function FilterDistanceCardCtrl($scope) {
        console.log($scope.filters);
        $scope.errorNegative = false;
        $scope.errorOverlap = false;
        $scope.errorNoInput = false;
        $scope.minDistanceFilter = $scope.distance_min;
        $scope.maxDistanceFilter = $scope.distance_max;
        $scope.filters.distance.params.min = $scope.distance_min;
        $scope.filters.distance.params.max = $scope.distance_max;

        $scope.hide = function () {
            $scope.errorNegative = false;
            $scope.errorOverlap = false;
            $scope.errorNoInput = false;

            if ($scope.minDistanceFilter < 0 || $scope.maxDistanceFilter < 0)
            {
                // Negative values given for distance.
                $scope.errorNegative = true;
            } else if (($scope.minDistanceFilter === undefined) && ($scope.maxDistanceFilter === undefined)) {
                $scope.errorNoInput = true;
            } else if ($scope.minDistanceFilter > $scope.maxDistanceFilter)
            {
                // If minimum distance value is larger than maximum distance value
                $scope.errorOverlap = true;
            } else {
                // None of the errors occured! Can successfully set filters
                $scope.filters.distance.params.min = ($scope.minDistanceFilter !== undefined) ? $scope.minDistanceFilter : $scope.distance_min;;
                $scope.filters.distance.params.max = ($scope.maxDistanceFilter !== undefined || null) ? $scope.maxDistanceFilter : $scope.distance_max;
                $scope.filters.distance.inUse = true;
                $scope.filtersChanged();
            }
        };
    }
    ;

    angular.module('enviroCar.tracks')
            .controller('FilterDistanceCardCtrl', FilterDistanceCardCtrl);
})();
