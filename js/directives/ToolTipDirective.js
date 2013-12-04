(function() {
    'use strict';
    var module = angular.module('tooltip.directives', [
    ]);

    module.directive('tooltip', function() {
        return {
            restrict:'A',
            link: function(scope, element, attrs) {
                $(element)
                    .attr('title',scope.$eval(attrs.tooltip))
                    .tooltip({placement: "right"});
            }
        };
    });
})();