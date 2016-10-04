(function () {
    'use strict';
    function FilterDistanceCardCtrl($scope, $timeout) {
        $scope.filters.distance.params.min = $scope.distance_min;
        $scope.filters.distance.params.max = $scope.distance_max;

        $scope.sliderDistance = {
            minValue: $scope.distance_min,
            maxValue: $scope.distance_max,
            options: {
                floor: $scope.distance_min,
                ceil: $scope.distance_max,
                step: 1,
                draggableRange: true,
                getSelectionBarColor: function (value) {
                    return '#8cbf3f';
                },
                getPointerColor: function (value) {
                    return '#8cbf3f';
                },
                translate: function (value) {
                    return '<font color="black">' + value + 'km</font>';
                },
                id: 'sliderDistance',
                onChange: function (id) {
                    $scope.changeSelectionRange($scope.sliderDistance.minValue, $scope.sliderDistance.maxValue);
                }
            }
        };

        $scope.changeSelectionRange = function (a, b) {
            $scope.filters.distance.params.min = a;
            ;
            $scope.filters.distance.params.max = b;
            $scope.filters.distance.inUse = true;
            $scope.filtersChanged();
        };
        $timeout(function () {
            window.dispatchEvent(new Event('resize'))
        },
                50);
    }
    ;

    angular.module('enviroCar.tracks')
            .controller('FilterDistanceCardCtrl', FilterDistanceCardCtrl);
})();
