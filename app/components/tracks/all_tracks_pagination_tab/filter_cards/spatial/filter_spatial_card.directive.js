(function() {

    function filterSpatialCard() {
        return {
            restrict: 'EA',
            templateUrl: '/app/components/tracks/all_tracks_pagination_tab/filter_cards/spatial/filter_spatial_card.directive.html',
            controller: 'FilterSpatialCardCtrl'
        };
    };

    angular.module('enviroCar.tracks')
        .directive('filterSpatialCard', filterSpatialCard);
})();