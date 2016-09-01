(function() {
    'use strict';
    
    function UserCredentialsService($cookieStore){
            
            console.log("UserCredentialsService started.");
            var usercredits = {
                'username' : '',
                'password' : ''
            };
            
            this.setCredentials = function(username, password) {
                usercredits.username = username;
                usercredits.password = password;
                $cookieStore.put('usercredits', usercredits);
            };
            
            this.getCredentials = function(){
                return usercredits;
            };
            
            this.clearCredentials = function(){
                usercredits.username = '';
                usercredits.password = '';
            };
            
            this.clearCookies = function(){
                $cookieStore.remove('usercredits');
            };
        };
      
    angular.module('enviroCar.auth')
            .service('UserCredentialsService', UserCredentialsService);
})();
