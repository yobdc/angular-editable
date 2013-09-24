'use strict';

/* Directives */


angular.module('myApp.directives', []).directive('editable', ['$parse', function($parse) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			output: '=output'
		},
		transclude: true,
		template: '<div>' + 
		'<div ng-show="isEdit" ng-transclude></div>' + 
		'<label class="control-label" ng-show="!isEdit">{{output}}&nbsp;&nbsp;&nbsp;<i class="icon-repeat" ng-show="!isEdit&&mode==\'mix\'" ng-click="restore()"></i></label>' + 
		// '<button ng-show="isEdit&&mode==\'mix\'" ng-click="ok()">OK</button>' + 
		// '<button ng-show="isEdit&&mode==\'mix\'" ng-click="cancel()">Cancel</button>' + 
		'</div>',
		link: function(scope, iElement, iAttrs, controller) {
			if(iAttrs.mode == 'in' || iAttrs.mode == 'out' || iAttrs.mode == 'mix') {
				scope.mode = iAttrs.mode;
			} else {
				scope.mode = 'in';
			};

			if(iAttrs.mode == 'in') {
				scope.isEdit = true;
			} else {
				scope.isEdit = false;
			};
		},
		controller: function($scope, $element, $attrs, $transclude) {
			var element = $element;
			$element.bind('dblclick', function(event) {
				if($scope.mode == 'mix') {
					$scope.isEdit = true;
					$scope.$apply();
					$("input")[0].focus();
				};
			});

			var searchEle = function(array, target) {
					var result = false;
					for(var i = 0; i < array.length; i++) {
						if(array[i] == target) {
							result = true;
							break;
						};
						if( !! array[i].children.length) {
							result = searchEle(array[i].children, target);
							if(result) {
								break;
							};
						};
					};
					return result;
				};

			$(document).click(function(e) {
				var tar = angular.element(e.target);
				var result = searchEle($element.children(), tar[0]);
				if(!result && $scope.isEdit && ($scope.mode == 'mix' || $scope.mode == 'in')) {
					$scope.ok();
					$scope.$apply();
				};
			});

			$scope.ok = function() {
				if($scope.mode == 'mix') {
					$scope.isEdit = false;
				};
				$scope.$parent.$broadcast('ok', {
					element: element
				});
			};

			$scope.cancel = function() {
				if($scope.mode == 'mix') {
					$scope.isEdit = false;
				};
				$scope.$parent.$broadcast('cancel', {
					element: element
				});
			};
			$scope.restore = function() {
				$scope.$parent.$broadcast('revert', {
					element: element
				});
			};
		}
	};
}]).directive('edit', [function() {
	return {
		restrict: 'A',
		scope: true,
		require: 'ngModel',
		link: function(scope, iElement, iAttrs, controller) {},
		controller: function($scope, $element, $attrs, $transclude) {
			var scope = $scope;
			scope.copy = {};
			scope.copy2 = {};
			var attrs = $attrs;
			var element = $element;
			var copyAttr = function(des, src, attr) {
					var list = attr.split('.');
					var tmpDes = des;
					var tmpSrc = src;
					var copyDes = des;
					var i = 0;
					for(i = 0; i < list.length; i++) {
						if( !! tmpDes[list[i]] == false) {
							tmpDes[list[i]] = {};
						};
						tmpDes = tmpDes[list[i]];
						tmpSrc = tmpSrc[list[i]];
						if(list.length == i + 2) {
							copyDes = tmpDes;
						};
					};
					if(typeof(tmpSrc) == 'object' && !tmpSrc.hasOwnProperty()) {
						tmpSrc = undefined;
						copyDes[list[i - 1]] = undefined;
					} else {
						copyDes[list[i - 1]] = angular.copy(tmpSrc);
					};
				};
			var searchEle = function(array, target) {
					var result = false;
					for(var i = 0; i < array.length; i++) {
						if(array[i] == target) {
							result = true;
							break;
						};
						if( !! array[i].children.length) {
							result = searchEle(array[i].children, target);
							if(result) {
								break;
							};
						};
					};
					return result;
				};
			copyAttr(scope.copy, scope.$parent.$parent, attrs.ngModel);
			copyAttr(scope.copy2, scope.$parent.$parent, attrs.ngModel);
			$scope.$on('ok', function(event, args) {
				if( !! args && !! args.element && searchEle(args.element, element[0])) {
					copyAttr(scope.$parent.$parent, scope, attrs.ngModel);
					copyAttr(scope.copy, scope, attrs.ngModel);
				};
			});
			$scope.$on('cancel', function(event, args) {
				if( !! args && !! args.element && searchEle(args.element, element[0])) {
					copyAttr(scope.$parent.$parent, scope.copy, attrs.ngModel);
				};
			});
			$scope.$parent.$parent.$watch(attrs.ngModel, function(oldValue, newValue) {
				copyAttr(scope.copy, scope.$parent.$parent, attrs.ngModel);
				copyAttr(scope, scope.$parent.$parent, attrs.ngModel);
			});
			$scope.$on('restore', function(event, args) {
				copyAttr(scope.$parent.$parent, scope.copy2, attrs.ngModel);
				copyAttr(scope.copy, scope.copy2, attrs.ngModel);
				copyAttr(scope, scope.copy2, attrs.ngModel);
			});
			$scope.$on('save', function(event, args) {
				copyAttr(scope.copy2, scope.$parent.$parent, attrs.ngModel);
			});
			$scope.$on('revert', function(event, args) {
				if( !! args && !! args.element && searchEle(args.element, element[0])) {
					copyAttr(scope.$parent.$parent, scope.copy2, attrs.ngModel);
					copyAttr(scope.copy, scope.copy2, attrs.ngModel);
					copyAttr(scope, scope.copy2, attrs.ngModel);
				};
			});
		}
	};
}]).factory('HistoryService', ['$rootScope', function($rootScope) {
	return {
		restore: function() {
			$rootScope.$broadcast('restore');
		},
		save: function() {
			$rootScope.$broadcast('save');
		}
	};
}]);