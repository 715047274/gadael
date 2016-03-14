define([], function() {

    'use strict';

	return ['$scope', 'gettext', 'Rest', '$timeout', function($scope, gettext, Rest, $timeout) {

		$scope.setPageTitle(gettext('Export in XLSX file'));

        // default type

        $timeout(function() {
            $scope.type = 'requests';
            $scope.period = {
                from: null,
                to: null
            };

            $scope.downloadUrl = null;
        });

        $scope.download = function() {

            var parameters = [];

            parameters.push('format=xlsx');
            parameters.push('type='+$scope.type);

            if ('requests' === $scope.type) {
                parameters.push('from='+$scope.period.from.toJSON());
                parameters.push('to='+$scope.period.to.toJSON());
            }

            if ('balance' === $scope.type) {
                parameters.push('moment='+$scope.period.moment.toJSON());
            }

            $scope.downloadUrl = '/rest/admin/export?'+parameters.join('&');
            $timeout(function() {
                document.getElementById('downloadLink').click();
            });
        };
	}];
});
