angular.module('bloomenvs', [
        'ngRoute',
        'ui.directives',
        'common.filters',
        'lib.lodash',
        'controllers.Environments',
        'controllers.EnvironmentsList',
        'controllers.EnvironmentDetail',
        'controllers.OEPopulation',
        'controllers.OE',
        'environment.directives',
        'oe.directives',
        'batchJobs.controllers',
        'common.animation',
        'tooltip.directives'
    ]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/environments', {
                templateUrl: 'partials/environments.html',
                controller: 'EnvironmentListCtrl'
            }).
            when('/environments/all', {
                templateUrl: 'partials/all-environments.html',
                controller: 'EnvironmentCtrl'
            }).
            when('/environments/:envId', {
                templateUrl: 'partials/env-detail.html',
                controller: 'EnvironmentDetailCtrl'
            }).
            when('/batch_jobs', {
                templateUrl: 'partials/batch-jobs.html',
                controller: 'BatchJobsCtrl'
            }).
            when('/batch_jobs/:view', {
                templateUrl: 'partials/batch-jobs.html',
                controller: 'BatchJobsCtrl'
            }).
            when('/batch_jobs/:view/:env', {
                templateUrl: 'partials/batch-jobs.html',
                controller: 'BatchJobsCtrl'
            }).
            when('/oe', {
                templateUrl: 'partials/oe.html'
            }).
            when('/oe-dash', {
                templateUrl: 'partials/oe-dash.html'
            }).
            when('/oe-service-population', {
                templateUrl: 'partials/oe-service-population.html',
                controller: 'OEPopulationCtrl'
            }).
            otherwise({
                templateUrl: 'partials/home.html'
            });
    }]);