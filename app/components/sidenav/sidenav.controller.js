(function () {
    'use strict';

    function SidenavCtrl($rootScope, $scope, $element, $mdMedia, $mdSidenav, $log, $translate, $q, navService) {
        var vm = this;
        vm.menuItems = [];
        vm.selectItem = selectItem;
        vm.toggleItemsList = toggleItemsList;
        //vm.title = $state.current.data.title;
        //vm.showSimpleToast = showSimpleToast;

        navService
                .loadAllItems()
                .then(function (menuItems) {
                    vm.menuItems = [].concat(menuItems);
                    $translate(['DASHBOARD', 'TRACKS', 'TABLE', 'SEGMENT',
                        'TT_SN_DASHBOARD_OPEN', 'TT_SN_TRACKS_OPEN',
                        'TT_SN_PROFILE_OPEN', 'TT_SN_SEGMENT_OPEN']).then(
                            function (translations) {
                                vm.menuItems[0]['name'] = 'DASHBOARD';
                                vm.menuItems[1]['name'] = 'TRACKS';
                                vm.menuItems[2]['name'] = 'TABLE';
                                vm.menuItems[3]['name'] = 'SEGMENT';
                                vm.menuItems[0]['tooltip'] = 'TT_SN_DASHBOARD_OPEN';
                                vm.menuItems[1]['tooltip'] = 'TT_SN_TRACKS_OPEN';
                                vm.menuItems[2]['tooltip'] = 'TT_SN_PROFILE_OPEN';
                                vm.menuItems[3]['tooltip'] = 'TT_SN_SEGMENT_OPEN';
                                vm.menuItems[0]['commingSoon'] = false;
                                vm.menuItems[1]['commingSoon'] = false;
                                vm.menuItems[2]['commingSoon'] = true;
                                vm.menuItems[3]['commingSoon'] = true;
                                console.log("menuitems:" + vm.menuItems);
                            });
                    vm.collapse();
                });

        function selectItem(item) {
            vm.title = item.name;
            vm.collapse();
            $rootScope.$broadcast('sidenav:item-selected', $scope.language);
        }

        function toggleItemsList() {
            console.log("fired here");
            var pending = $q.when(true);
            pending.then(function () {
                $mdSidenav('left').toggle();
                vm.collapse();
            });
        }
        ;

        $scope.navExpanded = true;

        $scope.toggleLeft = buildToggler('left');
        $scope.sideNavTitle = "  " + $translate.instant('WEBSITE-TITLE');
        var sideNav = angular.element($element[0].querySelector('#leftSideNav'));
        var sideNavTitlePadding = angular.element($element[0].querySelector('#sidenav-title'));

        $log.debug("sideNav: " + sideNav);

        $scope.close = function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('left').close()
                    .then(function () {
                        $log.debug("close LEFT is done");
                    });
        };
        $scope.open = function () {
            $mdSidenav('left').open()
                    .then(function () {
                        $log.debug("open LEFT is done");
                    });
        };
        vm.collapse = function () {
            if ($mdMedia('gt-xs')) {
                sideNav.css("min-width", "60px")
                sideNav.css("width", "60px")
                sideNav.css("max-width", "60px")
                sideNavTitlePadding.css("padding-left", "0em");
                $scope.sideNavTitle = "  ";
            } else {
                sideNav.css("min-width", "0px")
                sideNav.css("width", "0px")
                sideNav.css("max-width", "0px")
                sideNavTitlePadding.css("padding-left", "0em");
                $scope.sideNavTitle = "  ";
            }

            $scope.navExpanded = false;
        };

        $scope.toggleExpand = function () {
            if (!$scope.navExpanded) {
                // Expanding:
                sideNav.css("min-width", "280px")
                sideNav.css("width", "280px")
                sideNav.css("max-width", "280px")
                sideNavTitlePadding.css("padding-left", "1.8em");
                $scope.sideNavTitle = $translate.instant('WEBSITE-TITLE');

                $scope.navExpanded = true;

            } else {
                // Collapsing:
                if ($mdMedia('gt-xs')) {
                sideNav.css("min-width", "60px")
                sideNav.css("width", "60px")
                sideNav.css("max-width", "60px")
                sideNavTitlePadding.css("padding-left", "0em");
                $scope.sideNavTitle = "  ";
            } else {
                sideNav.css("min-width", "0px")
                sideNav.css("width", "0px")
                sideNav.css("max-width", "0px")
                sideNavTitlePadding.css("padding-left", "0em");
                $scope.sideNavTitle = "  ";
            }

                $scope.navExpanded = false;

                $log.debug("sidenav collapsed");
            }
            if ($scope.navExpanded)
                $log.debug("expanded.");
        };

        function buildToggler(navID) {
            return function () {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            $log.debug("toggle " + navID + " is done");
                        });
            }
        }
        ;

    }
    ;

    angular.module('enviroCar')
            .controller('SidenavCtrl', SidenavCtrl);
})();
