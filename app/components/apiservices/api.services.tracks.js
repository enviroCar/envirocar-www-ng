(function () {

    function TrackService($http, ecBaseUrl) {
        "ngInject";
        
        /**
         * Gets the statistic of a certain track of a certain phenomenon
         * @param {String} trackID - trackID of the certain track
         * @param {String} phenomenon - the phenomenon's name
         * @returns {JSON} data - the json data array of all statistics of the track's phenomenon
         */
        this.getTrackPhenomenonStatistics = function(trackID, phenomenon){
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/tracks/' + trackID + '/statistics/' + phenomenon,
                cache: true,
                withCredentials: true
            }).then(function (res) {
                return res;
            },function (error) {
                console.log("ResponseError @GET"+ecBaseUrl+"/tracks/"+trackID+"/statistics/"+phenomenon);
                return error;
            });
        };
        
        /**
         * Gets all statistics for a certain track
         * @param {String} trackID - trackID of the certain track
         * @returns {JSON} data - the json data array of all phenomenons
         */
        this.getTrackStatistics = function(trackID){
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/tracks/' + trackID + '/statistics',
                cache: true,
                withCredentials: true
            }).then(function (res) {
                return res;
            },function (error) {
                console.log("ResponseError @GET"+ecBaseUrl+"/tracks/"+trackID+"/statistics");
                return error;
            });
        };
        
        /**
         * Gets a certain track
         * @param {String} trackID - ID of the certain track
         * @returns {unresolved} - the certain track
         */
        this.getTrack = function(trackID) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/tracks/' + trackID,
                cache: true,
                withCredentials: true
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
         * @param {JSON} track - Track json data
         * @returns {unresolved}
         */
        this.postNewTrack = function(username, track){
            return $http({
                method: 'POST',
                url: ecBaseUrl + '/users/' + username + '/tracks',
                withCredentials: true,
                data: track
            }).then(function (res) {
                return res;
            },function (error) {
                console.log("ResponseError @POST: "+ecBaseUrl+"/tracks");
                return error;
            });
        };
        
        this.deleteTrack = function(username, trackid){
            return $http({
                method: 'DELETE',
                url: ecBaseUrl + '/users/' + username + '/tracks/'+trackid,
                withCredentials: true
            }).then(function (res) {
                return res;
            },function (error) {
                console.log("ResponseError @DELETE: " + ecBaseUrl + '/users/' + username + '/tracks/'+trackid);
                return error;
            });
        };
        
        this.getUserTracks = function(username) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/tracks?page=1&limit=10000',
                cache: true,
                withCredentials: true
            }).then(function (res) {
                return res;
            },function (error) {
                console.log("ResponseError @GET"+ecBaseUrl+"/users/" + username + "/tracks?page=1&limit=10000");
                return error;
            });
        };
        
        /**
         * Gets a list of all tracks / TODO: Pagination
         * @returns {unresolved}
         */
        this.getTracks = function(){
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/tracks?limit=10000',
                cache: true,
                withCredentials: true
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