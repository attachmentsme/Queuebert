var equal = require('assert').equal,
	puts = require('util').puts,
	Client = require('../lib/client').Client;
	
exports.tests = {
	'should override default sendRequest object with one passed in': function(finished, prefix) {
		var client = new Client({
			identifier: 'client_identifier',
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
			sendRequest: function(params, callback) {
				equal(params.type, 'put', prefix + ' type was not put.');
				equal(params.to, 'client_identifier', prefix + ' client identifier not set');
				equal(params.from, 'client_identifier', prefix + ' from should be set');
				equal(params.body.foo, 'bar', prefix + ' foo was not equal to bar');
				equal(params.action, 'upload', prefix + ' upload action was not set');
				finished();
			}
		});
		client.sendMessage( {
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
			upload: function(senderId, body) {
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
				callback('upload', 'client_identifier', {foo: 'bar'});
			}
		}).start();
	}
}