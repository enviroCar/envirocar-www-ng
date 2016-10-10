(function () {
    'use strict';
    function FilterVehicleCardCtrl($scope, $state, $timeout) {
        
        $scope.errorNothingSelected = false;
        $scope.items = [];
        $scope.selected = [];

        // load state values:
        var state = $state.current.data;

        // load filter options from state params:
        $scope.filters.vehicle.params.cars_set = (state.vehicle.set.length>0 ? state.vehicle.set : []);
        $scope.filters.vehicle.params.cars_all = (state.vehicle.all.length>0 ? state.vehicle.all : []);

        $scope.items = $scope.filters.vehicle.params.cars_all;
        $scope.selected = $scope.filters.vehicle.params.cars_set;

        if ($scope.filters.vehicle.params.cars_set.length > 0) {
            // filter options loaded from state:
            // do nothing / 
        } else {
            // default: check all:
            for (var i = 0; i < $scope.items.length; i++) {
                $scope.selected.push($scope.items[i]);
                $scope.filters.vehicle.params.cars_set.push($scope.items[i]);
            }
            state.vehicle.set = $scope.filters.vehicle.params.cars_set;
        }

        $scope.hide = function () {
            $scope.errorNothingSelected = false;
            if ($scope.filters.vehicle.params.cars_set.length === 0) {
                $scope.errorNothingSelected = true;
            } else {
                // check status of each checkbox
                $scope.filters.vehicle.inUse = true;
                $scope.filtersChanged();
                state.vehicle.set = $scope.filters.vehicle.params.cars_set;
                state.vehicle.all = $scope.filters.vehicle.params.cars_all;
                state.vehicle.inUse = true;
            }
        };

        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                if ($scope.filters.vehicle.params.cars_set.length === 1) {
                    $scope.errorNothingSelected = true;
                }
                list.splice(idx, 1);
                var idx2 = $scope.filters.vehicle.params.cars_set.indexOf(item);
                if (idx2 > -1) {
                    $scope.filters.vehicle.params.cars_set.splice(idx2, 1);
                }
            } else {
                list.push(item);
                $scope.filters.vehicle.params.cars_set.push(item);
            }
            $scope.hide();
        };

        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.hide();
        
        $scope.filtersChanged();

        $timeout(function () {
            window.dispatchEvent(new Event('resize'))
        },
                50);


    }
    ;
    angular.module('enviroCar.tracks')
            .controller('FilterVehicleCardCtrl', FilterVehicleCardCtrl);
})();
