(function () {
    'use strict';
    function FilterDurationCardCtrl($scope, $state, $timeout) {
        
        // load state values:
        var state = $state.current.data;
        
        $scope.filters.duration.params.min = (state.duration.min? state.duration.min : $scope.duration_min);
        $scope.filters.duration.params.max = (state.duration.max? state.duration.max : $scope.duration_max);

        $scope.sliderDuration = {
            minValue: (state.duration.min? state.duration.min : $scope.duration_min),
            maxValue: (state.duration.max? state.duration.max : $scope.duration_max),
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

        $scope.changeSelectionRange = function (a, b) {
            $scope.filters.duration.params.min = a;
            $scope.filters.duration.params.max = b;
            $state.current.data.duration.inUse = true;
            $state.current.data.duration.min = a;
            $state.current.data.duration.max = b;
            
            $scope.filters.duration.inUse = true;
            $scope.filtersChanged();
        };
        $timeout(function () {
            window.dispatchEvent(new Event('resize'))
        },
                50);
    }
    ;

    angular.module('enviroCar.tracks')
            .controller('FilterDurationCardCtrl', FilterDurationCardCtrl);
})();
