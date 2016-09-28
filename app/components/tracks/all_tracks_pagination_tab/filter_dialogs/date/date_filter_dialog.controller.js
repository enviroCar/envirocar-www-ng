(function () {

    DateDialogCtrl = function ($scope, $translate, $mdDialog) {
        
        $scope.errorOverlap = false;
        $scope.dateStartCustom = $scope.date_min;
        $scope.dateEndCustom = $scope.date_max;
        
        if ($scope.filters.date.inUse)
        {
            if ($scope.filters.date.params.min !== undefined)
                $scope.dateStartCustom = $scope.filters.date.params.min;
            if ($scope.filters.date.params.max !== undefined)
                $scope.dateEndCustom = $scope.filters.date.params.max;
        }
        
        $scope.hide = function () {
            $scope.errorOverlap = false;
            
            if ($scope.dateStartCustom.getTime() > $scope.dateEndCustom.getTime())
            {
                // If start date occurs after the end date.
                $scope.errorOverlap = true;
            } else {
                
                if ($scope.dateStartCustom !== undefined){
                    $scope.filters.date.params.min = $scope.dateStartCustom;
                    $scope.filters.date.params.min.setHours(0,0,0,0);
                } else {
                    $scope.filters.date.params.min = $scope.date_min;
                }
                if ($scope.dateEndCustom !== undefined){
                    $scope.filters.date.params.max = $scope.dateEndCustom;
                    $scope.filters.date.params.max.setHours(23,59,0,0);
                } else {
                    $scope.filters.date.params.max = $scope.date_max;
                }
                
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
