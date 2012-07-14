var util = require("util");
var http = require("http");
var connections=[];


function update() {
    if (connections.length) {
        connections.forEach(function(c) {
            util.puts(JSON.stringify(c));
            c.sendBody('oi\n');
        });
    }
    setTimeout(update, 1000);
}

setTimeout(update, 1000);

http.createServer(function(req, res) {
        if (req.url == '/clock') {
            req.connection.setTimeout(0);
            res.sendHeader(200, {'Content-type':'text/plain'});
            connections.push(res); 
        } else {
            res.sendHeader(404, {'Content-type':'text/plain'});
            res.sendBody('not found');
            res.finish();
        }
        }).listen(1995);
