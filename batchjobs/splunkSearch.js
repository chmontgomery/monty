var config = require('../data/batch-jobs'),
	debugMode = config.debugMode,
	globalSplunkKey = config.globalSplunkKey,
	jobsConfig = config.jobs,
	url = require('url'),
	splunkjs = require('splunk-sdk'),
    Async = splunkjs.Async;

var buildSearchQuery = function( req ) {
	var urlParts = url.parse( req.url, true ),
		query = urlParts.query,
		searchQuery = 'search ' +globalSplunkKey,
		filterParams = [ 'earliest', 'latest' ],
		paramCounter = 0,
		paramTotal = filterParams.length,
		param;

	if ( query['env'] ) {
		searchQuery += ' AND host=' +query['env'] +'*';
	}

	for ( ; paramCounter < paramTotal; paramCounter++ ) {
		param = filterParams[ paramCounter ];

		if ( query[param] ) {
			searchQuery += ' ' +param +'=' +query[param];
		}
	}

	return searchQuery  +' NOT STARTING NOT EventAuditJob | sort _time asc';
};

var parseResults = function( results ) {
	var rawIdx = results.fields.indexOf( '_raw' ),
		hostIdx = results.fields.indexOf( 'host' ),
		jobs = {},
		job = {},
		jobName,
		rowCounter = 0,
		rowCount = results.rows.length,
		jobStats,
		jobIdx;

	for ( jobIdx in jobsConfig ) {
		jobs[ jobsConfig[jobIdx].jobKey ] = {
			displayName: jobsConfig[jobIdx].displayName,
			jobKey: jobsConfig[jobIdx].jobKey,
			success: 0,
			failure: 0,
			misfire: 0,
			lastRun: '',
			lastStatus: '',
			lastChecked: new Date(),
			env: ''
		};
	}

	for ( ; rowCounter < rowCount; rowCounter++ ) {
		jobData = parseStats( results.rows[rowCounter][rawIdx] );
		host = parseHostName( results.rows[rowCounter][hostIdx] );

		if ( jobData ) {
			jobName = parseJobName( jobData.name );
			job = jobs[jobName];

			if ( job ) {
				switch( jobData.status ) {
					case 'SUCCESS':
						job.success++;
						break;
					case 'FAILURE':
						job.failure++;
						break;
					case 'MISFIRE':
						job.misfire++;
						break;
				}

				job.lastStatus = jobData.status;
				job.lastRun = jobData.fireTime;
				job.env = host;
				jobs[ jobName ] = job;
			}
		}
		else {
			console.log( 'Invalid JSON message: ' +rawData );
		}
	}

	return JSON.stringify( jobs );
};

var parseStats = function( splunkMsg ) {
	var stats;

	if ( splunkMsg.indexOf('{') == -1 ) {
		console.log( 'Malformatted job stats message: '+splunkMsg );
	}
	else {
		stats = JSON.parse( splunkMsg.substring(splunkMsg.indexOf('{'), splunkMsg.length) );
	}

	return stats;
};

var parseHostName = function( host ) {
	return host.substring( 0, host.indexOf('-') );
};

var parseJobName = function( fullJobName ) {
	var revName = reverseString( fullJobName );

	return reverseString( revName.substring(0, revName.indexOf(".")) );
};

var sendResponse = function( res, content ) {
	res.setHeader('Content-Type', 'application/json');
	res.end( (content) );
};

var reverseString = function(str) {
	return str.split( "" ).reverse().join( "" );
};

var doSearch = function( req, res ) {
	var service = new splunkjs.Service( config.splunkOptions ),
		query = buildSearchQuery( req );

	if ( debugMode ) {
		console.log( 'Generated Splunk query: ' +query );
	}

    Async.chain([
        function(done) {
            service.login( done );
        },

        function( success, done ) {
            if ( !success ) {
                console.log( "Error logging in" );
            }

            service.oneshotSearch( query, {}, done );
        },

        function( results, done ) {
			if ( results ) {
				sendResponse( res, parseResults(results) );
            }
        }
    ],
    function( err ) {
		console.log( err );
    });
};

module.exports = function( req, res ) {
	doSearch( req, res );
};