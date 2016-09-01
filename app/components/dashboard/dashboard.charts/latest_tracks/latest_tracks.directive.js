(function() {

    function latestTracksChart() {
        return {
            restrict: 'EA',
            templateUrl: '/app/components/dashboard/dashboard.charts/latest_tracks/latest_tracks.directive.html',
            controller: 'LatestTracksChartCtrl',
            controllerAs: 'vm'
        }
    }

    angular.module('enviroCar')
        .directive('latestTracksChart', latestTracksChart);
})();