var http = require('http'), url = require('url'),
	path = require('path'), message = require('querystring');
var chatLog = [];


function addChat(req, res, mid, userVal, bodyVal) {
	console.log('request parameters:');
	console.log('message ID: '+mid+ ' -- ' + userVal+': '+bodyVal);

	//	pass new chat message values into master chat array
	var newLen = chatlog.length + 1;
	var transmission = {"length": newLen, "user": userVal, "body": bodyVal};
	chatLog.push(transmission);
	console.log("new chatlength: "+newLen);

	//	return entire chatlog - it's going to be sliced on the client side anyway
	var returnJSON;
	returnJSON = JSON.stringify(chatLog);

	console.log('returning chat array');

	return returnJSON;
	res.write(returnJSON);
	res.end();
};


function updateChat(req, res) {
	console.log('updateChat called');

};


//	start server with parameters request and response
var s = http.createServer(function(req,res) {
	console.log('');

	//	set type and allow CORS
	res.writeHead(200, {
	  "Content-Type": "application/json",
	  "Access-Control-Allow-Origin": "*"
	});

	//	determine intention (add or update)
    var reqType = path.normalize(decodeURI(url.parse(req.url).pathname));
	console.log('createServer called with req path:');
	console.log(reqType);

	switch (reqType) {
		case "/add":
			//	parse new chat message and assign values to variables
			//	transmission will serve as the individual JSON object to be concatenated to the main array of objects
			var entry = require('url').parse(req.url, true, true);
			var mid = entry.query.mid;
			var userVal = entry.query.user;
			var bodyVal = entry.query.body;

			addChat(req, res, mid, userVal, bodyVal);
			break;
		case "/update":
			updateChat(req, res);
			break;
		default:
		//	404
	}
});

s.listen(1995);



//	BABY STEPS
//	1XXX 	PASS STRINGIFIED JSON 
//	2XXX 	PASS MULTIPLE LINES OF STRINGIFIED JSON
//	3XXX	PARSE MULTIPLE LINES OF STRINGIFIED JSON INTO ARRAY (CLIENT SIDE) - why? because this keeps track of the user's place in the chat. duh.
//	4XXX	PUSH NEW ENTRY INTO SERVER-SIDE ARRAY, UPDATE SERVER-SIDE ARRAY LENGTH
//	5XXX	SEND MESSAGE (FROM CLIENT), GET MESSAGE BACK
//	6NOPE	SEND MESSAGE AND CHAT ARRAY LENGTH (FROM CLIENT), GET LAST L0 - L1 MESSAGES BACK
//			(this is difficult because it necessitates separate sessions)
//	7	CREATE SEPARATE SESSIONS. SESSION COOKIES CONTAIN USERNAMES. USERNAMES APPENDED TO REQUEST JSON
//	final tweaks
//	7XXX	take input from textbox
//	8XXX	display list in bounded box
//	9XXX	ping update function at interval
//	10XXX	figure out ajax necessary to update chat without refresh
//	x 	update chat without sending undefined object to server (separate methods, yo)

//	lookup: XXXhowto pass vars in getJSON
//			XXXhowto properly store 2xlen object
//			XXXhowto extract property of object... this ain't rails

	//	detect POST input and add data to message accordingly
	/*
    if (req.method == 'POST') {
    	console.log('POST detected');
        var inputData = '';
        //	drop input into a single variable
        req.on('data', function (newText) {
            inputData += newText;
            if (inputData.length > 1e6) {
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                req.connection.destroy();
            }
        });
        //	add input variable to new, parsed variable? (why? just parse it?)
        //	also need to extract the clientside array length, and only return new messages
        req.on('end', function () {
            var POST = message.parse(inputData);
            // use POST
            console.log('POST variable value:');
            console.log(POST);
        });
    }
    */
