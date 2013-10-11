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
	$scope.contact = {
		type: $scope.types[0],
		emails: [],
		phones: [],
		address: {
			address1: "上海",
			address2: "浦东",
			address3: "新金桥路"
		}
	};
	$scope.copy = angular.copy($scope.contact);
	$scope.copy.type = $scope.contact.type;

	$scope.clear = function() {
		$scope.contact.address.address1 = undefined;
		$scope.contact.address.address2 = undefined;
		$scope.contact.address.address3 = undefined;
	};
}]);