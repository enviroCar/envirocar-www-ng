(function () {
    'use strict';
    function ProfileCtrl(
            $scope,
            $timeout,
            $translate,
            UserCredentialsService,
            UserService) {

        $scope.username="";
        $scope.password="";
        var credits = UserCredentialsService.getCredentials();
        if (credits) {
            $scope.username = credits.username;
            $scope.password = credits.password;
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
        UserService.getUser($scope.username, $scope.password).then(
                function (data) {
                    console.log(data);
                    var data = data.data;
                    $scope.created = new Date(data.created).toLocaleString()
                            .split(',')[0];
                    $scope.modified = new Date(data.modified).toLocaleString()
                            .split(',')[0];
                    $scope.termsOfUseVersion = (new Date(data.acceptedTermsOfUseVersion)
                            .toLocaleString().split(',')[0]);
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
                        $scope.language = data.language.split('-')[0];
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
                        var dateParse = data.dayOfBirth.split('-');
                        $scope.dateBirthdayPicker = new Date(dateParse[0], dateParse[1] - 1, dateParse[2]);
                    }
                }, function (error) {
            console.log("error " + error);
            console.log(error);
        }
        );

        var updateNewUserData = function () {
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

        var passwordold;
        $scope.submissionSuccess = false;
        $scope.submissionErrorMessage = "";
        $scope.submissionFailure = false;
        $scope.updateUserDetails = function () {
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
                dataput['firstName'] = $scope.firstName;
            }
            if ($scope.emailId !== undefined) {
                dataput['mail'] = $scope.emailId;
            }
            if ($scope.lastName !== undefined) {
                dataput['lastName'] = $scope.lastName;
            }
            if ($scope.country !== undefined) {
                dataput['country'] = $scope.country;
            }
            if ($scope.dateBirthdayPicker !== undefined) {
                var stringDate = $scope.dateBirthdayPicker.getFullYear().toString() + '-' + ($scope.dateBirthdayPicker.getMonth() + 1).toString() + '-' + $scope.dateBirthdayPicker.getDate().toString();
                console.log(stringDate);
                dataput['dayOfBirth'] = stringDate;
            }
            if ($scope.gender !== undefined) {
                dataput['gender'] = $scope.gender;
            }
            if ($scope.newpassword !== undefined && $scope.newpassword !== "") {
                dataput['token'] = $scope.newpassword;
            }
            if ($scope.oldpassword !== undefined) {
                passwordold = $scope.oldpassword;
            }
            if ($scope.lang !== undefined) {
                if ($scope.lang === "en") {
                    dataput['language'] = "en-EN";
                } else if ($scope.lang === "de") {
                    dataput['language'] = "de-DE";
                } else {
                    dataput['language'] = $scope.lang;
                }
            }
            console.log(dataput);
            // send updates to server:
            if ($scope.newpassword !== undefined &&
                    $scope.newpassword !== "" &&
                    $scope.newpassword === $scope.newpasswordrepeat) {
                // update with new password:
                UserService.putUserDetails($scope.username, $scope.oldpassword, dataput).then(function (data) {
                    if (validationflag === true) {
                        $scope.submissionSuccess = true;
                        $timeout(function () {
                            $scope.submissionSuccess = false;
                        }, 5000);
                        if ($scope.newpassword !== undefined && $scope.newpassword !==
                                "") {
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
                }, function (error) {
                    console.log(error);
                    $scope.submissionErrorMessage =
                            "Please enter the correct existing password";
                    $scope.submissionFailure = true;
                });
            } else {
                // update without new password:
                if ($scope.newpassword === undefined || $scope.newpassword === "") {
                    UserService.putUserDetails($scope.username, $scope.password, dataput).then(function (data) {
                        console.log("no new password, but updates on profile.");

                        $scope.submissionSuccess = true;
                        $timeout(function () {
                            $scope.submissionSuccess = false;
                        }, 5000);
                        // update profilepage with new data:
                        updateNewUserData();
                    }, function (error) {
                        console.log(error);
                    });
                } else {
                    // new passwords do not match
                    console.log("updates with new password, but password error.");
                    $scope.submissionErrorMessage =
                            "new password and re-entered password do not match";
                    $scope.submissionFailure = true;
                }
            }
        };

        $scope.$on('toolbar:language-changed', function (event, args) {
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
            
            $timeout(function () {
                window.dispatchEvent(new Event('resize'));
            }
            , 500);
        });
        /**
         * 
         
         // Successfully changed profile.
         
         console.log(resp);
         // getData()
         }, function (err) {
         $scope.submissionErrorMessage = "Could not update profile";
         // Could not update profile.
         if (err.status == 403) {
         // please enter your exisiting password correctly.
         $scope.submissionErrorMessage =
         "Please enter the correct existing password"
         }
         $scope.submissionFailure = true;
         console.log(err);
         })
         } else {
         if (validationerror == 1) {
         console.log("type in old password please")
         $scope.submissionErrorMessage =
         "Please enter your current password"
         // type in old password please
         } else if (validationerror == 2) {
         $scope.submissionErrorMessage =
         "Please re-enter your new password correctly."
         // reenter new password correctly.
         } else if (validationerror == 0) {
         $scope.submissionErrorMessage = "New password cannot be empty";
         }
         $scope.submissionFailure = true;
         }
         };*/
        /**    
         $scope.ifpassword = false;
         $scope.passwordentered = function (id) {
         
         console.log($scope.oldpassword);
         if ($scope.oldpassword != undefined) {
         $scope.ifpassword = true;
         } else {
         console.log("event fired in else")
         $scope.ifpassword = false;
         }
         console.log("changed");
         
         }
         
         function getdata() {
         url = "https://envirocar.org/api/stable/users/" + username;
         factorysingletrack.get(url).then(function (data) {
         $scope.created = new Date(data.data.created).toLocaleString().split(
         ',')[0];
         $scope.modified = new Date(data.data.modified).toLocaleString()
         .split(
         ',')[0];
         $scope.termsOfUseVersion = (new Date(data.data.acceptedTermsOfUseVersion)
         .toLocaleString().split(',')[0]);
         
         console.log(data.data);
         if (data.data.firstName != undefined) {
         $scope.firstName = data.data.firstName;
         }
         if (data.data.lastName != undefined) {
         $scope.lastName = data.data.lastName;
         }
         if (data.data.gender != undefined) {
         $scope.gender = data.data.gender;
         if ($scope.gender == "m") {
         $scope.gendertext = "Male"
         } else {
         $scope.gendertext = "Female"
         }
         } else {
         $scope.gendertext = "NA"
         }
         if (data.data.country != undefined) {
         $scope.country = data.data.country;
         $scope.countrytext = data.data.country;
         } else {
         $scope.countrytext = "NA";
         }
         if (data.data.language != undefined) {
         $scope.langfull = data.data.language;
         $scope.lang = data.data.language.split('-')[0];
         if ($scope.lang == "en") {
         $scope.langtext = "English";
         } else if ($scope.lang == "de") {
         $scope.langtext = "German";
         }
         } else {
         $scope.langtext = "NA";
         }
         
         if (data.data.mail != undefined) {
         $scope.emailId = data.data.mail;
         }
         if (data.data.dayOfBirth != undefined) {
         $scope.birthday = data.data.dayOfBirth;
         var dateParse = data.data.dayOfBirth.split('-');
         console.log(dateParse[0] + ' ' + dateParse[1] + ' ' + dateParse[2])
         $scope.dateBirthdayPicker = new Date(dateParse[0], dateParse[1] - 1, dateParse[2]);
         }
         $scope.profilepic = url + "/avatar";
         if (data.data.badges != undefined) {
         $scope.badgesTrue = true;
         for (var i = 0; i < data.data.badges.length; i++) {
         var helper_obj = {};
         helper_obj['title'] = data.data.badges[i];
         if (data.data.badges[i] == "developer") {
         helper_obj['url'] =
         "assets\\images\\ic_code_black_48dp.png";
         } else if (data.data.badges[i] == "contributor") {
         helper_obj['url'] =
         "assets\\images\\ic_person_add_black_48dp.png";
         }
         $scope.badges.push(helper_obj);
         }
         }
         })
         }
         
         
         // TODO: fill information:
         $scope.myDate = new Date();
         
         */
    }
    ;
    angular.module('enviroCar.profile')
            .controller('ProfileCtrl', ProfileCtrl);
})();
