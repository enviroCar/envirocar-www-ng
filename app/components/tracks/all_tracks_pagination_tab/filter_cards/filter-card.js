(function () {
    'use strict';

    function FilterDistanceCardCtrl($scope) {
        console.log($scope.filters);
        console.log("TEEEEEEEEEEEEEEEEEEEEEEEEST")
        $scope.showAlert=function(){
            console.log("bläh");
        }
    }
    ;

    function filterCard() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {title: '@', description: '@', btn_help: '@', btn_edit: '@', btn_close: '@', template: '@', options: '@'},
            template: '' +
                    '<md-card flex="100">' +
                    '   <div layout="row" flex="100">' +
                    '       <p style="color:#1A80C1;background-color:white; margin-left:20px;">' +
                    '           <span>{{title| translate}}</span>' +
                    '       </p>' +
                    '       <div layout="row" flex>' +
                    '           <span flex class="flex"></span>' +
                    '           <md-button ng-click="btn_help()" class="md-icon-button md-accent" aria-label="Info">' +
                    '               <md-icon class="material-icons  md-24">info</md-icon>' +
                    '               <md-tooltip>' +
                    '                   {{"CLICK_FOR_MORE_INFO"| translate}}' +
                    '               </md-tooltip>' +
                    '           </md-button>' +
                    '           <md-button ng-click="btn_edit" class="md-icon-button md-accent" aria-label="edit">' +
                    '               <md-icon class="material-icons md-24">build</md-icon>' +
                    '               <md-tooltip>' +
                    '                   {{"CLICK_TO_CHANGE_FILTER_OPTION"| translate}}' +
                    '               </md-tooltip>' +
                    '           </md-button>' +
                    '           <md-button ng-click="btn_close; filtersChanged()" class="md-icon-button md-warn" aria-label="close">' +
                    '               <md-icon class="material-icons  md-24">close</md-icon>' +
                    '               <md-tooltip>' +
                    '                   {{"CLICK_TO_REMOVE"| translate}}' +
                    '               </md-tooltip>' +
                    '           </md-button>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div ng-include="template"/>' +
                    '</md-card>',
            compile: function (element, attrs, linker) {
                return function (scope, element) {
                    linker(scope, function (clone) {
                        element.append(clone);
                    });
                };
            }
        };
    }
    ;

    angular.module('enviroCar.tracks')
            .directive('filterCard', filterCard)
            .controller('FilterDistanceCardCtrl', FilterDistanceCardCtrl);
})();