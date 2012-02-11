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
}, 2000);

setInterval(function() {
	client.sendMessage({
		action: 'add',
		tabId: 'background',
		to: 'background2',
		body: {x: 5, y: 20}
	});
}, 4000);
