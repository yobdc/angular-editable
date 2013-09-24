'use strict';

/* Directives */


angular.module('myApp.directives', []).
directive('appVersion', ['version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}]).directive('xeditable', function($timeout) {
	return {
		restrict: 'A',
		require: "ngModel",
		link: function(scope, element, attrs, ngModel) {
			var loadXeditable = function() {
					angular.element(element).editable({
						display: function(value, srcData) {
							ngModel.$setViewValue(value);
							scope.$apply();
						}
					});
				}
			$timeout(function() {
				loadXeditable();
			}, 10);
		}
	};
}).directive('ngBlur', function() {
	return function(scope, elem, attrs) {
		elem.bind('blur', function() {
			scope.$apply(attrs.ngBlur);
		});
	};
}).directive('editable', ['$parse', function($parse) {
	return {
		priority: 1000,
		restrict: 'E',
		replace: true,
		scope: {
			output: '=output'
		},
		// scope: true,
		transclude: true,
		template: '<div>' + '<div ng-show="isEdit" ng-transclude></div>' + '<div ng-show="!isEdit">{{output}}</div>' + '<button ng-show="isEdit&&mode==\'mix\'" ng-click="ok()">OK</button>' + '<button ng-show="isEdit&&mode==\'mix\'" ng-click="cancel()">Cancel</button>' + '</div>',
		link: function(scope, iElement, iAttrs, controller) {
			// scope.output = scope[iAttrs.output];
			// scope.output = 1;
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
			// if ($attrs.mode=='in' || $attrs.mode=='out' || $attrs.mode=='mix') {
			// 	$scope.mode = $attrs.mode;
			// } else {
			// 	$scope.mode = 'in';
			// };
			// if ($attrs.mode=='in') {
			// 	$scope.isEdit = true;
			// } else {
			// 	$scope.isEdit = false;
			// };
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
			$scope.$parent.$broadcast('mode', {
				mode: $scope.mode
			});
		}
	};
}]).directive('edit', [function() {
	return {
		priority: 100000,
		restrict: 'A',
		scope: true,
		require: 'ngModel',
		link: function(scope, iElement, iAttrs, controller) {
			// controller.$setViewValue(scope.model);
			// iElement.val(scope.model);
		},
		controller: function($scope, $element, $attrs, $transclude) {
			var scope = $scope;
			scope.copy = {};
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
					copyDes[list[i - 1]] = angular.copy(tmpSrc);
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
			// if($scope.$parent.$parent.mode == 'in') {
			$scope.$on('mode', function(event, args) {
				if( !! args && !! args.element && searchEle(args.element, element[0])) {
					scope.mode = args.mode;
					$scope.$parent.$parent.$watch(attrs.ngModel, function(oldValue, newValue) {
						copyAttr(scope.copy, scope.$parent.$parent, attrs.ngModel);
						copyAttr(scope, scope.$parent.$parent, attrs.ngModel);
					});
				};
			});
			// };
		}
	};
}]);