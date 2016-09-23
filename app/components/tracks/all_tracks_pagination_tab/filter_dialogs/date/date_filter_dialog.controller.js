(function () {

    DateDialogCtrl = function ($scope, $translate, $mdDialog) {
        
        $scope.errorOverlap = false;
        $scope.dateStartCustom = new Date();
        $scope.dateEndCustom = new Date();
        
        if ($scope.filters.date.inUse)
        {
            $scope.dateStartCustom = $scope.filters.date.params.min;
            $scope.dateEndCustom = $scope.filters.date.params.max;
        }
        
        $scope.hide = function () {
            $scope.errorOverlap = false;
            
            if ($scope.dateStartCustom.getTime() > $scope.dateEndCustom.getTime())
            {
                // If start date occurs fater the end date.
                $scope.errorOverlap = true;
            } else {
                $scope.filters.date.params.min = ($scope.dateStartCustom !== (undefined || null) ? $scope.minDistanceFilter : undefined);
                $scope.filters.date.params.max = ($scope.dateEndCustom !== (undefined || null) ? $scope.maxDistanceFilter : undefined);
                $scope.filters.date.inUse = true;
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
            .controller('DateDialogCtrl', DateDialogCtrl);

})();
