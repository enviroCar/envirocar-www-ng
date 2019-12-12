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
      $.ajax({
        type: "POST",
        url: ecBase + "/logout",
        xhrFields: { withCredentials: true },
        // log out at server
        success: function(data, status, jqxhr) {
          userCredentials.username = "";
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
