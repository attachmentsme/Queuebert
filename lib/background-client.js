if (typeof(Queuebert) === 'undefined') {
	Queuebert = {};
}

// Specifically for our unit tests which are written in Node.js.
if (typeof(exports) !== 'undefined') {
	var puts = require('util').puts;
	Queuebert.Client = require('./client').Client;
}

(function() {
	function BackgroundClient(_params) {
		var params = _params || {};
		this.server = params.server;
		this.sendRequest = function() {
			
		};
	};
	
	for (var key in Queuebert.Client.prototype) {
		BackgroundClient.prototype[key] = Queuebert.Client.prototype[key];
	}
	
	Queuebert.BackgroundClient = BackgroundClient;
})();

// Specifically for our unit tests which are written in Node.js.
if (typeof(exports) !== 'undefined') {
	exports.BackgroundClient = Queuebert.BackgroundClient;
}
