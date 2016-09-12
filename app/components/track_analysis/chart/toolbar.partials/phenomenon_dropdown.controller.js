(function () {

    PhenomenonDropdownCtrl = function ($rootScope, $scope, $translate, $cookieStore) {
        $scope.phenomenon = $translate.instant('SPEED');
        $scope.storeSelection = 0;
        $scope.phenomenonNamesEnglish = [
            'Speed',
            'Consumption',
            'CO2',
            'Rpm',
            'Engine Load'
        ];
        $scope.phenomenonNames = [
            $translate.instant('SPEED'),
            $translate.instant('CONSUMPTION'),
            $translate.instant('CO2'),
            $translate.instant('RPM'),
            $translate.instant('ENGINE_LOAD')
        ];
        $scope.currentPhenomenonDisplayName = $scope.phenomenon;
        $scope.changePhenomenon = function (selectedPhenom) {
            $scope.currentPhenomenonDisplayName = selectedPhenom;
            $scope.phenomenon = selectedPhenom;
            for (var index = 0; index < 5; index++) {
                if ($scope.phenomenonNames[index] === $scope.phenomenon)
                    $scope.storeSelection = index;
            }
            var phenomenon_english = $scope.phenomenonNamesEnglish[$scope.storeSelection];
            $rootScope.$broadcast('track-toolbar:phenomenon-changed', phenomenon_english);
        };

        $scope.$on('toolbar:language-changed', function (event, args) {
            console.log("language changed received.");
            $scope.phenomenonNames = [
                $translate.instant('SPEED'),
                $translate.instant('CONSUMPTION'),
                $translate.instant('CO2'),
                $translate.instant('RPM'),
                $translate.instant('ENGINE_LOAD')
            ];
            $scope.phenomenon = $scope.phenomenonNames[$scope.storeSelection];
            $scope.currentPhenomenonDisplayName = $scope.phenomenon;
        });

    };

    angular.module('enviroCar')
            .controller('PhenomenonDropdownCtrl', PhenomenonDropdownCtrl);

})();
