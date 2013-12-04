(function() {
    'use strict';
    var module = angular.module('common.service.polling', [
        'common.service.guid'
    ]);

    module.factory('pollingService',
        function(guidService) {
            var pollingId = guidService.newGuid();
            console.log("this page's polling id: " + pollingId);
            var loadFail = function (xhr, status, error) {
                console.log('ajax error occurred: ', error);
            };
            var poll = function (doStuff, timeoutInMS) {
                doStuff();
                console.log("active poll: " + be.EnvironmentStatuses.activePollingId);
                setTimeout(function () {
                    if(pollingId === be.EnvironmentStatuses.activePollingId) {
                        poll(doStuff, timeoutInMS);
                    } else {
                        console.log("polling stop: " + pollingId);
                    }
                }, timeoutInMS);
            };
            var startPoll = function(doStuff, timeoutInMS) {
                be.EnvironmentStatuses.activePollingId = pollingId;
                poll(doStuff, timeoutInMS);
            };
            var getThisPollingId = function() {
                return pollingId;
            };
            be.EnvironmentStatuses.activePollingId = pollingId;
            return {
                loadFail: loadFail,
                startPoll: startPoll,
                poll: poll,
                getThisPollingId: getThisPollingId
            };
        }
    );
})();
