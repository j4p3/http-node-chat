var http = require('http');

var s = http.createServer(function(req,res) {
	switch (req.url) {
		case '/some/random/path':
			res.write('case somerandompath');
			break;	//	the break prevents the switch from falling through and executing everything
		case '/another/random/path':
			res.write('case anotherrandompath');
			break;
	};
	res.end();
});

s.listen(8000);