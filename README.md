Queuebert
=========

In the chrome extension paradigm, iframes and tabs cannot not communicate directly.

In a prior post, I advocate using a queue-based approach to deal with this annoyance:

https://github.com/bcoe/DoloresLabsTechTalk

Queuebert is a library designed to simplify building Chrome extensions using a queue-based approach.

Server
------

You create an instance of a server in the background.html. The server handles queuing up messages for the content scripts.

```javascript
var server = new Queuebert.Server();
```

Client
------

You create a client within a content script:

* The client is used to dispatch messages to other tabs, iframes, and to the background script.
* The client has a delegate registered with it. The delegate receives messages from other clients in the system.

```javascript
var client = new Queuebert.Client({
	identifier: 'client',
	delegate: delegate
});
```

*The Identifier*

A tab with multiple iframes within it can potentially run multiple clients. The _identifier_ is used to differentiate these clients.

*The Delegate*

The client automatically checks for new messages on a set interval. Messages are automatically dispatched to the delegate. Take this delegate:

```javascript
var delegate = {
	receivedMessage: function(clientId, clientTabId, body) {
		console.log(body.message);
	}
};
```

The received message method will be executed if the following message is received:

```javascript
client.sendMessage({
	action: 'receivedMessage',
	tabId: clientTabId,
	to: 'client',
	body: {message: 'a message'}
});
```

The _clientId_ and _clientTabId_ variables can be used to dispatch a message back to the originating client. The _body_ is the body of the message dispatched by the originating client.