(function () {
    'use strict';
    function FilterDurationCardCtrl($scope, $timeout) {
        $scope.filters.duration.params.min = $scope.duration_min;
        $scope.filters.duration.params.max = $scope.duration_max;

        $scope.sliderDuration = {
            minValue: $scope.duration_min,
            maxValue: $scope.duration_max,
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
