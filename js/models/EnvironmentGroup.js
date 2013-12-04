var be;
(function (be) {
    var EnvironmentGroup = (function () {
        function EnvironmentGroup($scope, $q, _, defaults) {
            this.environments = [];
            this.$scope = $scope;
            this.$q = $q;
            $.extend(this, defaults);
        }
        EnvironmentGroup.prototype.init = function () {
            var that = this;
            _.each(this.environmentsJSON, function(env) {
                return that.environments.push(new be.Environment(that.$scope, that.$q, env));
            });
            return this.update();
        };
        EnvironmentGroup.prototype.update = function () {
            var updatePromise = this.$q.defer();
            var environmentPromises = [];
            $.each(this.environments, function (index, value) {
                environmentPromises.push(value.inflate());
            });
            this.$q.all(environmentPromises).then(function() {
                updatePromise.resolve();
            });
            return updatePromise.promise;
        };
        return EnvironmentGroup;
    })();
    be.EnvironmentGroup = EnvironmentGroup;
})(be || (be = {}));
