exports.testMatchUrlSimple = function(test){
    var utils = require('../../serverUtils.js');
    var simpleUrl = 'https://qa1.moolb.com/appStatus';
    var result = utils.matchUrl(simpleUrl);
    test.ok(result);
    test.strictEqual(result[1], 'https');
    test.strictEqual(result[2], 'qa1.moolb.com');
    test.strictEqual(result[3], null);
    test.strictEqual(result[4], null);
    test.strictEqual(result[5], 'appStatus');
    test.done();
};

exports.testMatchUrlSimple = function(test){
    var utils = require('../../serverUtils.js');
    var urlWithPort = 'http://54.236.88.72:8090/build-info';
    var result = utils.matchUrl(urlWithPort);
    test.ok(result);
    test.strictEqual(result[1], 'http');
    test.strictEqual(result[2], '54.236.88.72');
    test.strictEqual(result[3], ':8090');
    test.strictEqual(result[4], '8090');
    test.strictEqual(result[5], 'build-info');
    test.done();
};

exports.testMatchNotAUrl = function(test){
    var utils = require('../../serverUtils.js');
    var notAUrl = 'not a url';
    var result = utils.matchUrl(notAUrl);
    test.ok(!result);
    test.done();
};

exports.testUrlTryParse = function(test){
    var utils = require('../../serverUtils.js');
    var simpleUrl = 'https://qa1.moolb.com/appStatus';
    var result = utils.urlTryParse(simpleUrl);
    test.ok(result);
    test.strictEqual(result.protocol, 'https');
    test.strictEqual(result.hostname, 'qa1.moolb.com');
    test.strictEqual(result.port, undefined);
    test.strictEqual(result.path, '/appStatus');
    test.done();
};

exports.testUrlTryParseNotUrl = function(test){
    var utils = require('../../serverUtils.js');
    var notAUrl = 'not a url';
    var result = utils.urlTryParse(notAUrl);
    test.strictEqual(result, false);
    test.done();
};