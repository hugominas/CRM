'use strict';

const Conv = require('./controlers/conv').track;
const Admin = require('./controlers/admin').admin;

//var Tracking = require('./controllers/tracking');

exports.endpoints = [
	//NORMAL SESSION TRACKING PIXEL SCRIPT SESSS=ALL to save all visits
	//rp = 'img' || 'iframe' || 'script' || 's2s || redirect'
	//affid = 'other' -> organic pixel
	//http://localhost:3007/track/57ebbc827c06bdfb3408800b/save/57ebbc827c06bdfb3408800b/asdasd/asdada
	//{method: ['POST', 'GET'], 	path: '/', 	config: Track.universal},    // Info por referer
	{method: ['POST', 'GET'], 	path: '/admin/{param*}', 	config: Admin.adminRoute},    // Info por referer

	//admin
	{method: ['POST', 'GET'], 	path: '/admin/get/{what}/{id?}', 	config: Admin.get()},    // Info por referer
	{method: ['POST', 'GET'], 	path: '/admin/set/{what}/{id?}', 	config: Admin.set()},    // Info por referer
	{method: ['POST', 'GET'], 	path: '/admin/del/{what}/{id?}', 	config: Admin.del()},    // Info por referer


	{method: ['POST', 'GET'], 	path: '/track/{campid}/{action}/{multi}/{param*}', 	config: Conv.convRoute()} //multi value - 57ebbc827c06bdfb3408800b or single
];