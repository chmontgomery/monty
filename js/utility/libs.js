(function() {
    'use strict';

    angular.module('lib.lodash', [])
        .factory('_', function() {
            return window._;
        });

    angular.module('lib.jquery', []).
        factory('$jq', function() {
            return window.jQuery;
        });
})();