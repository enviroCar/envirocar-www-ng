// Here we set getter and setter function which sets and gets username and password. This module is used to carry username and password from login path to terms of use path and then to the dashboard


(function (){

    function ShareLocalDataService() {
        "ngInject";

        /**
         * This sets the username 
         * @param {String}
         */
        this.setUsername = function(username){
            this.userName = username;    
        }

        /**
         * This returns the username 
         * @returns {String} ....
         */
        this.getUsername = function () {
            return this.userName;
        }
        

        /**
         * This sets the password 
         * @param {String}
         */
        this.setPassword = function(password){
            this.password = password;    
        }

         /**
         * This returns the password from login. If you now inject the Service into your other module you can use this in the new module 
         * @returns {String} ....
         */
        this.getPassword = function () {
            return this.password;
        }
    
    }

    angular.module('enviroCar.api')
            .service('ShareLocalDataService', ShareLocalDataService);
})();