'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
controller('MyCtrl1', ['$scope', function($scope) {
	$scope.due_date = new Date();
	$scope.person_name = "John Doe";
	$scope.address = "133, North Avenue";
}]);