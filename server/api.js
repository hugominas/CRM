'use strict';
const Hapi = require("hapi");
const Yar = require("yar");
const routes = require('./routes');

let options = {
	cors: {
		origin: ['*'],
		credentials: true
	},
    state : {
        cookies: {
            parse: true,
            failAction: 'ignore'
        }
    }
};
// Create a server with a host and port
let server = Hapi.createServer(3006, options);
let options1 = {
	cookieOptions: {
		password: 'm4rl3n3',
		isSecure: false,
		path: '/'
	}
};
///LOG ERRORS
process.on('uncaughtException', function(err) {
	console.log('Caught exception[' + new Date() + ']: ' + err);
});

server.pack.register({
	maxCookieSize: 0,
	plugin: Yar,
	options: options1
}, function(err) {});

/// ADD THIS TO MAIN INDEX
server.route(routes.endpoints);
server.start();
console.log("tracking running http://localhost:3006/");
