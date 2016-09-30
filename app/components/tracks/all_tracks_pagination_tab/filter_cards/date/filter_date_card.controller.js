(function () {
    'use strict';
    function FilterDateCardCtrl($scope) {
        $scope.errorOverlap = false;
        $scope.dateStartCustom = $scope.date_min;
        $scope.dateStartCustom.setHours(0, 0, 0, 0);
        $scope.dateEndCustom = $scope.date_max;
        $scope.dateEndCustom.setHours(23, 59, 0, 0);
        $scope.filters.date.params.min = $scope.date_min;
        $scope.filters.date.params.min.setHours(0, 0, 0, 0);
        $scope.filters.date.params.max = $scope.date_max;
        $scope.filters.date.params.max.setHours(23, 59, 0, 0);

        $scope.hide = function () {
            $scope.errorOverlap = false;

            if ($scope.dateStartCustom.getTime() > $scope.dateEndCustom.getTime())
            {
                // If start date occurs after the end date.
                $scope.errorOverlap = true;
            } else {

                if ($scope.dateStartCustom !== undefined) {
                    $scope.filters.date.params.min = $scope.dateStartCustom;
                    $scope.filters.date.params.min.setHours(0, 0, 0, 0);
                } else {
                    $scope.filters.date.params.min = $scope.date_min;
                }
                if ($scope.dateEndCustom !== undefined) {
                    $scope.filters.date.params.max = $scope.dateEndCustom;
                    $scope.filters.date.params.max.setHours(23, 59, 0, 0);
                } else {
                    $scope.filters.date.params.max = $scope.date_max;
                }

                $scope.filtersChanged();
            }
        };

        console.log($scope.filters);
        /**
         var date_min = $scope.filters.date.params.min;
         var date_max = $scope.filters.date.params.max;
         var day_min = date_min.getDate();
         var month_min = date_min.getMonth() + 1;
         var year_min = date_min.getFullYear();
         var day_max = date_max.getDate();
         var month_max = date_max.getMonth() + 1;
         var year_max = date_max.getFullYear();
         $scope.min_date = day_min + "." + month_min + "." + year_min;
         $scope.max_date = day_max + "." + month_max + "." + year_max;
         */
    }
    ;

    angular.module('enviroCar.tracks')
            .controller('FilterDateCardCtrl', FilterDateCardCtrl);
})();
