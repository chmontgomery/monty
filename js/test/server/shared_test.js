exports.testFlattenEnvironmentsJson = function(test){
    var shared = require('../../shared.js');
    var environmetsJSON = require('../../../data/environments.json');
    var envsCount = 0;
    for (var i = 0; i < environmetsJSON.length; i++) {
        envsCount += environmetsJSON[i].environmentsJSON.length;
    }
    test.ok(!isNaN(envsCount) && envsCount > 10, "count should be a number");
    var flattenedEnvs = shared.flatten(environmetsJSON);
    test.strictEqual(flattenedEnvs.length, envsCount, "flatten should produce ALL environments in 1 list");
    test.done();
};