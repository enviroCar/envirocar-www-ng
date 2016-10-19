(function () {
    'use strict';
    function FilterDistanceCardCtrl($scope, $timeout, FilterStateService) {

        // load state values:
        var state = FilterStateService.getDistanceFilterState();

        $scope.filters.distance.params.min = (state.min ? state.min : $scope.distance_min);
        $scope.filters.distance.params.max = (state.max ? state.max : $scope.distance_max);

        $scope.sliderDistance = {
            minValue: (state.min ? state.min : $scope.distance_min),
            maxValue: (state.max ? state.max : $scope.distance_max),
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

        $scope.setToUnused = function(){
            $scope.filters.distance.inUse = false;
            FilterStateService.setFilterInUse('distance', false);
        };

        $scope.changeSelectionRange = function (a, b) {
            $scope.filters.distance.params.min = a;
            $scope.filters.distance.params.max = b;

            FilterStateService.setDistanceFilterState(
                    true, 
                    a,
                    b
            );

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
