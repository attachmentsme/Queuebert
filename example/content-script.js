var delegate = {
	receivedMessage: function(clientId, body) {
		console.log(body.message);
	}
};
/*
var client = new Queuebert.Client({
	identifier: 'client',
	delegate: delegate
});*/
/*
setInterval(function() {
	client.sendMessage({
		action: 'receivedMessage',
		to: 'client',
		body: {message: 'Hello World!'}
	});
}, 1000);
*/