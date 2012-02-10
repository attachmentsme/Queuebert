if (typeof(Queuebert) === 'undefined') {
	Queuebert = {};
}

var puts = require('util').puts;

(function() {
	function Server(params) {
		var _this = this;
		this.messages = {};
		this.onRequest = params.onRequest || chrome.extension.onRequest;
		this.onRequest.addListener(function(request, sender, callback) {
			_this.handleMessage(request, sender, callback);
		});
	}
	
	Server.prototype.handleMessage = function(request, sender, callback) {
		var _callback = callback || function() {};
		this.registerClient(request.to, sender);
		this.registerClient(request.from, sender);
		
		if (request.type == 'put') {
			this.messages[this.getTabId(sender)][request.to].push({
				from: request.from,
				body: request.body
			});
		} else if(request.type == 'get') {
			var rawMessage = this.messages[this.getTabId(sender)][request.from].shift();
			if (rawMessage) {
				_callback(rawMessage.from, rawMessage.body);
			} else {
				_callback(null, null);
			}
		}
	};
	
	Server.prototype.registerClient = function(identifier, sender) {
		var tabId = this.getTabId(sender);
		
		if (typeof(this.messages[tabId]) !== 'object') {
			this.messages[tabId] = {};
		}
		
		if (typeof(this.messages[tabId][identifier]) === 'object') return;
		this.messages[tabId][identifier] = [];
	};
	
	Server.prototype.getTabId = function(sender) {
		return 'tab_' + sender.tab.id;
	};
	
	Queuebert.Server = Server;
})();

// Specifically for our unit tests which are written in Node.js.
if (typeof(exports) !== 'undefined') {
	exports.Server = Queuebert.Server;
}

