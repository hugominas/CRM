'use strict';
const Hapi 			= require("hapi");
const Yar 			= require("yar");
const Checks 		= require("./conf/init").systemCheck;
const Conf 			= require("./conf/conf").config;
const routes 		= require('./routes');
const Inert			= require('inert');
const UCheck			= require('./controlers/admin').admin;
const corsHeaders = require('hapi-cors-headers')

const options 	= {
		server: {
				cors: {
					origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
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
	// Create a server with a host and port
	const server = new Hapi.Server();

	server.connection({
	    host: 'localhost',
	    port: 3007
	});


	const cache = server.cache({ segment: 'countries', expiresIn: 60 * 60 * 1000 });

	server.register([
		Inert,
		{
			maxCookieSize: 0,
			register: Yar,
			options: options.cookie
		}], function(err) {});


	// bring your own validation function
	var validate = function (decoded, request, callback) {
			//IF we have sesion don't check user
			if(request.yar.get('user')){
				return callback(null, true);
			}else{
				UCheck.validateUser(decoded.id).then((u) =>{
					console.log('in',u)
					return callback(null, true);
				}).catch((err)=>{
					console.log('out',err)
					return callback(null, false);
				})
			}
	};

	// include our module here ↓↓
server.register(require('hapi-auth-jwt2'), function (err) {

		if(err){
			console.log(err);
		}

		server.auth.strategy('jwt', 'jwt',
			{ key: Conf.tokenSecret,          // Never Share your secret key
				validateFunc: validate,            // validate function defined above
				verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
		});

		server.auth.default('jwt');

		server.route(routes.endpoints);

})

	server.ext('onPreResponse', corsHeaders)


	///LOG ERRORS
	//process.on('uncaughtException', function(err) {
		//console.log('✖ Caught exception [' + new Date() + ']: ' + err);
	//});

	server.start();
	/// ADD THIS TO MAIN INDEX
	console.log('✓ server started succefully at http://localhost:3007/');
	module.exports = server;
