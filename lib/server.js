if (typeof(Queuebert) === 'undefined') {
	Queuebert = {};
}

(function() {
	function Server(_params) {
		var _this = this,
			params = _params || {};
		this.messages = {};
		this.onRequest = params.onRequest || chrome.extension.onRequest;
		this.onRequest.addListener(function(request, sender, callback) {
			_this.handleMessage(request, sender, callback);
		});
	}
	
	Server.prototype.handleMessage = function(request, sender, callback) {
		var _callback = callback || function() {},
			tabId = request.tabId || this.getTabId(sender);
		
		this.registerClient(request.to, tabId);
		this.registerClient(request.from, this.getTabId(sender));
		
		if (request.type == 'put') {
			this.messages[ tabId ][request.to].push({
				from: request.from,
				action: request.action,
				body: request.body,
				tabId: this.getTabId(sender)
			});
		} else if(request.type == 'get') {
			var rawMessage = this.messages[tabId][request.from].shift();
			if (rawMessage) {
				_callback(rawMessage);
			} else {
				_callback(null);
			}
		}
	};
	
	Server.prototype.registerClient = function(identifier, tabId) {

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

