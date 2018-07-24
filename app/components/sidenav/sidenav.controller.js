(function () {
    'use strict';

    function SidenavCtrl(
            $rootScope,
            $scope,
            $element,
            $mdMedia,
            $mdSidenav,
            $log,
            $q,
            $timeout,
            $translate) {
        "ngInject";

        $scope.menuItems = [{
                name: 'DASHBOARD',
                icon: 'dashboard',
                sref: '.dashboard',
                tooltip: 'TT_SN_DASHBOARD_OPEN',
                commingSoon: false
            }, {
                name: 'TRACKS',
                icon: 'directions_car',
                sref: '.tracks',
                tooltip: 'TT_SN_TRACKS_OPEN',
                commingSoon: false
            }, {
                name: 'TABLE',
                icon: 'person',
                sref: '.profile',
                tooltip: 'TT_SN_PROFILE_OPEN',
                commingSoon: false
            }, {
                name: 'COMMUNITY',
                icon: 'pie_chart',
                sref: '.community',
                tooltip: 'TT_SN_SEGMENT_OPEN',
                commingSoon: true
            }];

        $scope.selectItem = selectItem;
        $scope.toggleItemsList = toggleItemsList;
        //vm.title = $state.current.data.title;
        //vm.showSimpleToast = showSimpleToast;

        $scope.menuItems[0]['name'] = 'DASHBOARD';
        $scope.menuItems[1]['name'] = 'TRACKS';
        $scope.menuItems[2]['name'] = 'TABLE';
        $scope.menuItems[3]['name'] = 'COMMUNITY';
        $scope.menuItems[0]['tooltip'] = 'TT_SN_DASHBOARD_OPEN';
        $scope.menuItems[1]['tooltip'] = 'TT_SN_TRACKS_OPEN';
        $scope.menuItems[2]['tooltip'] = 'TT_SN_PROFILE_OPEN';
        $scope.menuItems[3]['tooltip'] = 'TT_SN_SEGMENT_OPEN';
        $scope.menuItems[0]['commingSoon'] = false;
        $scope.menuItems[1]['commingSoon'] = false;
        $scope.menuItems[2]['commingSoon'] = false;
        $scope.menuItems[3]['commingSoon'] = true;
        
        function selectItem(item) {
            $scope.title = item.name;
            $scope.collapse();
            $timeout(function () {
                window.dispatchEvent(new Event('resize'));
                $rootScope.$broadcast('sidenav:item-selected', $scope.language);
            }, 1000);
        }

        function toggleItemsList() {
            var pending = $q.when(true);
            pending.then(function () {
                $mdSidenav('left').toggle();
                $scope.collapse();
            });
        };

        $scope.navExpanded = true;

        $scope.toggleLeft = buildToggler('left');
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
        
        $scope.collapse = function () {
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
        
        
        $scope.collapse();

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
            };
        }
        ;

        $scope.openFeedback = function () {
            if ($translate.use() === 'de') {
                // german feedback form:
                window.open(
                        'https://docs.google.com/forms/d/e/1FAIpQLSdHX4CPrqYwh27HjWYV8ZsblvqVwGVC2B-7ZxWovVOCpGKuJQ/viewform',
                        '_blank'
                        );
            } else { //if ($translate.use() === 'en'){
                // english feedback form:
                window.open(
                        'https://docs.google.com/forms/d/e/1FAIpQLSdfanFDFmIEgD9p6GWyC9oEDXLhiMdE3hptZVCdV8WsG4Ik1g/viewform',
                        '_blank'
                        );

            }
        };

    }
    ;

    angular.module('enviroCar')
            .controller('SidenavCtrl', SidenavCtrl);
})();
