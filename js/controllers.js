'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
controller('MyCtrl1', ['$scope', 'HistoryService', function($scope, HistoryService) {
	$scope.due_date = new Date();
	$scope.person_name = "John Doe";
	$scope.address = "133, North Avenue";
	$scope.product = {
		name: '11',
		number: '33'
	};

	$scope.names = {
		options: ['aaa','bbb','ccc'],
		value: 'ccc'
	};

	$scope.handleInputBlur = function() {
		var n = 0;
	};

	$scope.show = function(){
		alert($scope.product.name + ' ' + $scope.product.number + ' ' + $scope.address + ' ' + $scope.names.value);
	};
	$scope.restore = function(){
		HistoryService.restore();
	};
	$scope.save = function(){
		HistoryService.save();
	};
}]);