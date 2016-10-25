(function() {

    function filterVehicleCard() {
        return {
            restrict: 'EA',
            templateUrl: './app/components/tracks/all_tracks_pagination_tab/filter_cards/vehicle/filter_vehicle_card.directive.html',
            controller: 'FilterVehicleCardCtrl'
        };
    };

    angular.module('enviroCar.tracks')
        .directive('filterVehicleCard', filterVehicleCard);
})();