(function() {

    function envirocarSidenav() {
        return {
            restrict: 'EA',
            templateUrl: '/app/components/sidenav/sidenav.directive.html',
            controller: 'SidenavCtrl',
            controllerAs: 'vm'
        }
    }

    angular.module('enviroCar')
        .directive('envirocarSidenav', envirocarSidenav);
})();
