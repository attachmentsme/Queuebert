var delegate = {
	receivedMessage: function(clientId, clientTabId, body) {
		console.log(body.message);
	}
};

var client = new Queuebert.Client({
	identifier: 'client',
	delegate: delegate
});

setInterval(function() {
	client.sendMessage({
		action: 'receivedMessage',
		tabId: 'background',
		to: 'background',
		body: {message: 'Content Script: Hello World!'}
	});
}, 1000);
