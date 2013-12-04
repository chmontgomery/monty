(function() {
    'use strict';

    var module = angular.module('controllers.OE', [
        'lib.lodash',
        'common.service.polling',
        'angularLocalStorage'
    ]);

    module.controller('OECtrl',
        function($scope, _, pollingService, storage) {

            function updateOEData() {
                $.ajax('/data/generated/open_enrollment_stats.json', {
                    dataType: "json",
                    success: function (json, status) {
                        $scope.oeStats = [];
                        $scope.oeStats = json;
                        $.each($scope.oeStats, function (i, value) {
                            $scope.oeStats[i].oeStartDate = be.DateDisplay.short($scope.oeStats[i].oeStartDate);
                            $scope.oeStats[i].oeEndDate = be.DateDisplay.short($scope.oeStats[i].oeEndDate);
                            $scope.oeStats[i].insCovStartDate = be.DateDisplay.short($scope.oeStats[i].insCovStartDate);
                        });
                        $scope.sortedOEStats = $scope.oeStats;
                        $scope.$apply();
                    },
                    timeout: be.EnvironmentStatuses.TIMEOUT
                }).fail(pollingService.loadFail);

                $.ajax('/data/environments.json', {
                    dataType: 'json',
                    success: function (json) {
                        $scope.environments = [];
                        _.each(json, function(group) {
                            _.each(group.environmentsJSON, function(env) {
                                $scope.environments.push({
                                    id: env.id,
                                    title: env.title,
                                    url: env.url
                                });
                            });
                        });
                        $scope.environments.push({
                            id: 'vagrant',
                            title: 'vagrant.moolb.com',
                            url: 'http://vagrant.moolb.com'
                        });
                        var previouslySelectedEnvId = storage.get(be.OE.SELECTED_ENVIRONMENT_KEY);
                        if (previouslySelectedEnvId) {
                            $scope.selectedEnvironment = _.find($scope.environments, function(env) {
                                return env.id === previouslySelectedEnvId;
                            });
                        } else {
                            $scope.selectedEnvironment = $scope.environments[0];
                        }
                        $scope.$apply();
                    },
                    timeout: be.EnvironmentStatuses.TIMEOUT
                }).fail(pollingService.loadFail);
            }

            function sortOEStats() {
                var sorted = _.sortBy($scope.oeStats, function(stat) {
                    var val = stat[$scope.sortType];
                    var parsedDate = be.DateDisplay.tryParse(val);
                    if (parsedDate && parsedDate.isValid()) {
                        val = parsedDate.valueOf();
                    }
                    return val;
                });
                if (!$scope.sortASC) {
                    sorted = sorted.reverse();
                }
                $scope.sortedOEStats = sorted;
            }

            updateOEData(); // don't poll on this page since the data updates very in-frequently

            $scope.oeStats = [];
            $scope.sortType = null;
            $scope.sortASC = true;
            $scope.sortedOEStats = [];
            $scope.filterBys = [
                {name: 'All active', propName: null},
                {name: 'In or close to OE', propName: 'nearOpenEnrollment'},
                {name: 'New', propName: 'employerIsNew'}
            ];
            $scope.environments = [];
            $scope.questionTooltip = "Stats are updated every night at 3am.";

            $scope.selectedFilterBy = $scope.filterBys[0];

            $scope.sortBy = function(type) {
                if (type === $scope.sortType) {
                    $scope.sortASC = !$scope.sortASC;
                } else {
                    $scope.sortASC = true; // reset to ASC
                }
                $scope.sortType = type;
                sortOEStats();
            };

            $scope.$watch('selectedEnvironment',function(newVal,oldVal) {
                if (newVal) {
                    storage.set(be.OE.SELECTED_ENVIRONMENT_KEY, $scope.selectedEnvironment.id);
                }
            });
        });
})();