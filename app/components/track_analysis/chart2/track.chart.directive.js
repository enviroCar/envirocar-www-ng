(function(){
    'use strict';
    
    function trackChart(){
        return {
            restrict: 'EA',
            link: function(scope, element){
                scope.attach(element[0]);
            },
            templateUrl: 'app/components/track_analysis/chart2/track.chart.directive.html',
            controller: 'TrackChartCtrl',
            controllerAs: 'vm'
        };
    }
    
    angular.module('enviroCar')
            .directive('trackChart', trackChart);
})();