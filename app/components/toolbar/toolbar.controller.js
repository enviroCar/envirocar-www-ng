(function () {
    'use strict';

    function ToolbarCtrl($rootScope, $scope, $timeout, ecBase, ecBaseUrl) {
        "ngInject";

        console.log('ToolbarCtrl started.' + ecBaseUrl);
        $scope.title = 'enviroCar Webapp';
//
//        $timeout(function () {
//
//            $("#logout_user").click(function (e) {
//                console.log("LOG.");
//                $.ajax({
//                    type: "POST",
//                    url: ecBase + "/logout",
//                    // log out at server
//                    success: function (data, status, jqxhr) {
//                        $.ajax({
//                            type: "GET",
//                            url: ecBaseUrl + "/users",
//                            beforeSend: function (request) {
//                                // reset Browser's Basic Auth
//                                request.setRequestHeader("Authorization", "Basic " + btoa("log:out"));
//                            },
//                            success: function () {
//                                // 401 expected here
//                                console.log("logout failed!")
//                            },
//                            error: function (request) {
//                                if (request.status === 401) {
//                                    // credentials resetted => redirect
//                                window.location.replace("/#!/login");
//                                } else {
//                                    console.log("logout failed!");
//                                }
//                            }
//                        });
//                    }
//                });
//            });
//
//        }, 1000);
    };


    angular.module('enviroCar')
            .controller('ToolbarCtrl', ToolbarCtrl);
})();
