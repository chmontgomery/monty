(function() {
    'use strict';
    var module = angular.module('common.service.guid', []);

    module.factory('guidService',
        function() {
            function s4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            var newGuid = function() {
                return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4());
            };
            return {
                newGuid: newGuid
            };
        }
    );
})();
