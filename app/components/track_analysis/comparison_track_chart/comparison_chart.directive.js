(function() {

    function comparisonTrackChart() {
        return {
            restrict: 'EA',
            templateUrl: '/app/components/track_analysis/comparison_track_chart/comparison_chart.directive.html',
            controller: 'ComparisonTrackChartCtrl'
        };
    }

    angular.module('enviroCar')
        .directive('comparisonTrackChart', comparisonTrackChart);
})();