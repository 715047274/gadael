define([], function() {

    'use strict';

	return [
        '$scope',
        '$location',
        '$routeParams',
        'Rest',
        '$modal',
        function($scope, $location, $routeParams, Rest, $modal) {

        var userResource = Rest.admin.users.getResource();
        var beneficiaryResource = Rest.admin.beneficiaries.getResource();
        var adjustmentResource = Rest.admin.adjustments.getResource();




        if (!$location.search().user) {
            throw new Error('The user parameter is mandatory');
        }

        $scope.user = userResource.get({id: $location.search().user});
        $scope.user.$promise.then(function() {
            $scope.beneficiary = beneficiaryResource.get({
                id: $routeParams.id,
                account: $scope.user.roles.account._id
            });
        });

		$scope.back = function back() {
			$location.path('/admin/users/'+$scope.user._id);
		};

        $scope.addAdjustment = function addAdjustment(renewal) {
            var modalscope = $scope.$new();

            modalscope.renewal = renewal;

            modalscope.adjustment = new adjustmentResource();

            modalscope.adjustment.rightRenewal = renewal._id;
            modalscope.adjustment.user = $scope.user._id;
            modalscope.adjustment.quantity = 0;
            modalscope.adjustment.comment = '';


            var modal = $modal({
                scope: modalscope,
                template: 'partials/admin/adjustment-edit.html',
                show: true
            });


            modalscope.cancel = function() {
                modal.hide();
            };

            modalscope.save = function() {
                modalscope.adjustment.$save();
            };
        };

	}];
});