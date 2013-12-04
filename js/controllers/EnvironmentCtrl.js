(function() {
    'use strict';

    var module = angular.module('controllers.Environments', [
        'lib.lodash',
        'common.service.polling'
    ]);

    module.controller('EnvironmentCtrl',
        function($scope, pollingService, $q, _) {

            function updateEnvironmentStatus() {
                _.each($scope.environmentGroups, function(group) {
                    return group.update();
                });
            }

            $scope.environmentGroups = [];
            $scope.flatten = be.flatten;

            $scope.loadSuccess = function (groups) {
                _.each(groups, function(group) {
                    var envGroup = new be.EnvironmentGroup($scope, $q, _, group);
                    envGroup.init();
                    $scope.environmentGroups.push(envGroup);
                });
                $scope.$apply();
                pollingService.startPoll(updateEnvironmentStatus, be.EnvironmentStatuses.POLL_WAIT_TIME);
            };

            $.ajax('/data/environments.json', {
                dataType: 'json',
                success: function (json) {
                    $scope.loadSuccess(json);
                },
                timeout: be.EnvironmentStatuses.TIMEOUT
            }).fail(pollingService.loadFail);
        });
})();