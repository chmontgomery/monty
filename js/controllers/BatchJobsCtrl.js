(function() {
    'use strict';

    var module = angular.module('batchJobs.controllers', [
        'common.service.polling',
        'batchJobs.services'
    ]);

    module.controller('BatchJobsCtrl',
        function($scope, $routeParams, $location, $timeout, pollingService, batchJobSearchSvc) {

            function getStatusLight(status) {
                var light =  'grey';

                switch( status ) {
                    case 'SUCCESS':
                        light = 'green';
                        break;
                    case 'FAILURE':
                        light = 'red';
                        break;
                    case 'MISFIRE':
                        light = 'yellow';
                        break;
                }

                return light;
            }

            $scope.jobs = [];
            $scope.jobRows = [];
            $scope.columnCount = 3;
            $scope.columnClass = 'span4';
            $scope.view = $routeParams.view;
            $scope.envOptions = [];
            $scope.url = $location.url();
            $scope.searchBtnIdleLabel = 'Search Jobs';
            $scope.searchBtnActiveLabel = 'Please wait...';
            $scope.search = {
                searchBtnLabel: $scope.searchBtnIdleLabel,
                startDate: moment().subtract('days', 7).calendar(),
                endDate: moment().format('L'),
                env: ''
            };
            $scope.successTooltip = "Successful runs";
            $scope.failureTooltip = "Failed runs";
            $scope.misfireTooltip = "Misfired runs";

            $scope.isDashboardActive = function() {
                return $scope.view === 'dashboard';
            };

            $scope.doSearch = function() {
                var splunkDateFormat = 'MM/DD/YYYY:HH:mm:ss',
                    options = {
                        env: '',
                        earliest: moment( $scope.search.startDate, "MM-DD-YYYY" ).format( splunkDateFormat ),
                        latest: moment( $scope.search.endDate, "MM-DD-YYYY" ).endOf('day').format( splunkDateFormat ) };

                $scope.search.searchBtnLabel = $scope.searchBtnActiveLabel;

                if( $routeParams.env ) {
                    options.env = $routeParams.env;
                }
                else if ( $scope.search.env ) {
                    options.env = $scope.search.env.key;
                }

                batchJobSearchSvc.searchBatchJobs( options, $scope.searchSuccessCallback, function() {
                    alert('There was an error processing your request. Remember: to search batch jobs you must be on the Bloom network (in the office).');
                });
            };

            $scope.searchSuccessCallback = function(data, status, headers, config) {
                var counter = 0,
                    row = [],
                    jobKey,
                    job;

                $scope.jobRows = [];
                $scope.jobs = [];

                for ( jobKey in data ) {
                    if ( data.hasOwnProperty(jobKey) ) {
                        job = data[jobKey];
                        job.light = getStatusLight( job.lastStatus );
                        row.push( job );

                        if ( (counter+1) % $scope.columnCount === 0 ) {
                            $scope.jobRows.push( row );
                            row = [];
                        }

                        $scope.jobs.push( job );
                        counter++;
                    }
                }

                $scope.jobs = batchJobSearchSvc.sortJobsByStatus( $scope.jobs );
                $scope.jobRows.push( row );
                $scope.search.searchBtnLabel = $scope.searchBtnIdleLabel;

                if ( $scope.isDashboardActive() ) {
                    $scope.dashUpdater = $timeout( $scope.doSearch, 3000 );
                }
            };

            $scope.loadConfigSuccess = function(config) {
                $scope.envOptions = config.batchEnvironments;
                $scope.search.env = $scope.envOptions[0];
            };

            $scope.$on( "$destroy", function() {
                $timeout.cancel( $scope.dashUpdater );
            });

            batchJobSearchSvc.loadConfig( $scope.loadConfigSuccess, pollingService.loadFail );

            if ( $scope.isDashboardActive() ) {
                $scope.doSearch();
            }
        });
})();