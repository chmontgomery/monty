var connect = require('connect'), // hosts web server
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    mkdirp = require('mkdirp'), // mkdir -p
    q = require('q'), // promises library
    shared = require('./js/shared.js'),
    utils = require('./js/serverUtils.js'),
    //splunkSearch = require('./batchjobs/splunkSearch'),
    _ = require('lodash');

var oe = {};
var env = {};
env.configFile = 'data/environments.json';
var montyVersion = "";

function writeFile(filePath, data) {
    fs.writeFile(filePath, data, function(err) {
        if(err) {
            console.log("   ERROR writing to " + filePath + " -> " + err);
        }
    });
}

function writeJsonToFile(filePath, json) {
    writeFile(filePath, JSON.stringify(json));
}

function writeEnvironmentRequestError(filePath) {
    fs.exists(filePath, function(exists) {
        if (!exists) { // never received json from this env so create a stub
            writeJsonToFile(filePath, { consecutivePingFails: 1 });
        } else { // received json from this env b4 but now we can't reach it
            fs.readFile(filePath, 'utf8', function (err, data) {
                if (err) {
                    console.log("   ERROR reading from " + filePath + " -> " + err);
                } else {
                    var json;
                    try {
                        json = JSON.parse(data);
                        json.consecutivePingFails++;
                    } catch (e) {
                        // bad json persisted in generated file
                        json = { consecutivePingFails: 1 };
                    }
                    writeJsonToFile(filePath, json);
                }
            });
        }
    });
}

function requestError(protocol, options, filePath, e) {
    var url = protocol + "://" + options.hostname;
    url += options.port ? ":" + options.port : "";
    url += options.path;
    console.log("   ERROR with request to " + url + " -> " + e.message);
    writeEnvironmentRequestError(filePath);
}

function requestToFile(optionsOrUrl, filePath) {
    if (!optionsOrUrl) {
        console.log("ERROR invalid url detected. Cannot write to " + filePath);
        writeEnvironmentRequestError(filePath);
        return;
    }
    var options = (typeof optionsOrUrl === 'string') ? utils.urlTryParse(optionsOrUrl) : optionsOrUrl;
    var protocol = options.protocol;
    var nodeProtocol = eval(options.protocol); // jshint ignore:line
    delete options.protocol;
    options.timeout = 3000; //TODO done a different way?
    nodeProtocol.get(options, function(res) {
        var data = '';
        res.on('data', function(chunk){
            data += chunk;
        });
        res.on('end',function(){
            var result;
            try {
                result = JSON.parse(data);
                result.consecutivePingFails = 0;
                writeJsonToFile(filePath, result);
            } catch (e) {
                // failed to parse data as json, either:
                if (options.path.indexOf(".xml") !== -1) {
                    // 1. it was supposed to respond with xml to being with
                    writeFile(filePath, data);
                } else {
                    // 2. service failed so responded with xml
                    console.log("ERROR parsing response from " + options.path, e);
                    writeEnvironmentRequestError(filePath);
                }
            }

        });
    }).on("error", function(error){
            requestError(protocol, options, filePath, error);
        });
}

oe.updateAllData = function() {
    var totalMembers = {
        protocol: 'http',
        hostname: '',
        path: ''
    }, oeStats = {
        protocol: 'http',
        hostname: '',
        path: ''
    };
    requestToFile(totalMembers, "data/generated" + totalMembers.path);
    requestToFile(oeStats, "data/generated" + oeStats.path);
};

// TODO introduce promises here
env.updateAllData = function() {
    fs.readFile(env.configFile, 'utf8', function(err, data) {
        if (err) {
            return console.log("ERROR reading " + env.configFile + " -> " + err);
        }
        var environments = shared.flatten(JSON.parse(data));
        var envsDir = 'data/generated/environments/';
        mkdirp(envsDir, function (err) {
            if(err) {
                return console.log("   ERROR creating " + envsDir + " -> " + err);
            }
            for (var i = 0; i < environments.length; i++) {
                var environment = environments[i];
                requestToFile(environment.bloomhealthStatusUrl, envsDir + environment.id + "-bloomhealth.json");
                requestToFile(environment.grandpaStatusUrl, envsDir + environment.id + "-grandpa.json");
                requestToFile(environment.bhboStatusUrl, envsDir + environment.id + "-bhbo.json");
                if (environment.batchStatusUrl) {
                    requestToFile(environment.batchStatusUrl, envsDir + environment.id + "-batch.json");
                }
            }
        });
    });
};

/**
 * run the given function every given number of milliseconds
 * @param {function} doStuff
 * @param {number} pollAgainInMS
 * @param {string} [whatYouDid]
 */
function poll(doStuff, pollAgainInMS, whatYouDid) {
    doStuff();
    var now = new Date();
    var msg = whatYouDid ? whatYouDid + ". " : "";
    msg += "Will run again on " + new Date(now.getTime() + (pollAgainInMS));
    console.log(msg);
    setTimeout(function() {
        poll(doStuff, pollAgainInMS, whatYouDid);
    }, pollAgainInMS);
}

function readConfig() {
    var deferred = q.defer();
    var configFile = 'monty-config.json';
    fs.readFile(configFile, 'utf8', function(err, data) {
        if (err) {
            deferred.reject(new Error("ERROR reading " + configFile + " -> " + err));
        } else {
            deferred.resolve(JSON.parse(data));
        }
    });
    return deferred.promise;
}

function mapConfigValues(configData) {
    env.POLL_DELAY = configData.environments_poll_deplay_ms;
    oe.POLL_DELAY = configData.oe_poll_delay_ms;
    montyVersion = configData.version;
}

function launchPolling() {
    if (!oe.POLL_DELAY || !env.POLL_DELAY) {
        throw new Error("poll values not read correctly");
    }
    console.log("");
    console.log("Start polling for data ->");
    console.log("=========================");
    poll(oe.updateAllData, oe.POLL_DELAY, "Updated OE Stats");
    poll(env.updateAllData, env.POLL_DELAY, "Updated All Environments");
}

var appArgs = process.argv.slice(2,process.argv.length);

var app = connect()
    //.use( '/splunkSearch', splunkSearch )
    .use( connect.static(__dirname) );

http.createServer(app).listen(1337);

console.log('Server running at http://localhost:1337/');

readConfig().then(mapConfigValues).then(function(){
    console.log('Running application version: ', montyVersion);
    if (_.contains(appArgs, '--use-local-data')) {
        console.log('Not fetching new data as requested. Assuming all data/generated files already exist.');
    } else {
        launchPolling();
    }
}).done();