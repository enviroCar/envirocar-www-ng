(function() {

    function heatMapChart() {
        return {
            restrict: 'EA',
            templateUrl: './app/components/dashboard/dashboard.charts/heatmap/heat_map.directive.html',
            controller: 'HeatMapCtrl'
        };
    };

    angular.module('enviroCar')
        .directive('heatMapChart', heatMapChart);
})();