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
	$scope.list = [{
		name: '11'
	},{
		name: '22'
	},{
		name: '33'
	}];
	$scope.genders = ['M', 'F'];
	$scope.restore = function(){
		HistoryService.restore();
	};
	$scope.save = function(){
		HistoryService.save();
	};
	$scope.modifyList = function(){
		for (var i = 0; i < $scope.list.length; i++) {
			$scope.list[i].name += 'a';
		};
	};
}]);