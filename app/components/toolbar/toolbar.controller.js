(function(){
    'use strict';

    function ToolbarCtrl($rootScope, $scope, ecBaseUrl){
        
        console.log('ToolbarCtrl started.' + ecBaseUrl);
        $scope.title = 'enviroCar Webapp';
        
    };


    angular.module('enviroCar')
        .controller('ToolbarCtrl', ToolbarCtrl);
})();
