(function() {

    function allTracksTab() {
        return {
            restrict: 'EA',
            templateUrl: './app/components/tracks/all_tracks_tab/all_tracks_tab.directive.html',
            controller: 'AllTracksTabCtrl',
            controllerAs: 'vm'
        }
    }

    angular.module('enviroCar')
        .directive('allTracksTab', allTracksTab);
})();
