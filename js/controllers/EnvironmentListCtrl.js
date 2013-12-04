(function() {
    'use strict';

    var module = angular.module('controllers.EnvironmentsList', [
        'lib.lodash',
        'common.service.polling'
    ]);

    module.controller('EnvironmentListCtrl',
        function($scope, pollingService, $q, _) {
            $scope.environmentGroups = [];
            $.ajax('/data/environments.json', {
                dataType: 'json',
                success: function (json, status) {
                    _.each(json, function (value) {
                        return $scope.environmentGroups.push(new be.EnvironmentGroup($scope, $q, _, value));
                    });
                    $scope.$apply("");
                },
                timeout: be.EnvironmentStatuses.TIMEOUT
            }).fail(pollingService.loadFail);
        });
})();