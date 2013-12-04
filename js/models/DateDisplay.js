var be;
(function (be) {
    var DateDisplay = (function () {
        function DateDisplay() { }
        DateDisplay.tryParse = function tryParse(time) {
            if(time) {
                var m = moment(time);
                if(m.isValid()) {
                    return m;
                }
                return "";
            }
            return time;
        };
        DateDisplay.forEnvDisplay = function forEnvDisplay(m) {
            if(m && typeof m.format === 'function') {
                return m.format('MMM Do, h:mma');
            }
            return "-";
        };
        DateDisplay.short = function short(t) {
            var m = be.DateDisplay.tryParse(t);
            if(m && typeof m.format === 'function') {
                return m.format('L');
            }
            return "";
        };
        DateDisplay.fullDisplay = function fullDisplay(m) {
            if(m && typeof m.format === 'function') {
                return m.format('MMMM Do YYYY, h:mma');
            }
            return "";
        };
        return DateDisplay;
    })();
    be.DateDisplay = DateDisplay;    
})(be || (be = {}));
