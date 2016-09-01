(function() {

    function userVsCommunityChart() {
        return {
            restrict: 'EA',
            templateUrl: '/app/components/dashboard/dashboard.charts/user_vs_community/user_vs_community.directive.html',
            controller: 'UserVsCommunityChartCtrl'
        };
    }

    angular.module('enviroCar')
        .directive('userVsCommunityChart', userVsCommunityChart);
})();