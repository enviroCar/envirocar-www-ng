(function () {

    function UserService($http, $cookies, ecBaseUrl, ecAuthProxy) {
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
                url: ecAuthProxy + '/users/' + username + '/tracks?limit=10000&bbox=' + minx + "," + miny + "," + maxx + "," + maxy,
                cache: true,
                withCredentials: true
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @GET" + ecAuthProxy + "/users/" + username + "/tracks?bbox=" + minx + "," + miny + "," + maxx + "," + maxy);
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
                url: ecAuthProxy + '/users/' + username + '/statistics/' + phenomenon,
                cache: true,
                withCredentials: true
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @GET" + ecAuthProxy + "/users/" + username + "/statistics/" + phenomenon);
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
                url: ecAuthProxy + '/users/' + username + '/statistics',
                withCredentials: true,
                cache: false // dont use cache here because of password changes --> bad user experience otherwise
            }).then(function (res) {
                return res;
            }, function(error) {
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
                url: ecAuthProxy + '/users/' + username + '/userStatistic',
                cache: true,
                withCredentials: true
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @GET" + ecAuthProxy + "/users/" + username + "/statistics");
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
                url: ecAuthProxy + '/users?page=1&limit=10000',
                cache: true,
                withCredentials: true
            }).then(function (data) {
                var number = data.data.users.length;
//                        data.headers('Content-Range').split("/");
                return number;
            }, function (error) {
                console.log("ResponseError @" + ecAuthProxy + "/users?page=1&limit=10000");
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
                method: 'PUT',
                url: ecAuthProxy + '/users/' + username,
                withCredentials: true,
                data: userDetails
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @" + ecAuthProxy + "/users/");
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
                cache: true,
                withCredentials: true
            }).then(function (data) {
                var number = data.headers('Content-Range').split("/");
                return Number(number[1]);
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
                url: ecAuthProxy + '/users/' + username + '/friends/' + friend,
                cache: true,
                withCredentials: true
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @" + ecAuthProxy + "/users/" + username + "/friends" + friend);
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
                url: ecAuthProxy + '/users/' + username + '/friends',
                withCredentials: true,
                data: friends
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @POST: " + ecAuthProxy + "/users/" + username + "/friends");
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
                method: 'POST',
                url: ecAuthProxy + '/users/',
                withCredentials: true,
                data: userdata
            }).then(function (res) {
                return res;
            }, function(error) {
                console.log("ResponseError @POST: "+ ecBaseUrl + "/users/");
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
                cache: true,
                withCredentials: true
            }).then(function (data) {
                var number = data.headers('Content-Range').split("/");
                return Number(number[1]);
            }, function (error) {
                console.log("ResponseError @" + ecBaseUrl + "/users/" + username + "/tracks?limit=1");
                return error;
            });
        };

        this.getUserGroups = function (username) {
            return $http({
                method: 'GET',
                url: ecAuthProxy + '/users/' + username + '/groups',
                withCredentials: true
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @" + ecAuthProxy + "/users/" + username + "/statistics");
                return error;
            });
        };

        this.getUserFriends = function (username) {
            return $http({
                method: 'GET',
                url: ecAuthProxy + '/users/' + username + '/friends',
                cache: true,
                withCredentials: true
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @" + ecAuthProxy + "/users/" + username + "/groups");
                return error;
            });
        };

        this.getUserWithAuth = function (username) {
            return $http({
                method: 'GET',
                url: ecAuthProxy + '/users/' + username,
                withCredentials: true
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @" + ecAuthProxy + "/users/" + username);
                return error;
            });
        };

        this.getUser = function (username) {
            return $http({
                method: 'GET',
                url: ecAuthProxy + '/users/' + username,
                withCredentials: true
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @" + ecAuthProxy + "/users/" + username);
                return error;
            });
        };

        this.postPasswordReset = function (userdata) {
            return $http({
                method: 'POST',
                url: ecAuthProxy + '/resetPassword',
                withCredentials: true,
                data: userdata
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @POST" + ecAuthProxy + "/resetPassword");
                return error;
            });
        };

        this.deleteUser = function (username) {
            return $http({
                method: 'DELETE',
                url: ecAuthProxy + '/users/' + username,
                withCredentials: true
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @DELETE" + ecAuthProxy + "/users/" + username);
                return error;
            });
        };

    }
    ;

    angular.module('enviroCar.api')
            .service('UserService', UserService);
})();