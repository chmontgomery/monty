var be;
(function (be) {
    var Environment = (function () {
        function EnvironmentStatus() {
            this.statusIcon = be.EnvironmentStatuses.WARNING;
        }
        function Environment($scope, $q, json) {
            this.$scope = $scope;
            this.$q = $q;
            this.bloomhealthStatus = new EnvironmentStatus();
            this.grandpaStatus = new EnvironmentStatus();
            this.bhboStatus = new EnvironmentStatus();
            this.batchStatus = new EnvironmentStatus();
            $.extend(this, json);
        }
        Environment.prototype.buildUrlId = function () {
            return "build-url-" + this.id;
        };
        Environment.prototype.gitCommitId = function () {
            return "git-commit-" + this.id;
        };
        Environment.prototype.inflateFail = function (env, envStatus) {
            if(envStatus.consecutivePingFails > be.EnvironmentStatuses.PING_FAILS_ALLOWED_UNTIL_FAILURE) {
                envStatus.statusIcon = be.EnvironmentStatuses.FAIL;
            } else {
                envStatus.statusIcon = be.EnvironmentStatuses.WARNING;
            }
            envStatus.environmentInfoClass = be.EnvironmentStatuses.OUT_OF_DATE_CLASS;
            env.$scope.$apply("");
        };
        function handleInflate(json, env, envStatus) {
            if(json.consecutivePingFails > 0) {
                $.extend(envStatus, json);
                env.inflateFail(env, envStatus);
                return;
            }
            $.extend(envStatus, json);
            envStatus.statusIcon = be.EnvironmentStatuses.SUCCESS;
            envStatus.environmentInfoClass = "";
            envStatus.buildTime = be.DateDisplay.tryParse(envStatus.buildTime).format('MMMM Do YYYY, h:mm:ss a');
            env.$scope.$apply("");
        }
        Environment.prototype.inflate = function () {
            var that = this,
                inflatePromise = that.$q.defer();

            var bloomhealthPromise = that.$q.defer();
            var grandpaPromise = that.$q.defer();
            var bhboPromise = that.$q.defer();
            var batchPromise = that.$q.defer();

            $.ajax('/data/generated/environments/' + this.id + '-bloomhealth.json', {
                dataType: 'json',
                success: function (json, status) {
                    handleInflate(json, that, that.bloomhealthStatus);
                    bloomhealthPromise.resolve();
                },
                timeout: be.EnvironmentStatuses.TIMEOUT
            }).fail(function (xhr, status, error) {
                    that.inflateFail(that, that.bloomhealthStatus);
                    bloomhealthPromise.resolve();
                });
            $.ajax('/data/generated/environments/' + this.id + '-grandpa.json', {
                dataType: 'json',
                success: function (json, status) {
                    handleInflate(json, that, that.grandpaStatus);
                    grandpaPromise.resolve();
                },
                timeout: be.EnvironmentStatuses.TIMEOUT
            }).fail(function (xhr, status, error) {
                    that.inflateFail(that, that.grandpaStatus);
                    grandpaPromise.resolve();
                });
            $.ajax('/data/generated/environments/' + this.id + '-bhbo.json', {
                dataType: 'json',
                success: function (json, status) {
                    handleInflate(json, that, that.bhboStatus);
                    bhboPromise.resolve();
                },
                timeout: be.EnvironmentStatuses.TIMEOUT
            }).fail(function (xhr, status, error) {
                    that.inflateFail(that, that.bhboStatus);
                    bhboPromise.resolve();
                });
            // only for production
            if (this.batchStatusUrl) {
                $.ajax('/data/generated/environments/' + this.id + '-batch.json', {
                    dataType: 'json',
                    success: function (json, status) {
                        handleInflate(json, that, that.batchStatus);
                        batchPromise.resolve();
                    },
                    timeout: be.EnvironmentStatuses.TIMEOUT
                }).fail(function (xhr, status, error) {
                        that.inflateFail(that, that.batchStatus);
                        batchPromise.resolve();
                    });
            } else {
                batchPromise.resolve();
            }

            that.$q.all([
                bloomhealthPromise.promise,
                grandpaPromise.promise,
                bhboPromise.promise,
                batchPromise.promise
            ]).then(function() {
                    inflatePromise.resolve();
                });

            return inflatePromise.promise;
        };
        return Environment;
    })();
    be.Environment = Environment;
})(be || (be = {}));
