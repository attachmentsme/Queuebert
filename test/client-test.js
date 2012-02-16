var equal = require('assert').equal,
	puts = require('util').puts,
	Client = require('../lib/client').Client;
	
exports.tests = {
	'should override default sendRequest object with one passed in': function(finished, prefix) {
		var client = new Client({
			identifier: 'client_identifier',
			start: false,
			sendRequest: function(params, callback) {
				equal(true, true);
				finished();
			}
		});
		client.sendRequest(null, null);
	},
	
	'send message should invoke sendRequest with the appropriate parameters': function(finished, prefix) {
		var client = new Client({
			identifier: 'client_identifier',
			start: false,
			sendRequest: function(params, callback) {
				equal(params.tabId, 'tab_2', prefix + ' tabId was not set.');
				equal(params.type, 'put', prefix + ' type was not put.');
				equal(params.to, 'client_identifier', prefix + ' client identifier not set');
				equal(params.from, 'client_identifier', prefix + ' from should be set');
				equal(params.body.foo, 'bar', prefix + ' foo was not equal to bar');
				equal(params.action, 'upload', prefix + ' upload action was not set');
				finished();
			}
		});
		client.sendMessage( {
			tabId: 'tab_2',
			to: 'client_identifier',
			action: 'upload',
			body: {
				foo: 'bar'
			}
		});
	},
	
	'client should receive messages on a set interval': function(finished, prefix) {
		var fin = false;
		
		var clientDelegate = {
			upload: function(senderId, senderTabId, body) {
				equal(senderTabId, 'tab_1', prefix +  ' senderId not set.');
				equal(senderId, 'client_identifier', prefix +  ' senderId not set.');
				equal(body.foo, 'bar', prefix + ' foo not equal to bar.');
				if (!fin) {
					fin = true;
					finished();
				}
			}
		}
		new Client({
			delegate: clientDelegate,
			identifier: 'client_identifier',
			sendRequest: function(params, callback) {
				callback({
					action: 'upload',
					from: 'client_identifier',
					tabId: 'tab_1',
					body: {foo: 'bar'}
				});
			}
		});
	},
	
	'message interval set to default value and be able to be overridden.': function(finished, prefix) {
		var client = new Client({
			identifier: 'client_identifier',
			start: false,
			sendRequest: function(params, callback) {}
		});
		equal(client.messageInterval, 150, prefix + ' default messageInterval not set');
		
		client = new Client({
			messageInterval: 50,
			identifier: 'client_identifier',
			start: false,
			sendRequest: function(params, callback) {}
		});
		equal(client.messageInterval, 50, prefix + ' default messageInterval not set');
		
		finished();
	}
}