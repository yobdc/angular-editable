'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
controller('MyCtrl1', ['$scope', 'HistoryService', '$timeout', function($scope, HistoryService, $timeout) {
	$scope.init = function() {};

	$scope.types = [{
		code: 'H',
		name: '家庭'
	}, {
		code: 'O',
		name: '办公'
	}];

	$timeout(function() {
		$scope.contact = {
			type: $scope.types[0],
			emails: [{
				name: 'aaa',
				type: $scope.types[0]
			}],
			phones: [],
			address: {
				address1: "上海",
				address2: "浦东",
				address3: "新金桥路"
			}
		};
		$scope.copy = angular.copy($scope.contact);
		$scope.copy.type = $scope.contact.type;

		$scope.$broadcast('hide');
	}, 3000);

	$scope.clear = function() {
		$scope.contact.address.address1 = undefined;
		$scope.contact.address.address2 = undefined;
		$scope.contact.address.address3 = undefined;
	};

	$scope.copy2 = function() {
		$scope.contact.address = angular.copy($scope.copy.address);
	};

	$scope.addEmail = function() {
		$scope.contact.emails = $scope.contact.emails || [];
		$scope.contact.emails.push({
			name: '',
			type: $scope.types[0]
		});
	};

	$scope.removeEmail = function(index) {
		$scope.contact.emails.splice(index, 1);
		if($scope.contact.emails == 0) {
			$scope.contact.emails.push({
				name: '',
				type: $scope.types[0]
			});
		};
	};
}]);