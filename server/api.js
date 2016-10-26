'use strict';
const Hapi 		= require("hapi");
const Yar 			= require("yar");
const Checks 		= require("./conf/init").systemCheck;
const routes 	= require('./routes');

const options 	= {
		server: {
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
		},
		cookie: {
			storeBlank: false,
			cookieOptions: {
					password: 'ZKJeD:R4(Zoxz66,Jz4e1,6p+0q~52o+%R7@9*C^5qa83+."lRj|t[/-Ym:mc.?',
					isSecure: false,
					ttl:1200000
			}
		}
	};
	// CHECK for system defaults Before Start
	Checks.doChecks()

	let server = Hapi.createServer(3007, options.serve);
	server.pack.register({
		maxCookieSize: 0,
		plugin: Yar,
		options: options.cookie
	}, function(err) {});

	///LOG ERRORS
	//process.on('uncaughtException', function(err) {
		//console.log('✖ Caught exception [' + new Date() + ']: ' + err);
	//});

	server.route(routes.endpoints);
	server.start();
	/// ADD THIS TO MAIN INDEX
	console.log('✓ server started succefully at http://localhost:3007/');
	module.exports = server;
