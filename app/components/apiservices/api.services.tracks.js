(function () {

    function TrackService($http, ecBaseUrl) {
        
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
            }).then(function (res) {
                return res;
            },function (error) {
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
            }).then(function (res) {
                return res;
            },function (error) {
                console.log("ResponseError @GET"+ecBaseUrl+"/tracks/"+trackID+"/statistics");
                return error;
            });
        };
        
        /**
         * Gets a certain track
         * @param {String} username - authentication username
         * @param {String} token - authentication password of the user
         * @param {String} trackID - ID of the certain track
         * @returns {unresolved} - the certain track
         */
        this.getTrack = function(username, token, trackID) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/tracks/' + trackID,
                cache: true,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).then(function (res) {
                return res;
            },function (error) {
                console.log("ResponseError @GET"+ecBaseUrl+"/tracks/"+trackID);
                return error;
            });
        };
        
        /**
         * Posts a new track to the server.
         * @param {String} username - driver of the track
         * @param {String} token - password of the driver's username
         * @param {JSON} track - Track json data
         * @returns {unresolved}
         */
        this.postNewTrack = function(username, token, track){
            return $http({
                method: 'POST',
                url: ecBaseUrl + '/users/' + username + '/tracks',
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                },
                data: track
            }).then(function (res) {
                return res;
            },function (error) {
                console.log("ResponseError @POST: "+ecBaseUrl+"/tracks");
                return error;
            });
        };
        
        this.deleteTrack = function(username, token, trackid){
            return $http({
                method: 'DELETE',
                url: ecBaseUrl + '/users/' + username + '/tracks/'+trackid,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).success(function (res) {
                return res.data;
            }).error(function (error) {
                console.log("ResponseError @DELETE: " + ecBaseUrl + '/users/' + username + '/tracks/'+trackid);
                return error;
            });
        };
        
        this.getUserTracks = function(username, token) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/tracks?limit=10000',
                cache: true,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).then(function (res) {
                return res;
            },function (error) {
                console.log("ResponseError @GET"+ecBaseUrl+"/users/" + username + "/tracks");
                return error;
            });
        };
        
        /**
         * Gets the number of tracks driven by a certain user
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
            }).then(function (data) {
                var number = data.headers('Content-Range').split("/");
                return Number(number[1]);
            },function (error) {
                console.log("ResponseError @GET"+ecBaseUrl+"/users/"+username+"/tracks?limit=1");
                return error;
            });
        };
        
        /**
         * Gets the total number of tracks driven by all community members
         * @param {type} username
         * @param {type} token
         * @returns {data} data.headers('Content-Range').split("/")[1] - is the total amount of all tracks        
         */
        this.getTotalTracks = function(username, token){
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/tracks?limit=1',
                cache: true,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).then(function (data) {
                var number = data.headers('Content-Range').split("/");
                return Number(number[1]);
            }, function (error) {
                console.log("ResponseError @GET"+ecBaseUrl+"/users/"+username+"/tracks?limit=1");
                return error;
            });
        };
        
        /**
         * Gets a list of all tracks / TODO: Pagination
         * @param {type} username
         * @param {type} token
         * @returns {unresolved}
         */
        this.getTracks = function(username, token){
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/tracks?limit=10000',
                cache: true,
                headers : {
                    'Content-Type' : 'application/JSON',
                    'X-User'    : username,
                    'X-Token'   : token
                }
            }).then(function (res) {
                return res;
            },function (error) {
                console.log("ResponseError @GET"+ecBaseUrl+"/tracks");
                return error;
            });
        };
        
    };

    angular.module('enviroCar.api')
            .service('TrackService', TrackService);
})();