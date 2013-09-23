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
		restrict: 'E',
		replace: true,
		scope: {
			output: '=output'
		},
		// scope: true,
		transclude: true,
		template: '<div>' + '<div ng-show="isEdit" ng-transclude></div>' + 
		'<div ng-show="!isEdit">{{output}}</div>' + 
		'<button ng-show="isEdit&&mode==\'mix\'" ng-click="ok()">OK</button>' + 
		'<button ng-show="isEdit&&mode==\'mix\'" ng-click="cancel()">Cancel</button>' + 
		'</div>',
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
				if(!result && $scope.mode == 'mix') {
					$scope.ok();
					$scope.$apply();
				};
			});

			$scope.ok = function() {
				$scope.isEdit = false;
				$scope.$parent.$broadcast('ok');
			};

			$scope.cancel = function() {
				$scope.isEdit = false;
				$scope.$parent.$broadcast('cancel');
			};

			if($scope.mode == 'in') {
				$scope.$watch('mode', function(oldValue, newValue) {
					var n = 0;
				});
			};
		}
	};
}]).directive('edit', [function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, iElement, iAttrs, controller) {
			// controller.$setViewValue(scope.model);
			// iElement.val(scope.model);
		},
		controller: function($scope, $element, $attrs, $transclude) {
			var scope = $scope;
			var attrs = $attrs;
			var copyAttr = function(des, src, attr) {
					var list = attr.split('.');
					des[list[0]] = angular.copy(src[list[0]]);
				};
			$element.bind('click', function(event) {
				copyAttr(scope.$parent, scope, attrs.ngModel);
			});
			$scope.$on('ok', function(event, args) {
				copyAttr(scope.$parent, scope, attrs.ngModel);
				// scope.$parent.output = scope[attrs.ngModel];
			});
			$scope.$on('cancel', function(event, args) {
				copyAttr(scope, scope.$parent, attrs.ngModel);
				// scope[attrs.ngModel] = scope.$parent[attrs.ngModel];
				// scope[attrs.ngModel] = scope.$parent.output;
			});
		}
	};
}]);