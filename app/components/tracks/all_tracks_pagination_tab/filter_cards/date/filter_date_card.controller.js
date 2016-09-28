(function () {
    'use strict';
    function FilterDateCardCtrl($scope) {
           console.log($scope.filters);
           var date_min = $scope.filters.date.params.min;
           var date_max = $scope.filters.date.params.max;
           var day_min = date_min.getDate();
           var month_min = date_min.getMonth()+1;
           var year_min = date_min.getFullYear();
           var day_max = date_max.getDate();
           var month_max = date_max.getMonth()+1;
           var year_max = date_max.getFullYear();
           $scope.min_date = day_min +"."+ month_min +"."+ year_min;
           $scope.max_date = day_max +"."+ month_max +"."+ year_max;
    }
    ;

    angular.module('enviroCar.tracks')
            .controller('FilterDateCardCtrl', FilterDateCardCtrl);
})();
