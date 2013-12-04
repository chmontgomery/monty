/**
 * @param {string} url
 * @returns {*}
 */
function matchUrl(url) {
    return url.match(/(http[s]?):\/\/(.*?)(:([0-9]+))?\/(.*)/);
}

function urlTryParse(url) {
    var matches = matchUrl(url);
    if (!matches) {
        return false;
    }
    var o = {};
    o.protocol = matches[1];
    o.hostname = matches[2];
    o.port = matches[4];
    o.path = '/' + matches[5];
    return o;
}

// export for node.js
if (typeof module !== 'undefined') {
    module.exports.matchUrl = matchUrl;
    module.exports.urlTryParse = urlTryParse;
}