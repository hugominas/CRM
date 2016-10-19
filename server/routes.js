'use strict';

const Conv = require('./controlers/conv').track;
const Admin = require('./controlers/admin').admin;
const API = require('./controlers/api').api;

//var Tracking = require('./controllers/tracking');

exports.endpoints = [
	//NORMAL SESSION TRACKING PIXEL SCRIPT SESSS=ALL to save all visits
	//rp = 'img' || 'iframe' || 'script' || 's2s || redirect'
	//affid = 'other' -> organic pixel
	//http://localhost:3007/track/57ebbc827c06bdfb3408800b/save/57ebbc827c06bdfb3408800b/asdasd/asdada
	//{method: ['POST', 'GET'], 	path: '/', 	config: Track.universal},    // Info por referer
	{method: ['POST', 'GET'], 	path: '/admin/{param*}', 	config: Admin.adminRoute},    // Info por referer
	{method: ['POST'], 					path: '/admin/auth', 			config: Admin.auth()},    // Info por referer

	//admin
	{method: ['POST', 'GET', 'PUT', 'DEL'], 	path: '/api/{what}/{id?}', 	config: API.CRUD()},    // Info por referer


	{method: ['POST', 'GET'], 	path: '/track/{campid}/{action}/{multi}/{param*}', 	config: Conv.convRoute()} //multi value - 57ebbc827c06bdfb3408800b or single
];
