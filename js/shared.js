var be = be || {};

be.flatten = function(envGroups) {
    var flat = [];

    for(var i = 0; i < envGroups.length; i++) {
        // node.js will read environmentsJSON and browser will already have parsed it to environments
        var envs = envGroups[i].environments ? envGroups[i].environments : envGroups[i].environmentsJSON;
        for(var j = 0; j < envs.length; j++) {
            var env = envs[j];
            env.groupId = envGroups[i].id;
            flat.push(env);
        }
    }

    return flat;
};

// export for node.js
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports.flatten = be.flatten;
}