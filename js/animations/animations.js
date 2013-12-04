/**
 * Animations
 **/
(function() {
    'use strict';

    var module = angular.module('common.animation', [
        'lib.jquery',
        'ngAnimate'
    ]);

    module.animation('.fade-animation', function($jq) {
        return {
            enter: function(element, done) {
                $jq(element).css({ opacity: 0 });
                $jq(element).animate({ opacity: 1 }, done);
            },
            leave: function(element, done) {
                $jq(element).css({ opacity: 1 });
                $jq(element).animate({ opacity: 0 }, done);
            },
            move : function(element, className, done) { done(); },
            addClass : function(element, className, done) { done(); },
            removeClass : function(element, className, done) { done(); }
        };
    });

    module.animation('.slide-animation', function($jq) {
        return {
            enter: function(element, done) {
                $jq(element).css({ display: 'none' });
                $jq(element).slideDown('fast', done);
            },
            leave: function(element, done) {
                $jq(element).slideUp('fast', done);
            },
            move : function(element, className, done) { done(); },
            addClass : function(element, className, done) { done(); },
            removeClass : function(element, className, done) { done(); }
        };
    });

})();
