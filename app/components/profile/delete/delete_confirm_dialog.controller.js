(function () {

    DeleteUserCtrl = function (
            $scope,
            $mdDialog,
            UserCredentialsService,
            TrackService) {
        "ngInject";

        $scope.username = "";
        var credits = UserCredentialsService.getCredentials();
        if (credits) {
            $scope.username = credits.username;
        }

        $scope.cb_delete_alltracks = true;
        $scope.total_user_tracks = 0;
        $scope.confirmPassword = "";
        $scope.errorWrongPassword = false;

        TrackService.getUserTracks($scope.username).then(function (data) {
            console.log(data);
            $scope.total_user_tracks = data.data.tracks.length;
        }, function (error) {
            // TODO: abort mission!
        });

        // if dialog closes on success button
        $scope.deleteUser = function () {
            $mdDialog.hide($scope.cb_delete_alltracks);
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

    };
    angular.module('enviroCar.tracks')
            .controller('DeleteUserCtrl', DeleteUserCtrl);
})();
