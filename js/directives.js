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
		template: '<div>' + '<div ng-show="isEdit" ng-transclude></div>' +
		//
		'&nbsp;&nbsp;&nbsp;<i class="icon-repeat showme" ng-show="isEdit && mode==\'mix\'" ng-click="restore()"></i>' +
		//
		'<label class="control-label showhim" ng-show="!isEdit">{{output}}</label>' +
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
					// $("input")[0].focus();
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
						if(!(list[i] in tmpSrc)) {
							tmpSrc[list[i]] = {};
						};
						tmpSrc = tmpSrc[list[i]];
						if(list.length == i + 2) {
							copyDes = tmpDes;
						};
					};
					if(typeof(tmpSrc) == 'object' && !! tmpSrc && !tmpSrc.hasOwnProperty()) {
						// tmpSrc = undefined;
						// copyDes[list[i - 1]] = undefined;
						copyDes[list[i - 1]] = tmpSrc;
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
			var getTopScope = function() {
					var list = attrs.ngModel.split('.');
					if(list[0] in scope) {
						return scope.$parent.$parent;
					};
					var top = scope;
					while(!(top.hasOwnProperty('init'))) {
						top = top.$parent;
					};
					return top;
				};
			var refAttr = function(des, src, attr) {
					var list = attr.split('.');
					des[list[0]] = src[list[0]];
					// if (!(list[0] in des)) {
					// 	copyAttr(des, src, attr);
					// };				
				};
			var extendScope = function(des, src) {
					var exceptionList = ['$index'];
					for(var attr in src) {
						if(attr != 'this' && attr[0] != '$' && typeof(src[attr]) != 'function') {
							refAttr(des, src, attr);
						} else if(attr in exceptionList) {
							refAttr(des, src, attr);
						};
					};
				};
			var topScope = getTopScope();
			copyAttr(scope.copy, topScope, attrs.ngModel);
			copyAttr(scope.copy2, topScope, attrs.ngModel);
			extendScope(scope, topScope);
			// refAttr(scope, topScope, attrs.ngModel);
			$scope.$on('ok', function(event, args) {
				if( !! args && !! args.element && searchEle(args.element, element[0])) {
					// $scope.$apply(function(){
					// });
					copyAttr(topScope, scope, attrs.ngModel);
					copyAttr(scope.copy, scope, attrs.ngModel);
				};
			});
			$scope.$on('cancel', function(event, args) {
				if( !! args && !! args.element && searchEle(args.element, element[0])) {
					copyAttr(topScope, scope.copy, attrs.ngModel);
				};
			});
			topScope.$watch(attrs.ngModel, function(newValue, oldValue) {
				copyAttr(scope.copy, topScope, attrs.ngModel);
				copyAttr(scope, topScope, attrs.ngModel);
			});
			$scope.$watch(attrs.ngModel, function(newValue, oldValue) {
				copyAttr(topScope, scope, attrs.ngModel);
			});
			$scope.$on('restore', function(event, args) {
				copyAttr(topScope, scope.copy2, attrs.ngModel);
				copyAttr(scope.copy, scope.copy2, attrs.ngModel);
				copyAttr(scope, scope.copy2, attrs.ngModel);
			});
			$scope.$on('save', function(event, args) {
				copyAttr(scope.copy2, topScope, attrs.ngModel);
			});
			$scope.$on('revert', function(event, args) {
				if( !! args && !! args.element && searchEle(args.element, element[0])) {
					copyAttr(topScope, scope.copy2, attrs.ngModel);
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
}]).directive('ngBlur', ['$parse', function($parse) {
	return function(scope, element, attr) {
		var fn = $parse(attr['ngBlur']);
		element.bind('blur', function(event) {
			scope.$apply(function() {
				fn(scope, {
					$event: event
				});
			});
		});
	}
}]).directive('edit2', ['$compile', '$parse', function($compile, $parse) {
	return {
		restrict: 'E',
		scope: false,
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function(scope, iElement, iAttrs, controller) {
					var myScope = scope;

					var label = '<div class="controls">' + //
					'<label class="showlabel">' + //
					'{{' + iAttrs.out + '}}' + //
					'</label>' + //
					'<i class="icon-pencil" title="Edit"/>' + //
					'<i class="icon-undo" title="Undo" ng-show="' + iAttrs.undoable + '"/>'+//
					'</div>';
					var labelElem = angular.element($(label));
					$compile(labelElem)(scope);
					labelElem.find('label').click(function(elem) {
						showInput();
					});
					labelElem.find('.icon-pencil').click(function(elem) {
						showInput();
					});
					labelElem.find('.icon-undo').click(function(elem) {
						myScope.$apply(iAttrs.undo);
					});

					iElement.css({
						display: "none"
					});

					var tailHtml = '<i class="icon-trash" title="Delete"/>';
					var tailElem = angular.element($(tailHtml));
					$compile(tailElem)(scope);
					iElement.append(tailElem);
					iElement.after(labelElem);

					var clearExp = iAttrs.clear;
					tailElem.parent().find('.icon-trash').click(function(elem) {
						myScope.$apply(clearExp);
					});

					var validGetter = $parse(iAttrs.valid);

					function showInput() {
						labelElem.css({
							display: 'none'
						});
						iElement.css({
							display: 'block'
						});
						iElement.find('input').focus();
					};

					function hideInput() {
						if(validGetter(myScope)) {
							labelElem.css({
								display: 'block'
							});
							iElement.css({
								display: 'none'
							});
						};
					};

					function inside(array, target) {
						var result = false;
						for(var i = 0; i < array.length; i++) {
							if(array[i] == target) {
								result = true;
								break;
							};
							if( !! array[i].children.length) {
								result = inside(array[i].children, target);
								if(result) {
									break;
								};
							};
						};
						return result;
					};
					$(document).click(function(elem) {
						var tar = angular.element(elem.target);
						var parent = iElement;
						var result = inside(parent[0].children, tar[0]) || inside(labelElem[0].children, tar[0]);
						if(result) {
							// showInput();
						} else {
							hideInput();
						};
					});
				},
				post: function(scope, iElement, iAttrs, controller) {
					var myAttrs = iAttrs;
					var myScope = scope;

					function showInput() {
						labelElem.css({
							display: 'none'
						});
						iElement.css({
							display: 'block'
						});
						iElement.find('input').focus();
					};

					var validGetter = $parse(iAttrs.valid);
					var labelElem = iElement.parent().find('.showlabel').parent();
					if(!validGetter(scope)) {
						showInput();
					};
				}
			}
		},
		controller: function($scope, $element, $attrs, $transclude) {}
	};
}]);