var be;
(function (be) {
    var EnvironmentStatusIcon = (function () {
        function EnvironmentStatus(type, color, panelClass) {
            this.type = type;
            this.color = color;
            this.panelClass = panelClass;
        }
        EnvironmentStatus.prototype.getStatusClassColor = function () {
            return 'circle-' + this.color;
        };
        EnvironmentStatus.prototype.getPanelClassColor = function () {
            return this.panelClass;
        };
        return EnvironmentStatus;
    })();
    be.EnvironmentStatus = EnvironmentStatusIcon;
    var EnvironmentStatuses = (function () {
        function EnvironmentStatuses() { }
        EnvironmentStatuses.WARNING = new be.EnvironmentStatus('WARNING', 'yellow', 'panel-warning');
        EnvironmentStatuses.SUCCESS = new be.EnvironmentStatus('SUCCESS', 'green', 'panel-success');
        EnvironmentStatuses.FAIL = new be.EnvironmentStatus('FAIL', 'red', 'panel-danger');
        EnvironmentStatuses.TIMEOUT = 3000;
        EnvironmentStatuses.POLL_WAIT_TIME = 30000;
        EnvironmentStatuses.PING_FAILS_ALLOWED_UNTIL_FAILURE = 19;
        EnvironmentStatuses.OUT_OF_DATE_CLASS = "statusOutOfDate";
        EnvironmentStatuses.activePollingId = "";
        return EnvironmentStatuses;
    })();
    be.EnvironmentStatuses = EnvironmentStatuses;
})(be || (be = {}));
