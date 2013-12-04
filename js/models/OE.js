var be;
(function (be) {
    var OE = (function () {
        function OE() { }
        OE.POLL_WAIT_TIME = 300000;
        OE.SELECTED_ENVIRONMENT_KEY = 'SELECTED_ENVIRONMENT_KEY';
        return OE;
    })();
    be.OE = OE;    
})(be || (be = {}));
