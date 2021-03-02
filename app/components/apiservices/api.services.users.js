(function () {

    function UserService($http, ecBaseUrl, ecServerBase) {
        // the function UserService gets the built-in function http which takes a configuration object
        "ngInject";
        /**
         * Gets all tracks of a certain user, containing at least one measurement within the specified BoundingBox parameters.
         * @param {type} username username - username of the user
         * @param {type} minx - longitude SouthWest
         * @param {type} miny - latitude SouthWest
         * @param {type} maxx - longitude NorthEast
         * @param {type} maxy - latitude NorthEast
         * @returns {JSON} data - the json data array of all tracks of the user within the specified BoundingBox
         */
        this.getUserTracksBBox = function (username, minx, miny, maxx, maxy) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/tracks?limit=10000&bbox=' + minx + "," + miny + "," + maxx + "," + maxy,
                cache: false,
                withCredentials: true
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @GET" + ecBaseUrl + "/users/" + username + "/tracks?bbox=" + minx + "," + miny + "," + maxx + "," + maxy);
                return error;
            });
        };

        /**
         * Gets the statistic of a certain user of a certain phenomenon
         * @param {String} username - username of the user
         * @param {String} phenomenon - the phenomenon's name
         * @returns {JSON} data - the json data array of all statistics of the user's phenomenon
         */
        this.getUserPhenomenonStatistics = function (username, phenomenon) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/statistics/' + phenomenon,
                cache: false,
                withCredentials: true
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @GET" + ecBaseUrl + "/users/" + username + "/statistics/" + phenomenon);
                return error;
            });
        };

        /**
         * Gets all statistics for a certain user
         * @param {String} username - username of the user
         * @returns {JSON} data - the json data array of all phenomenons of the user
         */
//        this.getUser = function (username, token) {
//            return $http({
//                method: 'GET',
//                url: ecBaseUrl + '/users/' + username,
//                cache: false, // dont use cache here because of password changes --> bad user experience otherwise
//                headers: {
//                    'Content-Type': 'application/JSON',
////                    'Authorization': "Basic bmF2ZWVuLWdzb2M6bmF2ZWVuLWdzb2MxMjM="
////                    'Authorization': "Basic " + btoa(username + ":" + token)
//                    'X-User': username,
//                    'X-Token': token
//                }
//            }).then(function (data, status, header) {
//                console.log(header('Set-Cookie'));
//                console.log($cookies);
//                console.log(data);
//                console.log(status);
//                console.log(header);
//                return data;
//            }
////            , function(error) {
////                console.log(error);
////                return error;
////            }
//            );
//        };

        /**
         * Gets all statistics for a certain user
         * @param {String} username - username of the user
         * @returns {JSON} data - the json data array of all phenomenons of the user
         */
        this.getUserStatistics = function (username) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/statistics',
                withCredentials: true,
                cache: false // dont use cache here because of password changes --> bad user experience otherwise
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log(error);
                return error;
            }
            );
        };
        
        /**
         * Test of local hosted application webapp
         * @param {type} username
         * @returns {unresolved} 'http://localhost:8080/webapp'
         */
        this.getUserStatistic = function (username) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/userStatistic',
                cache: false,
                withCredentials: true
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @GET" + ecBaseUrl + "/users/" + username + "/statistics");
                return error;
            });
        };
        
        /**
         * Gets the total number of all enviroCar users.
         * @returns {unresolved}
         */
        this.getTotalUsers = function () {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/',
                cache: false,
                withCredentials: true
            }).then(function (data) {
                var number = data.data.counts.users;
//                        data.headers('Content-Range').split("/");
                return number;
            }, function (error) {
                console.log("ResponseError @" + ecBaseUrl + "/users?page=1&limit=10000");
                return error;
            });
        };
        
        /**
         * Updates the properties of a certain user
         * @param {type} username
         * @param {type} userDetails
         * @returns {unresolved}
         */
        this.putUserDetails = function (username, userDetails) {
            return $http({
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'PUT',
                url: ecBaseUrl + '/users/' + username,
                withCredentials: true,
                data: userDetails
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log(error);
                console.log("ResponseError @PUT" + ecBaseUrl + "/users/" +username);
                return error;
            });
        };
        
        /**
         * Gets a list off all users (TODO: pagination; currently limited to 100!)
         * @returns {unresolved}
         */
        this.getUsers = function () {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users?limit=1',
                cache: false,
                withCredentials: true
            }).then(function (data) {
                var number = data.headers("content-range").split("/")[1];
                return number;
            }).error(function (error) {
                console.log("ResponseError @" + ecBaseUrl + "/users/");
                return error;
            });
        };
        
        /**
         * Gets a certain friend from a certain user
         * @param {String} username - username of the user
         * @param {String} friend - username of the friend
         * @returns {unresolved}
         */
        this.getUserFriend = function (username, friend) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/friends/' + friend,
                cache: false,
                withCredentials: true
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @" + ecBaseUrl + "/users/" + username + "/friends" + friend);
                return error;
            });
        };
        
        /**
         * Adds a user as a friend to user username
         * @param {String} username - username of the user
         * @param {jsondata} friends - jsonarray of users after [{"name":"newFriend","mail":"friends@mail.com","token":"password123"},...]
         * @returns {unresolved}
         */
        this.postUserFriends = function (username, friends) {
            return $http({
                method: 'POST',
                url: ecBaseUrl + '/users/' + username + '/friends',
                withCredentials: true,
                data: friends
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @POST: " + ecBaseUrl + "/users/" + username + "/friends");
                return error;
            });
        };
        
        /**
         * Creates a new user with optional userDetails (email is mandatory)
         * @param {jsondata} userDetails - jsonarray of user details after [{"name":"max","mail":"max@mustermann.com","token":"password123"}, ...]
         * @returns {unresolved}
         */
        this.postUser = function (userdata) {
            return $http({
                headers: {
                    "Content-Type": 'application/json'
                },
                method: 'POST',
                url: ecServerBase + '/users',
                data: userdata
            }).then(function (data) {
                return data;
            }, function (error) {
                console.log("ResponseError @POST: " + ecServerBase + "/users");
                return error;
            });
        };
        
        /**
         * Gets the total number of tracks driven by a certain user
         * @param {type} username   - name of the user
         * @returns {data} data.headers('Content-Range').split("/")[1] - is the total amount of user's tracks
         */
        this.getTotalUserTracks = function (username) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/tracks?limit=1',
                cache: false,
                withCredentials: true
            }).then(function (data) {
                var number = data.headers("content-range").split("/")[1];
                return number;
            }, function (error) {
                console.log("ResponseError @" + ecBaseUrl + "/users/" + username + "/tracks?limit=1");
                return error;
            });
        };

        this.getUserGroups = function (username) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/groups',
                withCredentials: true
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @" + ecBaseUrl + "/users/" + username + "/statistics");
                return error;
            });
        };
        this.getUserFriends = function (username) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/friends',
                cache: false,
                withCredentials: true
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @" + ecBaseUrl + "/users/" + username + "/groups");
                return error;
            });
        };
        
        this.getUserWithAuth = function (username, password) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username,
                headers: {
                    'Authorization': "Basic " + btoa(username + ":" + password)
                },
                withCredentials: true
            });
        };

        this.getUser = function (username) {
            // $http(...).then(...)
            return $http({ // this function gets a configuration object and returns a promise object
                method: 'GET',
                url: ecBaseUrl + '/users/' + username,
                withCredentials: true
            }).then(function (res) { // then is a method of the response object from the http angularjs service
                return res;
            }, function (error) {
                console.log("ResponseError @" + ecBaseUrl + "/users/" + username);
                return error;
            });
        };
        this.deleteUser = function (username) {
            return $http({
                method: 'DELETE',
                url: ecBaseUrl + '/users/' + username,
                withCredentials: true
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @DELETE" + ecBaseUrl + "/users/" + username);
                return error;
            });
        };
        this.postPasswordReset = function (userdata) {
            return $http({
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                url: ecServerBase + '/resetPassword',
                data: userdata
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @POST" + ecServerBase + "/resetPassword");
                return error;
            });
        };
        this.putPasswordReset = function (userName, userToken, code) {
            return $http({
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
                url: ecServerBase + '/resetPassword',
                data: {
                    "user": {
                        "name": userName,
                        "token": userToken
                    },
                    "code": code
                }
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @PUT" + ecServerBase + "/resetPassword");
                return error;
            });
        };


        // Get the actual TOU Version:https://envirocar.org/api/stable/termsOfUse; most actual Version is first object in list
        this.getTOUVersion = function(){
            return $http({
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET',
                url: ecServerBase + '/termsOfUse',
                withCredentials: false
            }).then(function (response){
                var data = response.data['termsOfUse']
                var termsofuse = data[0]['issuedDate']
                console.log('actual Terms of Use: ' + termsofuse)
                return termsofuse;//returns promise object   
            }, function (error){
                console.log(error)
                return error;
            });
        };

        // Get the version of the TOU which was accepted by the user 
        this.getAcceptedTOUVersion = function(username){
            return $http({
                method: 'GET', 
                url:ecBaseUrl + '/users/' + username,
                withCredentials:true
            }).then(function(res) {
                console.log(username)
                return res;
            }, function(error){
                console.log("ResponseError @" + ecBaseUrl + "/users/" + username);
                return error
            });
        };

        // Accepted TOU gets updated according to the newest TOU Version, this needs to include the authentication base64
        this.putAcceptedTermsVersion = function(username, password, touVersionString){
            console.log('username: '+ username)
            console.log('pw: '+ password)
            return $http({
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic '+ btoa(username + ":" + password)
                },
                method: 'PUT',
                url : ecServerBase + '/users/' + username,
                withCredentials:true,
                data: {"acceptedTermsOfUseVersion": touVersionString, 
                }
            }).then(function(res){
                return res;
            },  function(error){
                console.log(error);
                return error
            });
        };

    }
    ;
    angular.module('enviroCar.api')
            .service('UserService', UserService);
})();