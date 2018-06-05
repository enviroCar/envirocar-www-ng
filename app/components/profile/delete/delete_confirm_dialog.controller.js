(function () {

    DeleteUserCtrl = function (
            $scope,
            $mdDialog,
            UserCredentialsService,
            TrackService) {
        "ngInject";

        $scope.username = "";
        $scope.password = "";
        var credits = UserCredentialsService.getCredentials();
        if (credits) {
            $scope.username = credits.username;
            $scope.password = credits.password;
        }

        $scope.cb_delete_alltracks = true;
        $scope.total_user_tracks = 0;
        $scope.confirmPassword = "";
        $scope.errorWrongPassword = false;

        TrackService.getTotalUserTracks($scope.username, $scope.password).then(function (data) {
            $scope.total_user_tracks = data;
        }, function (error) {
            // TODO: abort mission!
        });

        // if dialog closes on success button
        $scope.deleteUser = function () {
            $scope.errorWrongPassword = false;
            if ($scope.confirmPassword === $scope.password) {
                $mdDialog.hide($scope.cb_delete_alltracks);
            } else {
                // feedback error wrong password.
                $scope.errorWrongPassword = true;
            }
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

    };
    angular.module('enviroCar.tracks')
            .controller('DeleteUserCtrl', DeleteUserCtrl);
})();
