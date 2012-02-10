var equal = require('assert').equal,
	puts = require('util').puts,
	Client = require('../lib/client').Client;
	
exports.tests = {
	'should override default sendRequest object with one passed in': function(finished, prefix) {
		var client = new Client('client_identifier', {
			sendRequest: function(params, callback) {
				equal(true, true);
				finished();
			}
		});
		client.sendRequest(null, null);
	},
	
	'send message should invoke sendRequest with the appropriate parameters': function(finished, prefix) {
		var client = new Client('client_identifier', {
			sendRequest: function(params, callback) {
				equal(params.type, 'put', prefix + ' type was not put.');
				equal(params.identifier, 'client_identifier', prefix + ' client identifier not set');
				equal(params.body.foo, 'bar', prefix + ' foo was not equal to bar');
				finished();
			}
		});
		client.sendMessage({foo: 'bar'});
	}
}