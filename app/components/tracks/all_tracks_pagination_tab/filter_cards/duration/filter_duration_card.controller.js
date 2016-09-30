(function () {
    'use strict';
    function FilterDurationCardCtrl($scope) {
        $scope.errorNegative = false;
        $scope.errorOverlap = false;
        $scope.minDurationFilter = $scope.duration_min;
        $scope.maxDurationFilter = $scope.duration_max;
        $scope.filters.duration.params.min = $scope.duration_min;
        $scope.filters.duration.params.max = $scope.duration_max;
        
        $scope.hide = function () {
            $scope.errorNegative = false;
            $scope.errorOverlap = false;

            if ($scope.minDurationFilter < 0 || $scope.maxDurationFilter < 0)
            {
                // Negative values given for distance.
                $scope.errorNegative = true;
            } else if ($scope.minDurationFilter > $scope.maxDurationFilter)
            {
                // If minimum distance value is larger than maximum distance value
                $scope.errorOverlap = true;
            } else {
                // None of the errors occured! Can successfully set filters
                $scope.filters.duration.params.min = ($scope.minDurationFilter !== undefined) ? $scope.minDurationFilter : $scope.duration_min;
                $scope.filters.duration.params.max = ($scope.maxDurationFilter !== undefined) ? $scope.maxDurationFilter : $scope.duration_max;
                $scope.filters.duration.inUse = true;
                $scope.filtersChanged();
            }
        };
    }
    ;

    angular.module('enviroCar.tracks')
            .controller('FilterDurationCardCtrl', FilterDurationCardCtrl);
})();
