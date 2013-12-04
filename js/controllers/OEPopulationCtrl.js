(function() {
    'use strict';

    var module = angular.module('controllers.OEPopulation', [
        'common.service.polling'
    ]);

    module.controller('OEPopulationCtrl',
        function($scope) {

            function updateOEData() {
                $.ajax('/data/generated/gecko_total_members_stats.xml', {
                    dataType: "xml",
                    success: function (xml, status) {
                        $scope.totalMembers = [];
                        var $xml = $(xml);
                        var xmlStats = $xml.find("item");
                        $.each(xmlStats, function (i, value) {
                            var stat = {
                                title: "",
                                value: ""
                            };
                            var xmlItem = $(value);
                            stat.title = xmlItem.find("text").text();
                            stat.value = xmlItem.find("value").text();
                            $scope.totalMembers.push(stat);
                        });
                        $scope.$apply();
                    }
                }).fail(function(xhr, status, error) {
                        $scope.loadFailed = true;
                        $scope.$apply();
                    });
            }

            updateOEData(); // don't poll on this page since the data updates very in-frequently

            $scope.totalMembers = [];
            $scope.loadFailed = false;
        });
})();