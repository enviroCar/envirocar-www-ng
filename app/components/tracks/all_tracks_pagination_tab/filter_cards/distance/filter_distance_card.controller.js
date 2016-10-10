(function () {
    'use strict';
    function FilterDistanceCardCtrl($scope, $state, $timeout) {

        // load state values:
        var state = $state.current.data;

        $scope.filters.distance.params.min = (state.distance.min ? state.distance.min : $scope.distance_min);
        $scope.filters.distance.params.max = (state.distance.max ? state.distance.max : $scope.distance_max);

        $scope.sliderDistance = {
            minValue: (state.distance.min ? state.distance.min : $scope.distance_min),
            maxValue: (state.distance.max ? state.distance.max : $scope.distance_max),
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


        $scope.filtersChanged();

        $timeout(function () {
            window.dispatchEvent(new Event('resize'))
        },
                50);

        $scope.changeSelectionRange = function (a, b) {
            $scope.filters.distance.params.min = a;
            $scope.filters.distance.params.max = b;
            $state.current.data.distance.inUse = true;
            $state.current.data.distance.min = a;
            $state.current.data.distance.max = b;

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
