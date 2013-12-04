/* Filters */

(function() {
    'use strict';

    var module = angular.module('common.filters', ['lib.lodash']);

    module.filter('onBoolProperty', function(_) {

        return function(items, onBoolProperty) {
            if (!onBoolProperty) {
                return items;
            }
            return _.filter(items, function(item) {
                return item[onBoolProperty];
            });
        };
    });

    module.filter('ignoreEnvironmentProperties', function(_) {
        return function(statusObj) {
            var filteredProperties = {};
            _.forOwn(statusObj, function(value, key) {
                if (key !== 'environmentInfoClass' &&
                    key !== 'statusIcon') {
                    filteredProperties[key] = value;
                }
            });
            return filteredProperties;
        };
    });

})();

            
