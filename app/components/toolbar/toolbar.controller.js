(function(){
    'use strict';

    function ToolbarCtrl($scope){

        $scope.title = 'enviroCar Webapp';

    };

    angular.module('enviroCar')
        .controller('ToolbarCtrl', ToolbarCtrl);
})();
