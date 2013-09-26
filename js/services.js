'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
value('version', '0.1').service('RandomService', function() {
	return {
		string: function() {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			for(var i = 0; i < 5; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
			return text;
		}
	};
});