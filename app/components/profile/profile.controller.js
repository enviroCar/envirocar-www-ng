(function () {
    'use strict';

    function ProfileCtrl(
            $scope,
            $state,
            UserCredentialsService,
            UserService) {

        var username;
        var token;
        var credits = UserCredentialsService.getCredentials();
        if (credits) {
            username = credits.username;
            token = credits.password;
        }

        $scope.name = username;
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
        UserService.getUser(username, token).then(
                function (data) {
                    console.log(data);

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
                            $scope.gendertext = "Male";
                        } else {
                            $scope.gendertext = "Female";
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
                            $scope.languagetext = "English";
                        } else if ($scope.language === "de") {
                            $scope.languagetext = "German";
                        }
                    } else {
                        $scope.languagetext = "NA";
                    }

                    if (data.mail !== undefined) {
                        $scope.email = data.mail;
                    }
                    if (data.dayOfBirth !== undefined) {
                        $scope.birthday = data.dayOfBirth;
                        var dateParse = data.dayOfBirth.split('-');
                        $scope.dateBirthdayPicker = new Date(dateParse[0], dateParse[1] - 1, dateParse[2]);
                    }
                }, function (error) {
            console.log("error " + error);
        }
        );

        /**
         var passwordold;
         $scope.submissionSuccess = false;
         $scope.submissionErrorMessage = "";
         $scope.submissionFailure = false;
         $scope.updateUserDetails = function () {
         $scope.submissionSuccess = false;
         $scope.submissionErrorMessage = "";
         $scope.submissionFailure = false;
         var validationflag = true;
         var validationerror = 0;
         if ($scope.oldpassword != undefined && $scope.oldpassword != "") {
         if ($scope.newpassword == undefined || $scope.newpassword == "") {
         validationflag = false;
         validationerror = 0;
         }
         }
         // validate if password and reentered password are same
         if ($scope.newpassword != undefined && $scope.newpassword != "") {
         
         console.log($scope.oldpassword)
         if ($scope.oldpassword == undefined || $scope.oldpassword == "") {
         validationflag = false;
         validationerror = 1;
         // some error to be thrown.
         }
         if ($scope.newpassword != $scope.newpasswordrepeat) {
         // some error to be thrown.
         validationflag = false
         validationerror = 2;
         }
         }
         
         var dataput = {};
         if ($scope.firstName != undefined) {
         dataput['firstName'] = $scope.firstName;
         }
         if ($scope.emailId != undefined) {
         dataput['mail'] = $scope.emailId;
         }
         if ($scope.lastName != undefined) {
         dataput['lastName'] = $scope.lastName;
         }
         if ($scope.country != undefined) {
         dataput['country'] = $scope.country;
         }
         if ($scope.dateBirthdayPicker != undefined) {
         var stringDate = $scope.dateBirthdayPicker.getFullYear().toString() + '-' + ($scope.dateBirthdayPicker.getMonth() + 1).toString() + '-' + $scope.dateBirthdayPicker.getDate().toString();
         console.log(stringDate);
         dataput['dayOfBirth'] = stringDate;
         }
         if ($scope.gender != undefined) {
         dataput['gender'] = $scope.gender;
         }
         if ($scope.newpassword != undefined && $scope.newpassword != "") {
         dataput['token'] = $scope.newpassword;
         }
         if ($scope.oldpassword != undefined) {
         passwordold = $scope.oldpassword;
         }
         if ($scope.langfull != undefined) {
         dataput['language'] = $scope.langfull;
         }
         
         var req = {
         method: 'PUT',
         url: "https://envirocar.org/api/stable/users/" + $rootScope.globals
         .currentUser
         .username,
         data: dataput
         }
         TODO: update usercredentials and cookies.
         
         
         console.log(dataput);
         if (validationflag == true) {
         console.log(req);
         $http(req).then(function (resp) {
         $scope.submissionSuccess = true
         $timeout(function () {
         $scope.submissionSuccess = false;
         }, 2000);
         // Successfully changed profile.
         if ($scope.newpassword != undefined && $scope.newpassword !=
         "") {
         //$rootScope.globals.currentUser.authdata = $scope.newpassword;
         }
         console.log(resp);
         getdata()
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
         };
         
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
