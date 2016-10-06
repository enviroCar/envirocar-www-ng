(function () {
    'use strict';
    function FilterDateCardCtrl($scope, $state, $timeout) {
        
        // load state values:
        var state = $state.current.data;
        
        $scope.dateStartCustom = $scope.date_min;
        $scope.dateEndCustom = $scope.date_max;
        $scope.filters.date.params.min = (state.date.min? state.date.min : $scope.date_min);
        $scope.filters.date.params.min.setHours(0, 0, 0, 0);
        $scope.filters.date.params.max = (state.date.max? state.date.max : $scope.date_max);
        $scope.filters.date.params.max.setHours(23, 59, 0, 0);

        $scope.sliderDate = {
            minValue: (state.date.min? state.date.min : $scope.date_min),
            maxValue: (state.date.max? state.date.max : $scope.date_max),
            options: {
                floor: $scope.dateStartCustom.getTime(),
                ceil: $scope.dateEndCustom.getTime(),
                step: 1,
                draggableRange: true,
                getSelectionBarColor: function (value) {
                    return '#8cbf3f';
                },
                getPointerColor: function (value) {
                    return '#8cbf3f';
                },
                translate: function (value) {
                    var date = new Date(value);
                    return '<font color="black">' + date.getDate() + "-" +(date.getMonth()+1)+"-"+date.getFullYear() + '</font>';
                },
                id: 'sliderDistance',
                onChange: function (id) {
                    $scope.changeSelectionRange($scope.sliderDate.minValue, $scope.sliderDate.maxValue);
                }
            }
        };

        $scope.changeSelectionRange = function (a, b) {
            $scope.filters.date.params.min = new Date(a);
            $scope.filters.date.params.min.setHours(0, 0, 0, 0);

            $scope.filters.date.params.max = new Date(b);
            $scope.filters.date.params.max.setHours(23, 59, 0, 0);
            
            $state.current.data.date.inUse = true;
            $state.current.data.date.min = new Date(a);
            $state.current.data.date.min.setHours(0, 0, 0, 0);
            $state.current.data.date.max = new Date(b);
            $state.current.data.date.max.setHours(23, 59, 0, 0);

            $scope.filters.date.inUse = true;
            $scope.filtersChanged();
        };
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
        $timeout(function () {
            window.dispatchEvent(new Event('resize'))
        },
                50);
    }
    ;

    angular.module('enviroCar.tracks')
            .controller('FilterDateCardCtrl', FilterDateCardCtrl);
})();
