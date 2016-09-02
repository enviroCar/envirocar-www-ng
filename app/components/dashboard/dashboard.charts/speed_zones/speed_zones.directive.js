(function() {

    function speedZonesChart() {
        return {
            restrict: 'EA',
            templateUrl: '/app/components/dashboard/dashboard.charts/speed_zones/speed_zones.directive.html',
            controller: 'SpeedZonesChartCtrl'
        };
    }

    angular.module('enviroCar')
        .directive('speedZonesChart', speedZonesChart);
})();