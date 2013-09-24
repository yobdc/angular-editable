'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
controller('MyCtrl1', ['$scope', 'HistoryService', function($scope, HistoryService) {
	$scope.customer = {
		id: '101',
		name: 'Lex',
		gender: 'M',
		address: {
			country: '中国',
			city: '上海',
			location: '新金桥路27号8号楼'
		}
	};
	$scope.restore = function(){
		HistoryService.restore();
	};
	$scope.save = function(){
		HistoryService.save();
	};
}]);