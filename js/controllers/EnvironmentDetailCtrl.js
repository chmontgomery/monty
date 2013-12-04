(function() {
    'use strict';

    var module = angular.module('controllers.EnvironmentDetail', [
        'lib.lodash',
        'lib.jquery',
        'common.service.polling'
    ]);

    module.controller('EnvironmentDetailCtrl',
        function($scope, pollingService, $routeParams, $location, $anchorScroll, $q, _, $jq) {

            function updateEnvironmentStatus() {
                $scope.group.update();
            }

            $scope.envId = $routeParams.envId;
            if(!$scope.envId) {
                var urlParts = $location.path().split("/");
                $scope.envId = urlParts[urlParts.length - 1];
            }
            $scope.group = {};
            $scope.EnvironmentStatuses = be.EnvironmentStatuses;

            $jq.ajax('/data/environments.json', {
                dataType: 'json',
                success: function (json, status) {
                    $scope.group = new be.EnvironmentGroup($scope, $q, _, json.filter(function (env) {
                        return env.id === $scope.envId;
                    })[0]);
                    var loadPromise = $scope.group.init();
                    $scope.$apply();
                    loadPromise.then(function() {
                        // hide html until all envs are done loading
                        // hide via jquery since we're outside an angular digest
                        $jq('.loading-shim').hide();
                        $anchorScroll();
                    });
                    pollingService.startPoll(updateEnvironmentStatus, be.EnvironmentStatuses.POLL_WAIT_TIME);
                },
                timeout: be.EnvironmentStatuses.TIMEOUT
            }).fail(pollingService.loadFail);
        });

})();