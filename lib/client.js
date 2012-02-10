if (typeof(Queuebert) === 'undefined') {
	Queuebert = {};
}

(function() {
	function Client(params) {
		this.identifier = params.identifier;
		this.sendRequest = params.sendRequest || chrome.extension.sendRequest;
	}

	Client.prototype.sendMessage = function(msg) {
		
		this.sendRequest({
			to: msg.to,
			from: this.identifier,
			action: msg.action,
			type: 'put',
			body: msg.body
		});
	}

	Queuebert.Client = Client;
})();

// Specifically for our unit tests which are written in Node.js.
if (typeof(exports) !== 'undefined') {
	exports.Client = Queuebert.Client;
}
