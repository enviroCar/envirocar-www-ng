// Login Service is here defined: Here Business logic an the Restservice of enviroCar Api is integrated


(function() {
  "use strict";
  angular
    .module("enviroCar.auth")
    .service("UserCredentialsService", UserCredentialsService);

  // JS Object Constructor function for 'User Credentials', here an object type 'UserCredentialService' is created
  function UserCredentialsService($cookieStore, $cookies, ecBaseUrl, ecBase) {    //$ = a jquery object, just for identification, definition ecBaseUrl steht in config.json
    "ngInject";
    
    console.log("UserCredentialsService started.");
    
    var userCredentials = { username: "" };

    // the object UserCredentialService gets the  method setCredentials
    this.setCredentials = function(username) { 
      userCredentials.username = username;
    };
    // the object UserCredentialService gets the  method getCredentials
    this.getCredentials = function() {
      return userCredentials;
    };

    this.logout = function() {
      $.ajax({
        type: "POST",
        url: ecBase + "/logout",
        xhrFields: { withCredentials: true },

        // SUCCESS FUNCTION, here to log out at server
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
        } // HERE Error Function
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
  
})();
