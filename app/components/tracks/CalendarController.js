
(function () {
    'use strict';

    function TrackListCtrl($scope, $timeout) {
        $scope.onload_all_tracks_page = false;
        var tab_a = false;
        var tab_b = false;
        $scope.$on('trackspage:all_tracks_tab-loaded', function (event, args) {
            console.log("all_tracks_tab loaded");
            tab_a = true;
            if (tab_a && tab_b) {
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
            console.log("calendar_tab loaded");
            tab_b = true;
            if (tab_a && tab_b) {
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

})()