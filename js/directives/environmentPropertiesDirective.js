(function() {
    'use strict';
    var module = angular.module('environment.directives', [
    ]);

    module.directive('environmentProperties', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                statusObject: '=',
                url: '=',
                heading: '@',
                envTitle: '='
            },
            controller: function($scope) {
                $scope.servicesOpen = false;
                $scope.toggleServiceDisplay = function() {
                    $scope.servicesOpen = !$scope.servicesOpen;
                };
                $scope.warningTooltip = "If we suddenly cannot reach an environment it may be due to a temporary network hiccup so we start by putting it into a warning (yellow) state. If it cannot be reached for 10 minutes (20 pings) then it will be considered down and put into a red state.";
                $scope.failTooltip = "If we cannot reach an environment for over 10 minutes (20 pings) then it is considered down and put into a red state.";
            },
            templateUrl: 'partials/environment-properties.html'
        };
    });

    module.directive('environmentPropertyValue', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                key: '=',
                value: '='
            },
            templateUrl: 'partials/environment-property-value.html'
        };
    });
})();
