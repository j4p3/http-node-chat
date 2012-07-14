a node chatroom using http
=========================

This project is cluttered. Only two files matter. Their intended flow is described below.

clientside (chat_client.js)
------------------------
1. doc.ready - listen for client input (msgListener)
2. msgListener - format user input for JSON
3. sendMsg - make AJAX request to server at address '/add'
4. msgAppender - push server response to array, append to div


1. listen for other client input (updateChat)
2. updateChat - use AJAX long-polling / comet to keep a persistent request for updates in the server at address 'update'. When an update happens, pass it.
3. msgAppender - push server response to array, append to div


serverside (chat_server.js)
-------------------------
1. createServer - initialize node server. Divert new requests to '/add' or '/update' paths.
2. addMsg - parse the new request and pass it back the client
3. updateMsg - listen for the next '/add' requests - from self or others - and pass its value back the client