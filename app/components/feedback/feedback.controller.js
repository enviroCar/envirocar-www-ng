(function () {
    'use strict';
    function FeedbackCtrl(
            $scope,
            $translate,
            $timeout) {
        "ngInject";

        $scope.feedbackSubmissionSuccess = false;
        $scope.feedbackSubmissionFailure = false;

        $scope.otherBrowserName = $translate.instant('FEEDBACK_BROWSER_OTHER');

        $scope.$on('toolbar:language-changed', function (event, args) {
            $scope.otherBrowserName = $translate.instant('FEEDBACK_BROWSER_OTHER');
            $scope.browsers = ('Google Chrome,Safari,Mozilla Firefox,Microsoft Edge,Microsoft Internet Explorer,Opera,other').split(',').map(function (browser) {
                if (browser === 'other') {
                    return {name: $translate.instant('FEEDBACK_BROWSER_OTHER')};
                }
                return {name: browser};
            });
            $timeout(function () {
                window.dispatchEvent(new Event('resize'));
            }, 1000);
        });

        $scope.feedback = {
            browser: '',
            email: '',
            freetext: ''
        };

        $scope.browsers = ('Google Chrome,Safari,Mozilla Firefox,Microsoft Edge,Microsoft Internet Explorer,Opera,other').split(',').map(function (browser) {
            if (browser === 'other') {
                return {name: $translate.instant('FEEDBACK_BROWSER_OTHER')};
            }
            return {name: browser};
        });

        $scope.sendUserFeedback = function () {
            $timeout(function () {
                $scope.feedbackSubmissionFailure = true;
                window.dispatchEvent(new Event('resize'));
                $timeout(function () {
                    $scope.feedbackSubmissionFailure = false;
                    window.dispatchEvent(new Event('resize'));
                }
                , 10000);
            }
            , 500);
        };
    }
    ;
    angular.module('enviroCar.feedback')
            .controller('FeedbackCtrl', FeedbackCtrl);
})();