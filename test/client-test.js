var equal = require('assert').equal,
	puts = require('util').puts,
	Client = require('../lib/client').Client;
	
exports.tests = {
	'should override default sendRequest object with one passed in': function(finished, prefix) {
		var client = new Client({
			sendRequest: function(params, callback) {
				equal(true, true);
				finished();
			}
		});
		client.sendRequest(null, null);
	}
}