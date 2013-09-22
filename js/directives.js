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
			mode: '@',
			output: '=output'
		},
		transclude: true,
		template: '<div><div ng-show="isEdit||mode==\'in\'" ng-transclude></div><div ng-show="mode==\'out\'||(mode==\'mix\'&&!isEdit)">{{output}}</div></div>',
		link: function(scope, iElement, iAttrs, controller) {
			scope.out = $parse(iAttrs.output);
			var locals = {};
			var model = scope.out(scope, locals);
			var n = 0;
		},
		controller: function($scope, $element, $attrs, $transclude) {
			$scope.isEdit = false;
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
				if(!result) {
					$scope.isEdit = false;
					$scope.$apply();
				};
			});
		}
	};
}]);