(function() {

    function lineChartWithoutFocus() {
        return {
            restrict: 'EA',
            templateUrl: '/app/components/track_analysis/line_chart/line_chart_without_focus.directive.html',
            controller: 'LineChartWithoutFocusCtrl',
            controllerAs: 'vm'
        }
    }

    angular.module('enviroCar')
        .directive('lineChartWithoutFocus', lineChartWithoutFocus);
})();