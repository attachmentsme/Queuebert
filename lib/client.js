if (typeof(Queuebert) === 'undefined') {
	Queuebert = {};
}

(function() {
	function Client(params) {
		this.sendRequest = params.sendRequest || chrome.extension.sendRequest;
	}

	Queuebert.Client = Client;
})();

// Specifically for our unit tests which are written in Node.js.
if (typeof(exports) !== 'undefined') {
	exports.Client = Queuebert.Client;
}
