if (typeof(Queuebert) === 'undefined') {
	Queuebert = {};
}

(function() {
	function Client(_params) {
		var params = _params || {};
		this.delegate = params.delegate || {};
		this.identifier = params.identifier;
		this.messageInterval = params.messageInterval || 150;
		this.sendRequest = params.sendRequest || chrome.extension.sendRequest;

		if (params.start === undefined || params.start) {
			this.start();
		}
	}
	
	Client.prototype.start = function() {
		var _this = this;

		setInterval(function() {
			_this.sendRequest({from: _this.identifier, type: 'get'}, function(rawMessage) {
				if (rawMessage) {
					_this.handleMessage(rawMessage.action, rawMessage.from, rawMessage.tabId, rawMessage.body);
				}
			}); 
		}, this.messageInterval);
	}
	
	Client.prototype.handleMessage = function(action, clientId, clientTabId, body) {
		if (this.delegate[action]) {
			this.delegate[action](clientId, clientTabId, body);
		}
	};

	Client.prototype.sendMessage = function(msg) {
		
		this.sendRequest({
			tabId: msg.tabId,
			to: msg.to,
			from: this.identifier,
			action: msg.action,
			type: 'put',
			body: msg.body
		});
	};

	Queuebert.Client = Client;
})();

// Specifically for our unit tests which are written in Node.js.
if (typeof(exports) !== 'undefined') {
	exports.Client = Queuebert.Client;
}
