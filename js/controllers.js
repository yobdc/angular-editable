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
			address1: null,
			address2: null,
			address3: null
		}
	};
}]);