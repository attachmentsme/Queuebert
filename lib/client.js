if (typeof(Queuebert) === 'undefined') {
	Queuebert = {};
}

(function() {
	function Client(identifier, params) {
		this.identifier = identifier;
		this.sendRequest = params.sendRequest || chrome.extension.sendRequest;
	}

	Client.prototype.sendMessage = function(msg) {
		this.sendRequest({
			identifier: this.identifier,
			type: 'put',
			body: msg
		});
	}

	Queuebert.Client = Client;
})();

// Specifically for our unit tests which are written in Node.js.
if (typeof(exports) !== 'undefined') {
	exports.Client = Queuebert.Client;
}
