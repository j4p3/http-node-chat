/*
I am tired. the current problem: updateChat is calling at regular intervals, instead of
every 30 seconds, because it keeps triggering itself. For some reason the listen() function
is being activated by all paths, not just the specified one.

Also, if no data is being passed from update to add, add will return undefined even after
this is fixed.

Solution: maintain an array of connections. Forget /update. When /add is called, return
to all connections.
*/


var http = require('http'), url = require('url'), path = require('path'), sys = require('sys');
connections = [];

//	
function update() {
	console.log('update called');
    if (connections.length) {
        connections.forEach(function(c) {
            sys.puts(JSON.stringify(c));
            c.sendBody('oi\n');
        });
    }
    setTimeout(update, 1000);
}

//	start server with parameters request and response
var serv = http.createServer(function(req,res) {
	//	set type and allow CORS
	res.writeHead(200, {
	  "Content-Type": "application/json",
	  "Access-Control-Allow-Origin": "*"
	});
	console.log('');

/*
	//	get request path
    var reqType = path.normalize(decodeURI(url.parse(req.url).pathname));	//	/add OR /update
	console.log('createServer called with');
	console.log('req data: '+req);
	console.log('req path: '+reqType);

	switch (reqType) {
		case "/add":
			addMsg();
			break;
		case "/update":
			updateMsg();
			break;
		default:
			console.log('invalid query path');
		//	404
	}
*/


	function addMsg() {
		console.log('addMsg called');

		//	parse request data into usable format
		var entry = require('url').parse(req.url, true, true);	// this is necessary for some reason
		var userVal = entry.query.user;
		var bodyVal = entry.query.body;

		console.log('req user: '+userVal);
		console.log('req body: '+bodyVal);

		var msg = JSON.stringify({user: entry.query.user, body: entry.query.body});

		console.log('msg to be returned: '+msg);

		res.write(msg);
		res.end();
	};


	function updateMsg() {
		console.log('updateMsg called');
		serv.listen('/add', function(newData) {	//	waits for any /add requests
			console.log('updateMsg detects /add path');
			addMsg(newData);	//	deliver new /add requests to (hopefully) all clients
		});
	};
});

serv.listen(1995);