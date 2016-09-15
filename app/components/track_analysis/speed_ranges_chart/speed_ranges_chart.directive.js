(function() {

    function speedRangesChart() {
        return {
            restrict: 'EA',
            templateUrl: '/app/components/track_analysis/speed_ranges_chart/speed_ranges_chart.directive.html',
            controller: 'SpeedRangesChartCtrl'
        };
    }

    angular.module('enviroCar')
        .directive('speedRangesChart', speedRangesChart);
})();