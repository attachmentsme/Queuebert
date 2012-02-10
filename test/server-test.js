var equal = require('assert').equal,
	puts = require('util').puts,
	Server = require('../lib/server').Server;
	
exports.tests = {
	'should override default onRequest object with one passed in': function(finished, prefix) {
		var server = new Server({
			onRequest: {
				addListener: function(fn) {
					equal(true, true);
					finished();
				}
			}
		});
	},
	
	'the first time a client sends a message, we should create a message queue for that client': function(finished, prefix) {
		var server = new Server({
			onRequest: {
				addListener: function(fn) {
					fn({to: 'client_identifier'}, {tab: { id: 1 } });
				}
			}
		});
		equal(typeof(server.messages['tab_1']['client_identifier']), 'object', prefix + ' no queue object existed for client');
		finished();
	},
	
	'two different client ids should not cause messages queue to reset': function(finished, prefix) {
		var server = new Server({
			onRequest: {
				addListener: function(fn) {
					fn({to: 'to_identifier', from: 'from_identifier'}, {tab: { id: 1 } });
				}
			}
		});
		equal(typeof(server.messages['tab_1']['to_identifier']), 'object', prefix + ' messages queue was reset.');
		finished();
	},
	
	'should not reset client message queue each time a client provides a message': function(finished, prefix) {
		var server = new Server({
			onRequest: {
				addListener: function(fn) {
					fn({to: 'client_identifier', type: 'put'}, {tab: { id: 1 } });
				}
			}
		});
		
		server.handleMessage({to: 'client_identifier', type: 'put'}, {tab: { id: 1 } });
		equal(server.messages['tab_1']['client_identifier'].length, 2, prefix + ' messages should have two messages in it');
		finished();
	},
	
	'handleMessage should push a message on to a client queue': function(finished, prefix) {
		var server = new Server({
			onRequest: {
				addListener: function(fn) {}
			}
		});
		server.handleMessage({to: 'recipient_identifier', body: {foo: 'bar'}, type: 'put'}, {tab: {id: 1}});
		equal(server.messages['tab_1']['recipient_identifier'][0].body.foo, 'bar', prefix + ' foo was not equal to bar.');
		finished();
	},
	
	'get message should grab a message for a client based on identifier and tab.id': function(finished, prefix) {
		var server = new Server({
			onRequest: {
				addListener: function(fn) {}
			}
		});
		server.handleMessage({to: 'recipient_identifier', body: {foo: 'bar'}, type: 'put', from: 'sender_identifier'}, {tab: {id: 1}});
		server.handleMessage({from: 'recipient_identifier', type: 'get'}, {tab: {id: 1}}, function(rawMessage) {
			equal(rawMessage.from, 'sender_identifier', prefix + ' recipient id not correct.');
			equal(rawMessage.body.foo, 'bar', prefix + ' foo was not equal to bar.');
			finished();
		});
	},
	
	'get message should not explode if there are zero messages in the queue': function(finished, prefix) {
		var server = new Server({
			onRequest: {
				addListener: function(fn) {}
			}
		});
		server.handleMessage({to: 'recipient_identifier', type: 'get'}, {tab: {id: 1}}, function(rawMessage) {
			equal(null, rawMessage, prefix + ' body should be null.');
			finished();
		});	
		finished();
	}
};