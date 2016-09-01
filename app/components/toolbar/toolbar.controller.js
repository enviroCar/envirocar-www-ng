(function(){
    'use strict';

    function ToolbarCtrl($scope, ecBaseUrl){
        
        console.log('ToolbarCtrl started.' + ecBaseUrl);
        $scope.title = 'enviroCar Webapp';
    };


    angular.module('enviroCar')
        .controller('ToolbarCtrl', ToolbarCtrl);
})();
