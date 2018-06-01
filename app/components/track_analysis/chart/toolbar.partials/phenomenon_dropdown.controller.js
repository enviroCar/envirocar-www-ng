(function () {

    PhenomenonDropdownCtrl = function ($rootScope, $scope, $translate, $cookieStore) {
        $scope.phenomenon = $translate.instant('SPEED');
        $scope.storeSelection = 0;
        $scope.phenomsIDs = [
            'SPEED',
            'CONSUMPTION',
            'CO2',
            'RPM',
            'ENGINE_LOAD',
            'GPS_SPEED'
        ];
        $scope.phenomenonNamesEnglish = [
            'Speed',
            'Consumption',
            'CO2',
            'Rpm',
            'Engine Load',
            'GPS Speed'
        ];
        $scope.phenomenonNames = [
            $translate.instant('SPEED'),
            $translate.instant('CONSUMPTION'),
            $translate.instant('CO2'),
            $translate.instant('RPM'),
            $translate.instant('ENGINE_LOAD'),
            $translate.instant('GPS_SPEED')
        ];
        $scope.currentPhenomenonDisplayName = $scope.phenomenon;
        $scope.changePhenomenon = function (selectedPhenom) {
            $scope.currentPhenomenonDisplayName = selectedPhenom;
            $scope.phenomenon = selectedPhenom;
            for (var index = 0; index < 6; index++) {
                if ($scope.phenomenonNames[index] === $scope.phenomenon)
                    $scope.storeSelection = index;
            }
            var phenomenon_english = $scope.phenomenonNamesEnglish[$scope.storeSelection];
            $rootScope.$broadcast('track-toolbar:phenomenon-changed', phenomenon_english);
        };

        $scope.$on('single_track_page:phenomenons-available', function (event, args) {
            console.log(args);
            $scope.phenomenonNamesEnglish = [
            ];
            $scope.phenomenonNames = [
            ];
            $scope.phenomsIDs = [
            ];
            if (args['Speed']) {
                $scope.phenomenonNamesEnglish.push('Speed');
                $scope.phenomenonNames.push($translate.instant('SPEED'));
                $scope.phenomsIDs.push('SPEED');
            }
            if (args['Consumption']) {
                $scope.phenomenonNamesEnglish.push('Consumption');
                $scope.phenomenonNames.push($translate.instant('CONSUMPTION'));
                $scope.phenomsIDs.push('CONSUMPTION');
            }
            if (args['CO2']) {
                $scope.phenomenonNamesEnglish.push('CO2');
                $scope.phenomenonNames.push($translate.instant('CO2'));
                $scope.phenomsIDs.push('CO2');
            }
            if (args['Rpm']) {
                $scope.phenomenonNamesEnglish.push('Rpm');
                $scope.phenomenonNames.push($translate.instant('RPM'));
                $scope.phenomsIDs.push('RPM');
            }
            if (args['Engine Load']) {
                $scope.phenomenonNamesEnglish.push('Engine Load');
                $scope.phenomenonNames.push($translate.instant('ENGINE_LOAD'));
                $scope.phenomsIDs.push('ENGINE_LOAD');
            }
            if (args['GPS Speed']) {
                $scope.phenomenonNamesEnglish.push('GPS Speed');
                $scope.phenomenonNames.push($translate.instant('GPS_SPEED'));
                $scope.phenomsIDs.push('GPS_SPEED');
            }
        });

        $scope.$on('toolbar:language-changed', function (event, args) {
            console.log("language changed received.");
            $scope.phenomenonNames = [];
            for (var i = 0; i < $scope.phenomsIDs.length; i++){
                $scope.phenomenonNames.push($translate.instant($scope.phenomsIDs[i]));
            }
            console.log($scope.phenomenonNames);
            $scope.phenomenon = $scope.phenomenonNames[$scope.storeSelection];
            $scope.currentPhenomenonDisplayName = $scope.phenomenon;
        });

    };

    angular.module('enviroCar')
            .controller('PhenomenonDropdownCtrl', PhenomenonDropdownCtrl);

})();
