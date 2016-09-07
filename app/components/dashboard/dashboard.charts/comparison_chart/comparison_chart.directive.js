(function() {

    function comparisonChart() {
        return {
            restrict: 'EA',
            templateUrl: '/app/components/dashboard/dashboard.charts/comparison_chart/comparison_chart.directive.html',
            controller: 'ComparisonChartCtrl'
        };
    }

    angular.module('enviroCar')
        .directive('comparisonChart', comparisonChart);
})();