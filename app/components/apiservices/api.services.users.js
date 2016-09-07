(function () {

    function UserService($http, ecBaseUrl) {
        
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
        
        /**
         * Gets the total number of all enviroCar users.
         * @param {String} username - authentication username
         * @param {String} token - authentication username's password
         * @returns {unresolved}
         */
        this.getTotalUsers = function(username, token){
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users?limit=1',
                cache: true,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).success(function (data, status, headers, config) {
                var number = headers('Content-Range').split("/");
                return Number(number[1]);
            }).error(function (error) {
                console.log("ResponseError @"+ecBaseUrl+"/users/");
                return error;
            });
        }
        
        
        /**
         * Gets a list off all users (TODO: pagination; currently limited to 100!)
         * @param {type} username
         * @param {type} token
         * @returns {unresolved}
         */
        this.getUsers = function(username, token){
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users?limit=1',
                cache: true,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).success(function (data, status, headers, config) {
                var number = headers('Content-Range').split("/");
                return Number(number[1]);
            }, function (error) {
                console.log("ResponseError @"+ecBaseUrl+"/users/");
                return error;
            });
        }
        
        /**
         * Gets a certain friend from a certain user
         * @param {String} username - username of the user
         * @param {String} token - password of the user
         * @param {String} friend - username of the friend
         * @returns {unresolved}
         */
        this.getUserFriend = function(username, token, friend){
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/friends/' + friend,
                cache: true,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).success(function (res) {
                return res.data;
            }).error (function (error) {
                console.log("ResponseError @"+ecBaseUrl+"/users/"+username+"/friends"+ friend);
                return error;
            });
        };
        
        /**
         * Adds a user as a friend to user username
         * @param {String} username - username of the user
         * @param {String} password - password of the user
         * @param {jsondata} friends - jsonarray of users after [{"name":"newFriend","mail":"friends@mail.com","token":"password123"},...]
         * @returns {unresolved}
         */
        this.postUserFriends = function(username, token, friends){
            return $http({
                method: 'POST',
                url: ecBaseUrl + '/users/' + username + '/friends',
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                },
                data: friends
            }).success(function (res) {
                return res.data;
            }).error( function (error) {
                console.log("ResponseError @POST: "+ecBaseUrl+"/users/"+username+"/friends");
                return error;
            });
        };

        /**
         * Gets the total number of tracks driven by a certain user
         * @param {type} username   - name of the user
         * @param {type} token      - user's password
         * @returns {data} data.headers('Content-Range').split("/")[1] - is the total amount of user's tracks
         */
        this.getTotalUserTracks = function(username, token) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/tracks?limit=1',
                cache: true,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).success(function (data, status, headers, config) {
                console.log(headers);
                var number = headers('Content-Range').split("/");
                return Number(number[1]);
            }, function (error) {
                console.log("ResponseError @"+ecBaseUrl+"/users/"+username+"/tracks");
                return error;
            });
        };
        
        this.getUserEmail = function(username, token){
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username,
                cache: true,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).success(function (res) {
                return res.data;
            }).error (function (error) {
                console.log("ResponseError @"+ecBaseUrl+"/users/"+username+"/statistics");
                return error;
            });
        };
        
        this.getUserGroups = function(username, token){
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/groups',
                cache: true,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).success(function (res) {
                console.log(res);
                return res.data;
            }).error(function (error) {
                console.log("ResponseError @"+ecBaseUrl+"/users/"+username+"/groups");
                return error;
            });
        };

        this.getUserFriends = function(username, token) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/friends',
                cache: true,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).success(function (res) {
                return res.data;
            }).error( function (error) {
                console.log("ResponseError @"+ecBaseUrl+"/users/"+username+"/friends");
                return error;
            });
        };

        this.getUserStatistics = function(username, token) {
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
                console.log("ResponseError @"+ecBaseUrl+"/users/"+username+"/statistics");
                return error;
            });
        };
        
        this.getUser = function (username, token) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username,
                cache: true,
                headers : {
                    'Content-Type'  : 'application/JSON',
                    'X-User'        : username,
                    'X-Token'       : token
                }
            }).then(function (res) {
                return res.data;
            }, function (error) {
                console.log("ResponseError @"+ecBaseUrl+"/users/"+username+" : ");
                return error;
            });
        };

/**
        function wurst() {
            UserService.getUser()
                    .then(function (user) {

                    }, function(error){
                        
                    });
        }
*/
    };

    angular.module('enviroCar.api')
            .service('UserService', UserService);
})();