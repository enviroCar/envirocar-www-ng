(function () {

    DistanceDialogCtrl = function ($scope, $translate, $mdDialog) {
        $scope.valid = function ()
        {
            return true;
        };
        // The flags for 2 error checks that are to be performed

        $scope.errorNegative = false;
        $scope.errorOverlap = false;
        if ($scope.filters.distance.inUse)
        {
            // If it was already present/ We are onlt editing the chip that is already present, then load the previous values
            $scope.minDistanceFilter = $scope.filters.distance.params.min;
            $scope.maxDistanceFilter = $scope.filters.distance.params.max;
        }

        $scope.hide = function () {
            $scope.errorNegative = false;
            $scope.errorOverlap = false;
            $scope.distanceShow = false;

            if ($scope.minDistanceFilter < 0 || $scope.maxDistanceFilter < 0)
            {
                // Negative values given for distance.
                $scope.errorNegative = true;
            } else if ($scope.minDistanceFilter > $scope.maxDistanceFilter)
            {
                // If minimum distance value is larger than maximum distance value
                $scope.errorOverlap = true;
            } else {
                // None of the errors occured! Can successfully set filters
                $scope.filters.distance.params.min = ($scope.minDistanceFilter !== (undefined || null) ? $scope.minDistanceFilter : 0);
                $scope.filters.distance.params.max = ($scope.maxDistanceFilter !== (undefined || null) ? $scope.maxDistanceFilter : undefined);
                $scope.filters.distance.inUse = true;
                $mdDialog.hide();
                $scope.filtersChanged();
            }
        };

         $scope.cancel = function () {
            // The user clicked on cancel, so apply no changes
            $mdDialog.cancel();
        };

        $scope.$on('toolbar:language-changed', function (event, args) {
            console.log("language changed received in DistanceDialogCtrl.");
        });

    };

    angular.module('enviroCar.tracks')
            .controller('DistanceDialogCtrl', DistanceDialogCtrl);

})();
