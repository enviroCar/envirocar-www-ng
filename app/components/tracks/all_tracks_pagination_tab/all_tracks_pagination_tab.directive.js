(function() {

    function allTracksPaginationTab() {
        return {
            restrict: 'EA',
            templateUrl: './app/components/tracks/all_tracks_pagination_tab/all_tracks_pagination_tab.directive.html',
            controller: 'AllTracksPaginationTabCtrl',
            controllerAs: 'vm'
        }
    }

    angular.module('enviroCar')
        .directive('allTracksPaginationTab', allTracksPaginationTab);
})();
