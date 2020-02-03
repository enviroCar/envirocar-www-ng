(function() {
  "use strict";
  function ProfileCtrl(
    $scope,
    $timeout,
    $translate,
    $mdDialog,
    $mdMedia,
    UserCredentialsService, // in 'login.service.js'
    UserService, // in 'api.services.users.js'
    TrackService
  ) {
    "ngInject";

    $scope.username = "";
    var credits = UserCredentialsService.getCredentials();
    if (credits) {
      $scope.username = credits.username;
    }

    $scope.name = $scope.username;
    $scope.firstName;
    $scope.lastName;
    $scope.email;
    $scope.country;
    $scope.countrytext;
    $scope.birthday;
    $scope.gender = undefined;
    $scope.gendertext;
    $scope.language = undefined;
    $scope.langfull;
    $scope.langtext;
    $scope.oldpassword;
    $scope.newpassword;
    $scope.newpasswordrepeat;
    $scope.created;
    $scope.modified;
    $scope.termsOfUseVersion;
    $scope.dateBirthdayPicker = undefined;
    // ask server for current userinformation:
    UserService.getUser($scope.username).then(
// the method getUser of the service UserService is called and returns a promise object on which two methods can be applied
      function(data) { // the promise object is given to a function as 'data' ...
        console.log(data);
        var data = data.data; //...in which the data is bind to the variable 'data'.
        //auf die variable data wird die methode 'created' angwendet, die ein datenobject erstellt und das datenobject in ein string umwandelt und anschließend splitted by comma into several substrings and the first substring  
        $scope.created = new Date(data.created).toLocaleString().split(",")[0];
        //the selected substring is again transformed into a date object, then into string, split into substrings and again the first substring taken
        $scope.modified = new Date(data.modified).toLocaleString().split(",")[0];// der erste substring
        // 
        $scope.termsOfUseVersion = new Date(data.acceptedTermsOfUseVersion).toLocaleString().split(",")[0];
        if (data.firstName !== undefined) {
          $scope.firstName = data.firstName;
        }

        if (data.lastName !== undefined) {
          $scope.lastName = data.lastName;
        }

        if (data.gender !== undefined) {
          $scope.gender = data.gender;
          if ($scope.gender === "m") {
            $scope.gendertext = $translate.instant("MALE");
          } else {
            $scope.gendertext = $translate.instant("FEMALE");
          }
        } else {
          $scope.gendertext = "NA";
        }

        if (data.country !== undefined) {
          $scope.country = data.country;
          $scope.countrytext = data.country;
        } else {
          $scope.countrytext = "NA";
        }
        if (data.language !== undefined) {
          $scope.languagetext = data.language;
          $scope.language = data.language.split("-")[0];
          if ($scope.language === "en") {
            $scope.languagetext = $translate.instant("ENGLISH");
            $scope.lang = "en";
          } else if ($scope.language === "de") {
            $scope.languagetext = $translate.instant("GERMAN");
            $scope.lang = "de";
          }
        } else {
          $scope.languagetext = "NA";
        }

        if (data.mail !== undefined) {
          $scope.email = data.mail;
          $scope.emailId = data.mail;
        }
        if (data.dayOfBirth !== undefined) {
          $scope.birthday = data.dayOfBirth;
          var dateParse = data.dayOfBirth.split("-");
          $scope.dateBirthdayPicker = new Date(
            dateParse[0],
            dateParse[1] - 1,
            dateParse[2]
          );
        }
      },
      function(error) {
        console.log("error " + error);
      }
    );
    var updateNewUserData = function() {
      console.log("updating userdata on webapp..");
      // update eMail:
      if ($scope.emailId !== undefined && $scope.emailId !== "") {
        $scope.email = $scope.emailId;
      }
      // update gender:
      if ($scope.gender !== undefined) {
        $scope.gendertext = $scope.gender;
        if ($scope.gender === "m") {
          $scope.gendertext = $translate.instant("MALE");
        } else {
          $scope.gendertext = $translate.instant("FEMALE");
        }
      } else {
        $scope.gendertext = "NA";
      }

      // update country:
      if ($scope.country !== undefined && $scope.country !== "") {
        $scope.countrytext = $scope.country;
      }
      // update language:
      if ($scope.lang !== undefined && $scope.lang !== "") {
        if ($scope.lang === "en") {
          $scope.languagetext = $translate.instant("ENGLISH");
        } else if ($scope.lang === "de") {
          $scope.languagetext = $translate.instant("GERMAN");
        } else {
          $scope.languagetext = $scope.lang;
        }
      }
    };
    $scope.deleteUserDialog = function() {
      var showObject = {};
      var useFullScreen =
        ($mdMedia("sm") || $mdMedia("xs")) && $scope.customFullscreen;
      showObject = {
        controller: "DeleteUserCtrl",
        templateUrl: "app/components/profile/delete/delete_confirm_dialog.html",
        parent: angular.element(document.body),
        scope: $scope.$new(),
        clickOutsideToClose: false,
        fullscreen: useFullScreen
      };
      $mdDialog.show(showObject).then(function(answer) {
        // delete tracks too?
        if (answer) {
          TrackService.getUserTracks($scope.username).then(
            function(data) {
              var tracks = data.data.tracks;
              var currentTrack;
              for (currentTrack in tracks) {
                // delete track:
                TrackService.deleteTrack(
                  $scope.username,
                  tracks[currentTrack].id
                ).then(
                  function(data) {
                    console.log("Track '" + data + "' has been deleted.");
                  },
                  function(error) {
                    console.log("Error deleting track '" + error + "'.");
                  }
                );
              }
            },
            function(error) {
              console.log(
                "Error getting user tracks -> unsecure user profile deletion. Aborting mission...  Please try again later."
              );
              // TODO: abort mission
            }
          );
        }

        // 2. finally delete the user:
        UserService.deleteUser($scope.username).then(
          function(data) {
            console.log(data);
            // log out from page:
            UserCredentialsService.clearCredentials();
            UserCredentialsService.clearCookies();
          },
          function(error) {
            console.log(error);
            //                        });
            console.log("dialog confirmed with answer: " + answer);
            $scope.status = 'You said the information was "' + answer + '".';
          },
          function() {
            console.log("dialog canceled without answer");
            $scope.status = "You cancelled the dialog.";
          }
        );
        $scope.$watch(
          function() {
            return $mdMedia("xs") || $mdMedia("sm");
          },
          function(wantsFullScreen) {
            $scope.customFullscreen = wantsFullScreen === true;
          }
        );
      });
    };

    $scope.showConfirm = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      $scope.deleteUserDialog();
      //            var confirmDeleteUser = $mdDialog.confirm()
      //                    .title($translate.instant("DIALOG_DELETE_TITLE"))
      //                    .textContent($translate.instant("DIALOG_DELETE_TEXT"))
      //                    .ariaLabel('delete user profile dialog')
      //                    .targetEvent(ev)
      //                    .ok($translate.instant("DIALOG_DELETE_CONFIRM"))
      //                    .cancel($translate.instant("DIALOG_DELETE_CANCEL"));
      //            $mdDialog.show(confirmDeleteUser).then(function () {
      //                UserService.deleteUser(
      //                        $scope.username,
      //                        $scope.password).then(function (data) {
      //                    console.log(data);
      //                    // log out from page:
      //                    UserCredentialsService.clearCredentials();
      //                    UserCredentialsService.clearCookies();
      //                }, function (error) {
      //                    console.log(error);
      //                });
      //            }, function () {
      //                // do nothing
      //            });
    };
    var passwordold;
    $scope.submissionSuccess = false;
    $scope.submissionErrorMessage = "";
    $scope.submissionFailure = false;
    $scope.updateUserDetails = function() {
      $scope.submissionSuccess = false;
      $scope.submissionErrorMessage = "";
      $scope.submissionFailure = false;
      var validationflag = true;
      if ($scope.oldpassword !== undefined && $scope.oldpassword !== "") {
        console.log("old pw is typed.");
        if ($scope.newpassword === undefined || $scope.newpassword === "") {
          console.log("new password(1) is wrong.");
          validationflag = false;
        }
      }
      // validate if password and reentered password are same
      if ($scope.newpassword !== undefined && $scope.newpassword !== "") {
        console.log("old pw: " + $scope.oldpassword);
        if ($scope.oldpassword === undefined || $scope.oldpassword === "") {
          validationflag = false;
          // some error to be thrown.
        }
        if ($scope.newpassword !== $scope.newpasswordrepeat) {
          // some error to be thrown.
          validationflag = false;
        }
      }

      var dataput = {};
      if ($scope.firstName !== undefined) {
        dataput["firstName"] = $scope.firstName;
      }
      if ($scope.emailId !== undefined) {
        dataput["mail"] = $scope.emailId;
      }
      if ($scope.lastName !== undefined) {
        dataput["lastName"] = $scope.lastName;
      }
      if ($scope.country !== undefined) {
        dataput["country"] = $scope.country;
      }
      if ($scope.dateBirthdayPicker !== undefined) {
        var stringDate =
          $scope.dateBirthdayPicker.getFullYear().toString() +
          "-" +
          ($scope.dateBirthdayPicker.getMonth() + 1).toString() +
          "-" +
          $scope.dateBirthdayPicker.getDate().toString();
        console.log(stringDate);
        dataput["dayOfBirth"] = stringDate;
      }
      if ($scope.gender !== undefined) {
        dataput["gender"] = $scope.gender;
      }
      if ($scope.newpassword !== undefined && $scope.newpassword !== "") {
        dataput["token"] = $scope.newpassword;
      }
      if ($scope.oldpassword !== undefined) {
        passwordold = $scope.oldpassword;
      }
      if ($scope.lang !== undefined) {
        if ($scope.lang === "en") {
          dataput["language"] = "en-EN";
        } else if ($scope.lang === "de") {
          dataput["language"] = "de-DE";
        } else {
          dataput["language"] = $scope.lang;
        }
      }
      console.log(dataput);
      // send updates to server:
      if (
        $scope.newpassword !== undefined &&
        $scope.newpassword !== "" &&
        $scope.newpassword === $scope.newpasswordrepeat
      ) {
        // update with new password:
        UserService.putUserDetails(
          $scope.username,
          $scope.oldpassword,
          dataput
        ).then(
          function(data) {
            if (validationflag === true) {
              $scope.submissionSuccess = true;
              $timeout(function() {
                $scope.submissionSuccess = false;
              }, 5000);
              if (
                $scope.newpassword !== undefined &&
                $scope.newpassword !== ""
              ) {
                // update usercredentials on web app:
                UserCredentialsService.setCredentials(
                  $scope.username,
                  $scope.newpassword
                );
                $scope.token = $scope.newpassword;
              }
              // update profilepage with new data:
              updateNewUserData();
            } else {
              $scope.submissionErrorMessage = "Could not update profile";
            }
          },
          function(error) {
            console.log(error);
            $scope.submissionErrorMessage =
              "Please enter the correct existing password";
            $scope.submissionFailure = true;
          }
        );
      } else {
        // update without new password:
        if ($scope.newpassword === undefined || $scope.newpassword === "") {
          UserService.putUserDetails($scope.username, dataput).then(
            function(data) {
              console.log("no new password, but updates on profile.");
              $scope.submissionSuccess = true;
              $timeout(function() {
                $scope.submissionSuccess = false;
              }, 5000);
              // update profilepage with new data:
              updateNewUserData();
            },
            function(error) {
              console.log(error);
            }
          );
        } else {
          // new passwords do not match
          console.log("updates with new password, but password error.");
          $scope.submissionErrorMessage =
            "new password and re-entered password do not match";
          $scope.submissionFailure = true;
        }
      }
    };
    $scope.$on("toolbar:language-changed", function(event, args) {
      if ($scope.lang !== undefined && $scope.lang !== "") {
        if ($scope.lang === "en") {
          $scope.languagetext = $translate.instant("ENGLISH");
        } else if ($scope.lang === "de") {
          $scope.languagetext = $translate.instant("GERMAN");
        } else {
          $scope.languagetext = $scope.lang;
        }
      } else {
        $scope.languagetext = "NA";
      }

      if ($scope.gender !== undefined && $scope.gender !== "") {
        if ($scope.gender === "m") {
          $scope.gendertext = $translate.instant("MALE");
        } else {
          $scope.gendertext = $translate.instant("FEMALE");
        }
      } else {
        $scope.gendertext = "NA";
      }

      $timeout(function() {
        window.dispatchEvent(new Event("resize"));
      }, 500);
    });
  }
  angular.module("enviroCar.profile").controller("ProfileCtrl", ProfileCtrl);
})();
