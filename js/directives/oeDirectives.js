(function() {
    'use strict';
    var module = angular.module('oe.directives', [
    ]);

    module.directive('oeMainContent', function() {
        return {
            restrict: 'E',
            replace: true,
            controller: 'OECtrl',
            templateUrl: 'partials/oe-main-content.html'
        };
    });
})();
