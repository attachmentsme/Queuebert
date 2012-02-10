var puts = require('util').puts,
	Client = require('./lib/client').Client,
	Server = require('./lib/server').Server;

var onRequest = {
	addListener: function(listener) {
		this.listener = listener;
	}
};

var sendRequest = function(params, callback) {
	onRequest.listener(params, {tab: {id: 1}}, callback);
}

var server = new Server({
	onRequest: onRequest
});

var delegate = {
	sayHello: function(clientId, body) {
		puts('Hello from ' + clientId + ' ' + JSON.stringify(body));
	}
}

var client = new Client({
	delegate: delegate,
	sendRequest: sendRequest,
	identifier: 'foobar'
});

client.start();

client.sendMessage({
	to: 'foobar',
	action: 'sayHello',
	body: {
		foo: 'bar'
	}
});