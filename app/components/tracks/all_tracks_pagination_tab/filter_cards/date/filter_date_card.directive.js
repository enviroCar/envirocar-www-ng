(function() {

    function filterDateCard() {
        return {
            restrict: 'EA',
            templateUrl: './app/components/tracks/all_tracks_pagination_tab/filter_cards/date/filter_date_card.directive.html',
            controller: 'FilterDateCardCtrl'
        };
    };

    angular.module('enviroCar.tracks')
        .directive('filterDateCard', filterDateCard);
})();