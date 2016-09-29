(function () {

    VehicleDialogCtrl = function ($scope, $translate, $mdDialog) {
        $scope.errorNothingSelected = false;

        $scope.containsCar = function (array, car) {
            var indexLooper = array.length;
            while (indexLooper--) {
                var carObj = JSON.parse(array[indexLooper]);
                if (carObj.car === car.car && carObj.manufacturer === car.manufacturer) {
                    return true;
                }
            }
            return false;
        };

        $scope.results = [];
        
        // Vehicle list is the object map of all vehicles that was extracted from the list of all tracks that was returned
        if ($scope.filters.vehicle.inUse)
        {
            // reload previously checked vehicles.
            // from filter checklist with checked==true whatsoever.
            for (var i = 0; i < $scope.filters.vehicle.params.cars_all.length; i++) {
                $scope.filters.vehicle.params.cars_all[i].checked = false;
            }
        }

        $scope.hide = function () {
            $scope.errorNothingSelected = false;
            if (0 === $scope.results.length) {
                $scope.errorNothingSelected = true;
            } else {
                $scope.filters.vehicle.params.cars_set = [];
                // None of the errors occured! Can successfully set filters
                for (var i = 0; i < $scope.filters.vehicle.params.cars_all.length; i++) {
                    if ($scope.containsCar($scope.results, $scope.filters.vehicle.params.cars_all[i])) {
                        $scope.filters.vehicle.params.cars_all[i].checked = true;
                        if (!$scope.containsVehicle($scope.filters.vehicle.params.cars_set, $scope.filters.vehicle.params.cars_all[i]))
                            $scope.filters.vehicle.params.cars_set.push($scope.filters.vehicle.params.cars_all[i]);
                    }
                }
                console.log($scope.filters);
                $scope.filters.vehicle.inUse = true;
                $mdDialog.hide();
                $scope.filtersChanged();
            }
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.$on('toolbar:language-changed', function (event, args) {
            console.log("language changed received in DistanceDialogCtrl.");
        });
    };
    angular.module('enviroCar.tracks')
            .controller('VehicleDialogCtrl', VehicleDialogCtrl);
})();
