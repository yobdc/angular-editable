'use strict';

/* Directives */


angular.module('myApp.directives', []).directive('editable', ['$compile', 'RandomService', '$templateCache', '$http', function($compile, RandomService, $templateCache, $http) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			output: '=output'
		},
		priority: 0,
		transclude: true,
		template: '<div>' + 
		'<div ng-show="isEdit" ng-transclude></div>' + 
		'<label class="control-label showhim" ng-show="!isEdit">{{output}}' + 
		'&nbsp;&nbsp;&nbsp;<i class="icon-repeat showme" ng-show="!isEdit&&(mode==\'mix\'||mode==\'popover\')" ng-click="restore()"></i>' + 
		'</label>' +
		// '<script type="text/ng-template" id="{{tmpId}}" ng-transclude>111</script>' +
		// '<button type="button" class="btn" bs-popover="\'zz.html\'">aaa</button>'+
		// '<button ng-show="isEdit&&mode==\'mix\'" ng-click="ok()">OK</button>' + 
		// '<button ng-show="isEdit&&mode==\'mix\'" ng-click="cancel()">Cancel</button>' + 
		'</div>',
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function(scope, iElement, iAttrs, controller) {
					// scope.tmpId = 'TMP' + RandomService.string() + '.html'
					// scope.ele = iElement;
					// scope.includeHtml = $('<div><button type="button" class="btn" bs-popover="\''+scope.tmpId+'\'">aaa</button>' + '<script type="text/ng-template" id="' + scope.tmpId + '">zz</script></div>');
					// scope.ready = false;
					// transclude(scope, function(jElement, jScope){
					// 	// jScope.includeHtml[0].children[1].appendChild(jElement[1]);
					// 	angular.element(jScope.includeHtml[0].children[1]).append(angular.element(jElement[1]));
					// 	angular.element(jScope.ele[0]).append(angular.element(jScope.includeHtml[0]));
					// 	// jScope.ele[0].appendChild(jScope.includeHtml[0]);
					// 	$templateCache.put(jScope.tmpId, jScope.includeHtml[0].children[1].innerHTML);
					// 	var a = $templateCache.get(jScope.tmpId);
					// 	jScope.tmgIdCache = a;
					// 	jScope.ready = true;
					// 	$compile(angular.element(jScope.ele[0].children[2].children[0]))(jScope);
					// });
					// scope.tmpId = 'TMP' + RandomService.string() + '.html'
					// scope.ele = iElement;
					// scope.includeHtml = $('<div><button type="button" class="btn" bs-popover="\''+scope.tmpId+'\'">aaa</button>' + '<script type="text/ng-template" id="' + scope.tmpId + '" ng-transclude>zz</script></div>');
					// scope.includeHtml[0].children[1].appendChild(scope.ele[1]);
					// scope.ele[0].appendChild(scope.includeHtml[0]);
					// $compile(angular.element(scope.includeHtml[0]))(scope);
				},
				post: function(scope, iElement, iAttrs, controller) {
					if(iAttrs.mode == 'in' || iAttrs.mode == 'out' || iAttrs.mode == 'mix' || iAttrs.mode == 'popover') {
						scope.mode = iAttrs.mode;
					} else {
						scope.mode = 'in';
					};

					if(iAttrs.mode == 'in') {
						scope.isEdit = true;
					} else {
						scope.isEdit = false;
					};
					// scope.tmpId = 'TMP' + RandomService.string() + '.html'
					// scope.ele = iElement;
					// scope.includeHtml = $('<button type="button" class="btn" bs-popover="\''+scope.tmpId+'\'">aaa</button>');
					// // scope.includeHtml[0].children[1].appendChild(scope.ele[0]);
					// scope.ele[0].appendChild(scope.includeHtml[0]);
					// // $compile(angular.element(scope.ele[0].children[3]))(scope);
					// // $compile(angular.element(scope.ele[0].children[2]))(scope);
					// $http.get(scope.tmpId).then(function(data) {
					// 	// body...
					// 	var n = 0;
					// },function(data) {
					// 	// body...
					// 	var n = $templateCache.get(scope.tmpId);
					// });
				}
			}
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
}]).directive('editable2', ['$compile', 'RandomService', '$templateCache', '$http', function($compile, RandomService, $templateCache, $http) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			output: '=output',
		},
		priority: 0,
		transclude: true,
		template: '<div>' + 
		'<div ng-transclude></div>' + 
		'<label class="control-label showhim" bs-popover="\'{{tmpId}}\'">{{output}}' + 
		'&nbsp;&nbsp;&nbsp;<i class="icon-repeat showme" ng-show="!isEdit" ng-click="restore()"></i>' + 
		'</label>' +
		// '<script type="text/ng-template" id="{{tmpId}}" ng-transclude>111</script>' +
		// '<button type="button" class="btn" bs-popover="\'a.html\'">aaa</button>'+
		// '<button ng-show="isEdit&&mode==\'mix\'" ng-click="ok()">OK</button>' + 
		// '<button ng-show="isEdit&&mode==\'mix\'" ng-click="cancel()">Cancel</button>' + 
		'</div>',
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function(scope, iElement, iAttrs, controller) {
					// scope.tmpId = 'TMP' + RandomService.string() + '.html';
					scope.tmpId = iAttrs.tmpid;
				},
				post: function(scope, iElement, iAttrs, controller) {
				}
			}
		},
		controller: function($scope, $element, $attrs, $transclude) {
			var element = $element;
			$element.bind('dblclick', function(event) {
				// if($scope.mode == 'mix') {
				// 	$scope.isEdit = true;
				// 	$scope.$apply();
				// 	$("input")[0].focus();
				// };
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

			// $(document).click(function(e) {
			// 	var tar = angular.element(e.target);
			// 	var result = searchEle($element.children(), tar[0]);
			// 	if(!result && $scope.isEdit && ($scope.mode == 'mix' || $scope.mode == 'in')) {
			// 		$scope.ok();
			// 		$scope.$apply();
			// 	};
			// });

			// $scope.ok = function() {
			// 	if($scope.mode == 'mix') {
			// 		$scope.isEdit = false;
			// 	};
			// 	$scope.$parent.$broadcast('ok', {
			// 		element: element
			// 	});
			// };

			// $scope.cancel = function() {
			// 	if($scope.mode == 'mix') {
			// 		$scope.isEdit = false;
			// 	};
			// 	$scope.$parent.$broadcast('cancel', {
			// 		element: element
			// 	});
			// };
			// $scope.restore = function() {
			// 	$scope.$parent.$broadcast('revert', {
			// 		element: element
			// 	});
			// };
		}
	};
}]).directive('edit', [function() {
	return {
		restrict: 'A',
		scope: true,
		require: 'ngModel',
		link: function(scope, iElement, iAttrs, ngModel) {},
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
					// $scope.$apply(function(){
					// });
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