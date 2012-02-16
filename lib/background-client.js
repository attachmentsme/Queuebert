if (typeof(Queuebert) === 'undefined') {
	Queuebert = {};
}

// Specifically for our unit tests which are written in Node.js.
if (typeof(exports) !== 'undefined') {
	Queuebert.Client = require('./client').Client;
}

(function() {
	function BackgroundClient(_params) {
		var params = _params || {},
			_this = this;
		
		this.delegate = params.delegate || {};
		this.identifier = params.identifier || 'background';
		this.server = params.server;
		this.messageInterval = params.messageInterval || 150;

		this.sendRequest = function(request, callback) {
			if (request.type == 'get') {
				request.tabId = 'background';
			}
			_this.server.handleMessage(request, {tab: {id: 'background'}}, callback);
		};
		
		if (params.start === undefined || params.start) {
			this.start();
		}
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
