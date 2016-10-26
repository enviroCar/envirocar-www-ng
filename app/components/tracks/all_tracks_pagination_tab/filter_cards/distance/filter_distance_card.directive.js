(function() {

    function filterDistanceCard() {
        return {
            restrict: 'EA',
            templateUrl: './app/components/tracks/all_tracks_pagination_tab/filter_cards/distance/filter_distance_card.directive.html',
            controller: 'FilterDistanceCardCtrl'
        };
    };

    angular.module('enviroCar.tracks')
        .directive('filterDistanceCard', filterDistanceCard);
})();