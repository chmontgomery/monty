(function () {
    'use strict';
    var module = angular.module('batchJobs.services', []);

    module.factory('batchJobSearchSvc',
        function($http) {
            var splunkDateFormat = 'MM/DD/YYYY:HH:mm:ss',
                defaultEnvironment = 'production1',
                searchBaseUrl = '/splunkSearch';

            return {
                searchRedis: function(options, success, error) {
                    var searchDefaults = {
                            env: defaultEnvironment},
                        url = '/batchStats';

                    $.extend( searchDefaults,options );
                    url += '?env=' +options.env;

                    $http( {method: 'GET', url: url} )
                        .success( success )
                        .error( error );
                },

                searchBatchJobs: function(options, success, error) {
                    var searchDefaults = {
                            env: defaultEnvironment,
                            earliest: moment().subtract( 'days', 7 ).format( splunkDateFormat ),
                            latest: moment().format( splunkDateFormat )},
                        config = {
                            method: 'GET',
                            url: searchBaseUrl,
                            params: {},
                            timeout: 10000
                        };

                    options = $.extend( searchDefaults,options );
                    config.params = options;

                    $http( config )
                        .success( success )
                        .error( error );
                },

                sortJobsByStatus: function(jobs) {
                    return jobs.sort( function(current, next) {
                        var statusProperty = 'lastStatus',
                            keyProperty = "jobKey",
                            statuses = {
                                'FAILURE': 1,
                                '': 2,
                                'SUCCESS': 3,
                                'MISFIRE': 4},
                            currentStatusValue = statuses[ current[statusProperty] ],
                            nextStatusValue = statuses[ next[statusProperty] ],
                            currentKey = current[keyProperty],
                            nextKey = next[keyProperty];

                        if ( currentStatusValue < nextStatusValue ) {
                            return -1;
                        }
                        else if ( currentStatusValue > nextStatusValue ) {
                            return 1;
                        }

                        if ( currentKey < nextKey ) {
                            return -1;
                        }
                        else if ( currentKey > nextKey ) {
                            return 1;
                        }

                        return 0;
                    });
                },

                loadConfig: function(success, error) {
                    $http.get('/data/batch-jobs.json').
                        success(success).
                        error(error);
                }
            };
        }
    );
})();
