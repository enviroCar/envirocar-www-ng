(function() {

    function filterDurationCard() {
        return {
            restrict: 'EA',
            templateUrl: '/app/components/tracks/all_tracks_pagination_tab/filter_cards/duration/filter_duration_card.directive.html',
            controller: 'FilterDurationCardCtrl'
        };
    };

    angular.module('enviroCar.tracks')
        .directive('filterDurationCard', filterDurationCard);
})();