(function() {
  "use strict";

  function UserCredentialsService($cookieStore, $cookies, ecBaseUrl, ecBase) {
    "ngInject";

    console.log("UserCredentialsService started.");
    var userCredentials = { username: "" };

    this.setCredentials = function(username) {
      userCredentials.username = username;
    };

    this.getCredentials = function() {
      return userCredentials;
    };
    
    this.logout = function() {
      userCredentials.username = "";
      $.ajax({
        type: "POST",
        url: ecBase + "/logout",
        //                    withCredentials: true,
        xhrFields: { withCredentials: true },
        // log out at server
        success: function(data, status, jqxhr) {
          $.ajax({
            type: "GET",
            url: ecBaseUrl + "/users",
            crossDomain: true,
            success: function() {
              // 401 expected here
              console.log("logout failed!");
            },
            error: function(request) {
              if (request.status === 401) {
                $cookies.remove("JSESSIONID");
                $cookieStore.remove("JSESSIONID");
                document.cookie.split(";").forEach(function(c) {
                  document.cookie = c
                    .replace(/^ +/, "")
                    .replace(
                      /=.*/,
                      "=;expires=" + new Date().toUTCString() + ";path=/"
                    );
                });
                // credentials resetted => redirect
                //
                //                                window.location.replace(ecBaseUrl + "/logout-success");
              } else {
                console.log("logout failed!");
              }
            }
          });
        }
      });
    };

    this.deleteCookies = function() {
      $cookies.remove("JSESSIONID");
      $cookieStore.remove("JSESSIONID");
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    };
  }
  angular
    .module("enviroCar.auth")
    .service("UserCredentialsService", UserCredentialsService);
})();
