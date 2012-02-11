Queuebert
=========

The Chrome extension paradigm is sandboxed. iframes and browser-tabs cannot directly communicate with each other. They must use a background script to mediate communication between them.

In a prior post, I advocate using a queue-based approach to deal with this annoyance:

https://github.com/bcoe/DoloresLabsTechTalk

Queuebert is a library designed to simplify building Chrome extensions using a queue-based approach.

Server
------

* You create one instance of a server in the background.html.
* The server handles queuing up messages for the content scripts.

```javascript
var server = new Queuebert.Server();
```

Client
------

You create a client within your content scripts. The client is used to communicate between the sandboxed JavaScript environments.

* The client is used to dispatch messages to other tabs, iframes, and to the background script.
* The client has a delegate registered with it. The delegate receives messages from other clients in the system.

```javascript
var client = new Queuebert.Client({
	identifier: 'client',
	delegate: delegate
});
```
* _identifier_ a tab with multiple iframes within it can potentially run multiple clients. The _identifier_ is used to differentiate these clients.
* _delegate_ The client automatically checks for inbound messages on a set interval. Messages are automatically dispatched to the delegate.

*Example Delegate*

```javascript
var delegate = {
	receivedMessage: function(clientId, clientTabId, body) {
		console.log(body.message);
	}
};
```

The _receivedMessage_ message method will be executed if the following message was dispatched by another client:

```javascript
client.sendMessage({
	action: 'receivedMessage',
	tabId: clientTabId,
	to: 'client',
	body: {message: 'a message'}
});
```

The _clientId_ and _clientTabId_ variables can be used to dispatch a message back to the originating client. The _body_ is the body of the message dispatched by the originating client.

BackgroundClient
----------------

To keep the queue-based paradigm consistent, you can create an instance of a _BackgroundClient_ in your _background.html_.

The behaviour of a background client is identical to clients in content scripts except, seeing as the background script has no _tab.id_, background clients have the special _tab.id_ _background_.

*Creating a BackgroundClient*

```javascript
var client = new Queuebert.BackgroundClient({
	delegate: delegate,
	server: server
});
```

* _delegate_ this is identical to the delegates discussed previously.
* _server_ a BackgroundClient requires that the _Server_ instance be provided as a dependency.

*Sending a Message to a BackgroundClient*

```javascript
client.sendMessage({
	action: 'echo',
	tabId: 'background',
	to: 'background',
	body: {message: 'Hello World!'}
});
```

The Example
-----------

In the _/example_ folder, there are examples of each of the concepts discussed.

The _Queuebert_ project is a fully functional Chrome Extension. Install it, to see things in action.

Testing
-------

Queuebert uses node.js for unit testing. run _node test/index.js_ to execute the test suite.

Copyright
---------

Copyright (c) 2011 Attachments.me. See LICENSE.txt for further details.