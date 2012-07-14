var http = require('http'), url = require('url'), path = require('path');


function getPath(req) {
	//	get request path
    var reqType = url.parse(req.url).pathname;	//	/add OR /update
	console.log('Request with');
	console.log('req data: '+req);
	console.log('req path: '+reqType);

	return reqType;
};


//	start server with parameters request and response
var serv = http.createServer(function(req,res) {
	//	set type and allow CORS
	res.writeHead(200, {
	  "Content-Type": "application/json",
	  "Access-Control-Allow-Origin": "*"
	});
	console.log('');

	reqType = getPath(req);

	switch (reqType) {
		case "/add":
			addMsg(req);
			break;
		case "/update":
			updateMsg();
			break;
		default:
			console.log('invalid query path');
			//	404
	}


	function addMsg(newReq) {
		console.log('addMsg called');

		//	parse request data into usable format
		var entry = require('url').parse(newReq.url, true, true);	// this is necessary for some reason
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
		serv.listen('/update', function(newData) {	//	waits for any /add requests
		/*
			This is the problem area. /update requests are intended to hang around,
			not returning anything until the next /add request comes in.
			server.listen(path, callback) seems to fit this role, but the callback
			function is getting passed undefined data, which raises an error when
			getPath tries to read its url. More information is need on server.listen,
			or an alternative way to keep /update requests around.
		*/
			reqType = getPath(newData);	//	check if new request is /update or /add
			if (reqType == '/add') {
				console.log('updateMsg detects /add path');
				addMsg(newData);	//	deliver new /add request to (hopefully) all clients
			}
		});
	};
});

serv.listen(1995);