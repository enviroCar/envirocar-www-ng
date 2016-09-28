(function () {

    DurationDialogCtrl = function ($scope, $translate, $mdDialog) {
        $scope.valid = function ()
        {
            return true;
        };
        // The flags for 2 error checks that are to be performed

        $scope.errorNegative = false;
        $scope.errorOverlap = false;
        $scope.errorNoInput = false;
        if ($scope.filters.duration.inUse)
        {
            // If it was already present/ We are only load the previous values
            $scope.minDurationFilter = $scope.filters.duration.params.min;
            $scope.maxDurationFilter = $scope.filters.duration.params.max;
        }


        $scope.hide = function () {
            $scope.errorNegative = false;
            $scope.errorOverlap = false;

            if (($scope.minDurationFilter === undefined) && ($scope.maxDurationFilter === undefined)) {
                $scope.errorNoInput = true;
            } else if ($scope.minDurationFilter < 0 || $scope.maxDurationFilter < 0)
            {
                // Negative values given for distance.
                $scope.errorNegative = true;
            } else if ($scope.minDurationFilter > $scope.maxDurationFilter)
            {
                // If minimum distance value is larger than maximum distance value
                $scope.errorOverlap = true;
            } else {
                // None of the errors occured! Can successfully set filters
                $scope.filters.duration.params.min = ($scope.minDurationFilter !== undefined) ? $scope.minDurationFilter : 0;
                $scope.filters.duration.params.max = ($scope.maxDurationFilter !== undefined) ? $scope.maxDurationFilter : undefined;
                $scope.filters.duration.inUse = true;
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
            .controller('DurationDialogCtrl', DurationDialogCtrl);

})();
