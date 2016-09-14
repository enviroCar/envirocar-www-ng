(function(){
    'use strict';
    
    function trackSummary(){
        return {
            restrict: 'EA',
            templateUrl: 'app/components/track_analysis/track_summary/tracksummary.directive.html',
            controller: 'TrackSummaryCtrl'
        };
    }
    
    angular.module('enviroCar')
            .directive('trackSummary', trackSummary);
})();