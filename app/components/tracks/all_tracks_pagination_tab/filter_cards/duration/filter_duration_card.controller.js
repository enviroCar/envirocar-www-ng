(function () {
    'use strict';
    function FilterDurationCardCtrl($scope, $timeout, FilterStateService) {
        "ngInject";
        
        // load state values:
        var state = FilterStateService.getDurationFilterState();
        
        $scope.filters.duration.params.min = (state.min? state.min : $scope.duration_min);
        $scope.filters.duration.params.max = (state.max? state.max : $scope.duration_max);

        $scope.sliderDuration = {
            minValue: (state.min? state.min : $scope.duration_min),
            maxValue: (state.max? state.max : $scope.duration_max),
            options: {
                floor: $scope.duration_min,
                ceil: $scope.duration_max,
                step: 1,
                draggableRange: true,
                getSelectionBarColor: function (value) {
                    return '#8cbf3f';
                },
                getPointerColor: function (value) {
                    return '#8cbf3f';
                },
                translate: function (value) {
                    return '<font color="black">' + value + 'min</font>';
                },
                id: 'sliderDistance',
                onChange: function (id) {
                    $scope.changeSelectionRange($scope.sliderDuration.minValue, $scope.sliderDuration.maxValue);
                }
            }
        };

        $scope.setToUnused = function(){
            $scope.filters.duration.inUse = false;
            FilterStateService.setFilterInUse('duration', false);
        };
        
        $scope.changeSelectionRange = function (a, b) {
            $scope.filters.duration.params.min = a;
            $scope.filters.duration.params.max = b;
            
            FilterStateService.setDurationFilterState(
                    true, 
                    a,
                    b
            );
    
            $scope.filters.duration.inUse = true;
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
            .controller('FilterDurationCardCtrl', FilterDurationCardCtrl);
})();
