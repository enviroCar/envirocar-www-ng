(function () {

    function StatisticsService($http, ecBaseUrl) {
        
        /**
         * Gets the total statistics of a certain phenomenon
         * @param {String} username - authentication username
         * @param {String} token - authentication password of user
         * @param {String} phenomenon - the phenomenon's name
         * @returns {JSON} data - the json data array of all statistics of the phenomenon
         */
        this.getPhenomenonStatistics = function(username, token, phenomenon){
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/statistics/' + phenomenon,
                cache: true,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).success(function (res) {
                return res.data;
            }).error (function (error) {
                console.log("ResponseError @GET"+ecBaseUrl+"/statistics/"+phenomenon);
                return error;
            });
        };
        
        /**
         * Gets all statistics for a certain track
         * @param {String} username - authentication username
         * @param {String} token - authentication password of user
         * @param {String} trackID - trackID of the certain track
         * @returns {JSON} data - the json data array of all phenomenons
         */
        this.getStatistics = function(username, token, trackID){
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/statistics',
                cache: true,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).success(function (res) {
                return res.data;
            }).error(function (error) {
                console.log("ResponseError @GET"+ecBaseUrl+"/tracks/"+trackID+"/statistics");
                return error;
            });
        };
        
        /**
         * Gets the statistic of a certain track of a certain phenomenon
         * @param {String} username - authentication username
         * @param {String} token - authentication password of user
         * @param {String} trackID - trackID of the certain track
         * @param {String} phenomenon - the phenomenon's name
         * @returns {JSON} data - the json data array of all statistics of the track's phenomenon
         */
        this.getTrackPhenomenonStatistics = function(username, token, trackID, phenomenon){
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/tracks/' + trackID + '/statistics/' + phenomenon,
                cache: true,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).success(function (res) {
                return res.data;
            }).error (function (error) {
                console.log("ResponseError @GET"+ecBaseUrl+"/tracks/"+trackID+"/statistics/"+phenomenon);
                return error;
            });
        };
        
        /**
         * Gets all statistics for a certain track
         * @param {String} username - authentication username
         * @param {String} token - authentication password of user
         * @param {String} trackID - trackID of the certain track
         * @returns {JSON} data - the json data array of all phenomenons
         */
        this.getTrackStatistics = function(username, token, trackID){
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/tracks/' + trackID + '/statistics',
                cache: true,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).success(function (res) {
                return res.data;
            }).error (function (error) {
                console.log("ResponseError @GET"+ecBaseUrl+"/tracks/"+trackID+"/statistics");
                return error;
            });
        };
        
        /**
         * Gets the statistic of a certain user of a certain phenomenon
         * @param {String} username - username of the user
         * @param {String} token - authentication password of the user
         * @param {String} phenomenon - the phenomenon's name
         * @returns {JSON} data - the json data array of all statistics of the user's phenomenon
         */
        this.getUserPhenomenonStatistics = function(username, token, phenomenon){
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/statistics/' + phenomenon,
                cache: true,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).success(function (res) {
                return res.data;
            }).error(function (error) {
                console.log("ResponseError @GET"+ecBaseUrl+"/users/"+username+"/statistics/"+phenomenon);
                return error;
            });
        };
        
        /**
         * Gets all statistics for a certain user
         * @param {String} username - username of the user
         * @param {String} token - authentication password of the user
         * @returns {JSON} data - the json data array of all phenomenons of the user
         */
        this.getUserStatistics = function(username, token){
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/statistics',
                cache: true,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).success(function (res) {
                return res.data;
            }).error(function (error) {
                console.log("ResponseError @GET"+ecBaseUrl+"/users/"+username+"/statistics");
                return error;
            });
        };
        
    };

    angular.module('enviroCar.api')
            .service('StatisticsService', StatisticsService);
})();