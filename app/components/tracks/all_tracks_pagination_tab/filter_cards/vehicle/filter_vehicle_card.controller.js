(function () {
    'use strict';
    function FilterVehicleCardCtrl($scope, $state) {

        // load state values:
        var state = $state.current.data;
        console.log(state);

        $scope.errorNothingSelected = false;
        $scope.items = [];
        $scope.selected = [];

        $scope.filters.vehicle.params.cars_set = (state.vehicle.set ? state.vehicle.set : []);
        $scope.filters.vehicle.params.cars_all = (state.vehicle.all ? state.vehicle.all : []);

        if ($scope.filters.vehicle.params.cars_set.length > 0) {
            for (var i = 0; i < $scope.filters.vehicle.params.cars_set.length; i++) {
                $scope.selected.push($scope.filters.vehicle.params.cars_set[i]);
            }
            // check only previous state checked cars:
            $scope.filters.vehicle.params.cars_set = [];
            for (var i = 0; i < $scope.filters.vehicle.params.cars_all.length; i++) {
                $scope.items.push($scope.filters.vehicle.params.cars_all[i]);
                $scope.filters.vehicle.params.cars_set.push($scope.filters.vehicle.params.cars_all[i]);
            }
        } else {
            // default: check all:
            for (var i = 0; i < $scope.filters.vehicle.params.cars_all.length; i++) {
                $scope.items.push($scope.filters.vehicle.params.cars_all[i]);
                $scope.selected.push($scope.filters.vehicle.params.cars_all[i]);
                $scope.filters.vehicle.params.cars_set.push($scope.filters.vehicle.params.cars_all[i]);
            }
        }
        state.vehicle.set = $scope.filters.vehicle.params.cars_set;

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
                $scope.filters.vehicle.params.cars_set.splice(idx, 1);
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


    }
    ;
    angular.module('enviroCar.tracks')
            .controller('FilterVehicleCardCtrl', FilterVehicleCardCtrl);
})();
