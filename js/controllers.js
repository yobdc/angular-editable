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
	$scope.edit = function() {
		$scope.isEdit = true;
	};
	$scope.clear = function() {
		$scope.contact.address.address1 = null;
		$scope.contact.address.address2 = null;
		$scope.contact.address.address3 = null;
	};

	function inside(array, target) {
		var result = false;
		for(var i = 0; i < array.length; i++) {
			if(array[i] == target) {
				result = true;
				break;
			};
			if( !! array[i].children.length) {
				result = inside(array[i].children, target);
				if(result) {
					break;
				};
			};
		};
		return result;
	};

	function legal() {
		return $scope.contact.address.address1 || $scope.contact.address.address2 || $scope.contact.address.address3;
	};

	$(document).click(function(elem) {
		if ($scope.isEdit) {
			var tar = angular.element(elem.target);
			var parent = angular.element($('#my'));
			var result = inside(parent[0].children, tar[0]);
			if (legal()) {
				$scope.isEdit = result;
				$scope.$apply();
			};
		};
	});
}]);