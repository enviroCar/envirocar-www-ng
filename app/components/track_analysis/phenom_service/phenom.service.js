(function() {
    'use strict';
    
    function PhenomenonService(){
            
            console.log("PhenomenonService started.");
            var phenomenon = {
                'name'  : 'Speed',
                'index' : 0
            };
            
            this.setPhenomenon = function(name, index) {
                phenomenon.name = name;
                phenomenon.index = index;
            };
            
            this.getPhenomenon = function(){
                return phenomenon;
            };
            
            this.resetPhenomenon = function(){
                phenomenon.name = '';
                phenomenon.index = 0;
            };
            
        };
      
    angular.module('enviroCar.track')
            .service('PhenomenonService', PhenomenonService);
})();
