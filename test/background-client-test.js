var equal = require('assert').equal,
	puts = require('util').puts,
	BackgroundClient = require('../lib/background-client').BackgroundClient;
	
exports.tests = {
	'background client should have methods copied over from client': function(finished, prefix) {
		var backgroundClient = new BackgroundClient({start: false});
		equal(typeof(backgroundClient.handleMessage), 'function', prefix + ' client not extended.');
		finished();
	},
	
	'calling send message with a background client should invoke handleMessage directly': function(finished, prefix) {
		var backgroundClient = new BackgroundClient({
			server: {
				handleMessage: function(request, sender, callback) {
					equal(sender.tab.id, 'background', prefix + ' tabId was not correct');
					equal(request.body.foo, 'bar', prefix + ' foo was not equal to bar');
					finished();
				}
			},
			start: false
		});
		backgroundClient.sendMessage({
			action: 'upload',
			body: {foo: 'bar'}
		});
	},
	
	'message interval set to default value and be able to be overridden.': function(finished, prefix) {
		var backgroundClient = new BackgroundClient({
			identifier: 'client_identifier',
			start: false,
			sendRequest: function(params, callback) {}
		});
		equal(backgroundClient.messageInterval, 150, prefix + ' default messageInterval not set');
		
		backgroundClient = new BackgroundClient({
			messageInterval: 50,
			identifier: 'client_identifier',
			start: false,
			sendRequest: function(params, callback) {}
		});
		equal(backgroundClient.messageInterval, 50, prefix + ' default messageInterval not set');
		
		finished();
	}
};