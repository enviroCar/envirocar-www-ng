(function () {

    function UserService($http, $cookies, ecBaseUrl) {
        "ngInject";

        /**
         * Gets all tracks of a certain user, containing at least one measurement within the specified BoundingBox parameters.
         * @param {type} username username - username of the user
         * @param {type} token - authentication password of the user
         * @param {type} minx - longitude SouthWest
         * @param {type} miny - latitude SouthWest
         * @param {type} maxx - longitude NorthEast
         * @param {type} maxy - latitude NorthEast
         * @returns {JSON} data - the json data array of all tracks of the user within the specified BoundingBox
         */
        this.getUserTracksBBox = function (username, token, minx, miny, maxx, maxy) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/tracks?limit=10000&bbox=' + minx + "," + miny + "," + maxx + "," + maxy,
                cache: true,
                headers: {
                    'Content-Type': 'application/JSON',
                    'X-User': username,
                    'X-Token': token
                }
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
         * @param {String} token - authentication password of the user
         * @param {String} phenomenon - the phenomenon's name
         * @returns {JSON} data - the json data array of all statistics of the user's phenomenon
         */
        this.getUserPhenomenonStatistics = function (username, token, phenomenon) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/statistics/' + phenomenon,
                cache: true,
                headers: {
                    'Content-Type': 'application/JSON',
                    'X-User': username,
                    'X-Token': token
                }
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
         * @param {String} token - authentication password of the user
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
         * @param {String} token - authentication password of the user
         * @returns {JSON} data - the json data array of all phenomenons of the user
         */
        this.getUserStatistics = function (username, token) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/statistics',
                headers: {
                    'Content-Type': 'application/JSON',
                    'X-User': username,
                    'X-Token': token
                },
                cache: false, // dont use cache here because of password changes --> bad user experience otherwise
            }).then(function (res) {
                console.log(res);
                return res;
            }
//            , function(error) {
//                console.log(error);
//                return error;
//            }
            );
        };

        /**
         * Test of local hosted application webapp
         * @param {type} username
         * @param {type} token
         * @returns {unresolved} 'http://localhost:8080/webapp'
         */
        this.getUserStatistic = function (username, token) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/userStatistic',
                cache: true,
                headers: {
                    'Content-Type': 'application/JSON',
                    'X-User': username,
                    'X-Token': token
                }
            }).then(function (res) {
                console.log(res);
                return res;
            }, function (error) {
                console.log("ResponseError @GET" + ecBaseUrl + "/users/" + username + "/statistics");
                return error;
            });
        };

        /**
         * Gets the total number of all enviroCar users.
         * @param {String} username - authentication username
         * @param {String} token - authentication username's password
         * @returns {unresolved}
         */
        this.getTotalUsers = function (username, token) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users?limit=1',
                cache: true,
                headers: {
                    'Content-Type': 'application/JSON',
                    'X-User': username,
                    'X-Token': token
                }
            }).then(function (data) {
                var number = data.headers('Content-Range').split("/");
                return Number(number[1]);
            }, function (error) {
                console.log("ResponseError @" + ecBaseUrl + "/users/");
                return error;
            });
        };

        /**
         * Updates the properties of a certain user t
         * @param {type} username
         * @param {type} token
         * @param {type} userDetails
         * @returns {unresolved}
         */
        this.putUserDetails = function (username, token, userDetails) {
            return $http({
                method: 'PUT',
                url: ecBaseUrl + '/users/' + username,
                headers: {
                    'Content-Type': 'application/JSON',
                    'X-User': username,
                    'X-Token': token
                },
                data: userDetails
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @" + ecBaseUrl + "/users/");
                return error;
            });
        };

        /**
         * Gets a list off all users (TODO: pagination; currently limited to 100!)
         * @param {type} username
         * @param {type} token
         * @returns {unresolved}
         */
        this.getUsers = function () {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users?limit=1',
                cache: true
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
         * @param {String} token - password of the user
         * @param {String} friend - username of the friend
         * @returns {unresolved}
         */
        this.getUserFriend = function (username, token, friend) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/friends/' + friend,
                cache: true,
                headers: {
                    'Content-Type': 'application/JSON',
                    'X-User': username,
                    'X-Token': token
                }
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
         * @param {String} password - password of the user
         * @param {jsondata} friends - jsonarray of users after [{"name":"newFriend","mail":"friends@mail.com","token":"password123"},...]
         * @returns {unresolved}
         */
        this.postUserFriends = function (username, token, friends) {
            return $http({
                method: 'POST',
                url: ecBaseUrl + '/users/' + username + '/friends',
                headers: {
                    'Content-Type': 'application/JSON',
                    'X-User': username,
                    'X-Token': token
                },
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
         * @param {String} username 
         * @param {String} token
         * @param {jsondata} userDetails - jsonarray of user details after [{"name":"max","mail":"max@mustermann.com","token":"password123"}, ...]
         * @returns {unresolved}
         */
        this.postUser = function (username, password, userdata) {
            return $http({
                method: 'POST',
                url: ecBaseUrl + '/users/',
                headers: {
                    'Content-Type': 'application/JSON',
                    'X-User': username,
                    'X-Token': password
                },
                data: userdata
            }).then(function (res) {
                console.log(res);
                return res;
            });
        };


        /**
         * Gets the total number of tracks driven by a certain user
         * @param {type} username   - name of the user
         * @param {type} token      - user's password
         * @returns {data} data.headers('Content-Range').split("/")[1] - is the total amount of user's tracks
         */
        this.getTotalUserTracks = function (username, password) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/tracks?limit=1',
                cache: true,
                headers: {
                    'Content-Type': 'application/JSON',
                    'X-User': username,
                    'X-Token': password
                }
            }).then(function (data) {
                var number = data.headers('Content-Range').split("/");
                return Number(number[1]);
            }, function (error) {
                console.log("ResponseError @" + ecBaseUrl + "/users/" + username + "/tracks");
                return error;
            });
        };

        this.getUserGroups = function (username, password) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/groups',
                headers: {
                    'Content-Type': 'application/JSON',
                    'X-User': username,
                    'X-Token': password
                },
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @" + ecBaseUrl + "/users/" + username + "/statistics");
                return error;
            });
        };

        this.getUserFriends = function (username, password) {
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username + '/friends',
                cache: true,
                headers: {
                    'Content-Type': 'application/JSON',
                    'X-User': username,
                    'X-Token': password
                }
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @" + ecBaseUrl + "/users/" + username + "/groups");
                return error;
            });
        };

        this.getUserWithAuth = function (username, password) {
            console.log(username, password);
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username,
                headers: {
                    'Content-Type': 'application/JSON',
                    'X-User': username,
                    'X-Token': password
                },
                headers: {
                    "Authorization": "Basic " + btoa(username + ":" + password)
                }
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @" + ecBaseUrl + "/users/" + username + "/statistics");
                return error;
            });
        };

        this.getUser = function (username, password) {
            console.log(username);
            return $http({
                method: 'GET',
                url: ecBaseUrl + '/users/' + username,
                headers: {
                    'Content-Type': 'application/JSON',
                    'X-User': username,
                    'X-Token': password
                }
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @" + ecBaseUrl + "/users/" + username + "/statistics");
                return error;
            });
        };

        this.postPasswordReset = function (username, password, userdata) {
            return $http({
                method: 'POST',
                url: ecBaseUrl + '/resetPassword',
                headers: {
                    'Content-Type': 'application/JSON',
                    'X-User': username,
                    'X-Token': password
                },
                data: userdata
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @POST" + ecBaseUrl + "/resetPassword");
                return error;
            });
        };

        this.deleteUser = function (username, token) {
            return $http({
                method: 'DELETE',
                url: ecBaseUrl + '/users/' + username,
                headers: {
                    'Content-Type': 'application/JSON',
                    'X-User': username,
                    'X-Token': token
                }
            }).then(function (res) {
                return res;
            }, function (error) {
                console.log("ResponseError @POST" + ecBaseUrl + "/users/" + username);
                return error;
            });
        };

    }
    ;

    angular.module('enviroCar.api')
            .service('UserService', UserService);
})();