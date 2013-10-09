'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
controller('MyCtrl1', ['$scope', 'HistoryService', '$timeout', function($scope, HistoryService, $timeout) {
	$scope.init = function() {};
	$scope.customer = {
		id: '101',
		// name: 'Lex',
		// gender: 'M',
		address: {
			country: '中国',
			city: '上海',
			location: '新金桥路27号8号楼'
		}
	};
	$scope.list = [{
		name: '11'
	}, {
		name: '22'
	}, {
		name: '33'
	}];

	$scope.selectedList = $scope.list[1];
	$timeout(function() {
		// $scope.genders = [{"name":"个人","code":"Person","description":null},{"name":"公司","code":"Company","description":null}];
		// $scope.customer.gender = $scope.genders[0];
		$scope.genders = ['M', 'F'];
		$scope.customer.gender = $scope.genders[0];
		$scope.customer.name = 'LEX';
	}, 1000);
	$scope.restore = function() {
		HistoryService.restore();
	};
	$scope.save = function() {
		HistoryService.save();
	};
	$scope.modifyList = function() {
		$scope.selectedList = $scope.list[0];
	};

	$scope.contact = {
		emails: []
	};
	$scope.contact.emails.creating = true;

	$scope.addEmail = function() {
		$scope.contact.emails.creating = true;
		$scope.tmpEmail = '';
		$('#tmpEmail').focus();
	};

	$scope.blurEmail = function(email) {
		if (email) {
			$scope.contact.emails.push(email);
			$scope.contact.emails.creating = false;
		} else {			
			if ($scope.contact.emails.length>0) {
				$scope.contact.emails.creating = false;
			};
		};
		console.log('blur email:'+email+"__");
	};
}]);