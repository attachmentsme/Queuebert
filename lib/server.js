if (typeof(Queuebert) === 'undefined') {
	Queuebert = {};
}

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
		this.registerClient(request, sender);
		
		if (request.type == 'put') {
			this.messages[this.getTabId(sender)][request.identifier].push(request.body);
		} else if(request.type == 'get') {
			_callback(this.messages[this.getTabId(sender)][request.identifier].shift());
		}
	};
	
	Server.prototype.registerClient = function(request, sender) {
		var tabId = this.getTabId(sender);
		if (typeof(this.messages[tabId]) == 'object' && typeof(this.messages[tabId][request.identifier]) === 'object') return;
		this.messages[tabId] = {};
		this.messages[tabId][request.identifier] = [];
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

