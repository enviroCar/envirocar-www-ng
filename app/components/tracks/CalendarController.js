
(function () {
    'use strict';

    function TrackListCtrl(
            $scope,
            $state,
            $stateParams,
            $timeout,
            $mdDialog,
            $translate,
            UserCredentialsService,
            UserService) {
        "ngInject";
        $scope.onload_all_tracks_page = false;
        $scope.tracksAvailable = false;
        var tab_a = true;
        var tab_b = false;
        var tab_c = false;

        var username;
        var token;
        var credits = UserCredentialsService.getCredentials();
        if (credits) {
            username = credits.username;
            token = credits.password;
        }

        // ask server for number user tracks:
        UserService.getTotalUserTracks(username, token).then(
                function (data) {
                    console.log(data);
                    var track_number = data;
                    if (track_number > 0)
                        $scope.tracksAvailable = true;
                    else
                        $scope.tracksAvailable = false;

                },
                function (data) {
                    $scope.tracksAvailable = false;
                    console.log("error " + data)
                }
        );

        $scope.showAlert = function (ev, title, description) {
            var dialog_title = $translate.instant(title);
            var dialog_desc = $translate.instant(description);
            $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title(dialog_title)
                    .textContent(dialog_desc)
                    .ariaLabel('Popover')
                    .ok('Okay!')
                    .targetEvent(ev)
                    .fullscreen(true)
                    );
        };

        $scope.goToActivity = function (trackid) {
            //redirect to the track analytics page.
            $state.go('chart', {
                'trackid': trackid
            });
        };

        $scope.$on('trackspage:all_tracks_tab-loaded', function (event, args) {
            tab_a = true;
            if (tab_a && tab_b && tab_c) {
                $scope.onload_all_tracks_page = true;
                $timeout(function () {
                    window.dispatchEvent(new Event('resize'));
                    $timeout(function () {
                        window.dispatchEvent(new Event('resize'));
                    }, 600);
                }, 400);
            }
        });
        $scope.$on('trackspage:pagination_tab-loaded', function (event, args) {
            tab_b = true;
            if (tab_a && tab_b && tab_c) {
                $scope.onload_all_tracks_page = true;
                $timeout(function () {
                    window.dispatchEvent(new Event('resize'));
                    $timeout(function () {
                        window.dispatchEvent(new Event('resize'));
                    }, 600);
                }, 400);
            }
        });
        $scope.$on('trackspage:calendar_tab-loaded', function (event, args) {
            tab_c = true;
            if (tab_a && tab_b && tab_c) {
                $scope.onload_all_tracks_page = true;
                $timeout(function () {
                    window.dispatchEvent(new Event('resize'));
                    $timeout(function () {
                        window.dispatchEvent(new Event('resize'));
                    }, 600);
                }, 400);
            }
        });
    }
    ;

    angular.module('enviroCar.tracks')
            .controller('TrackListCtrl', TrackListCtrl);

})();