(function() {

    function calendarTab() {
        return {
            restrict: 'EA',
            templateUrl: '/app/components/tracks/calendar_tab/calendar_tab.directive.html',
            controller: 'CalendarTabCtrl',
            controllerAs: 'vm'
        }
    }

    angular.module('enviroCar')
        .directive('calendarTab', calendarTab);
})();
