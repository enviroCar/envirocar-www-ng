(function () {
    'use strict';
    function FilterDateCardCtrl($scope, $timeout, FilterStateService) {
        "ngInject";
        
        // load state values:
        var state = FilterStateService.getDateFilterState();
        
        
        $scope.dateStartCustom = $scope.date_min;
        $scope.dateEndCustom = $scope.date_max;
        $scope.filters.date.params.min = (state.min? state.min : $scope.date_min);
        $scope.filters.date.params.min.setHours(0, 0, 0, 0);
        $scope.filters.date.params.max = (state.max? state.max : $scope.date_max);
        $scope.filters.date.params.max.setHours(23, 59, 0, 0);

        $scope.sliderDate = {
            minValue: (state.min? state.min : $scope.date_min),
            maxValue: (state.max? state.max : $scope.date_max),
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

        $scope.setToUnused = function(){
            $scope.filters.date.inUse = false;
            FilterStateService.setFilterInUse('date', false);
        };
/**
        if ($scope.filters.date.inUse){
            FilterStateService.setDateFilterState(
                    true, 
                    $scope.filters.date.params.min,
                    $scope.filters.date.params.max
            );
        };*/

        $scope.changeSelectionRange = function (a, b) {
            $scope.filters.date.params.min = new Date(a);
            $scope.filters.date.params.min.setHours(0, 0, 0, 0);

            $scope.filters.date.params.max = new Date(b);
            $scope.filters.date.params.max.setHours(23, 59, 0, 0);
            
            var minimum = new Date(a);
            minimum.setHours(0, 0, 0, 0);
            var maximum = new Date(b);
            maximum.setHours(23, 59, 0, 0);
            
            FilterStateService.setDateFilterState(
                    true, 
                    minimum,
                    maximum
            );

            $scope.filters.date.inUse = true;
            $scope.filtersChanged();
        };
        
        $scope.filtersChanged();

        $timeout(function () {
            window.dispatchEvent(new Event('resize'))
        },
                50);
        
        $timeout(function () {
            window.dispatchEvent(new Event('resize'))
        },
                50);
    }
    ;

    angular.module('enviroCar.tracks')
            .controller('FilterDateCardCtrl', FilterDateCardCtrl);
})();
