var equal = require('assert').equal,
	puts = require('util').puts,
	BackgroundClient = require('../lib/background-client').BackgroundClient;
	
exports.tests = {
	'background client should have methods copied over from client': function(finished, prefix) {
		var backgroundClient = new BackgroundClient();
		equal(typeof(backgroundClient.handleMessage), 'function', prefix + ' client not extended.');
		finished();
	}
};