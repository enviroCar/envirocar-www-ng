(function() {

    function weekdaysChart() {
        return {
            restrict: 'EA',
            templateUrl: './app/components/dashboard/dashboard.charts/weekdays_chart/weekdays_chart.directive.html',
            controller: 'WeekdaysChartCtrl'
        };
    }

    angular.module('enviroCar')
        .directive('weekdaysChart', weekdaysChart);
})();