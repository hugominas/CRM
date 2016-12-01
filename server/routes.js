'use strict';

const Conv = require('./controlers/conv').track;
const Admin = require('./controlers/admin').admin;
const API = require('./controlers/api').api;
//var Tracking = require('./controllers/tracking');

exports.endpoints = [
	//NORMAL SESSION TRACKING PIXEL SCRIPT SESSS=ALL to save all visits
	//rp = 'img' || 'iframe' || 'script' || 's2s || redirect'
	//affid = 'other' -> organic pixel
	//58138bd9eddfdf70f74aa9c5
	//http://localhost:3007/track/57ebbc827c06bdfb3408800b/save/57ebbc827c06bdfb3408800b/asdasd/asdada
	//{method: ['POST', 'GET'], 	path: '/', 	config: Track.universal},    // Info por referer
	{method: ['POST', 'GET'], 	path: '/{param*}', 			config: Admin.adminRoute},    // Info por referer
	{method: ['POST'], 					path: '/admin/auth', config: Admin.auth()},    // Info por referer
	{method: ['POST'], 					path: '/admin/logout', 	config: Admin.logout},    // Info por referer

	//admin /api/campaigns/page/items/order/id
	{method: ['GET'], 										path: '/api/{what}/{page}/{items}/{sort}/{startDate}/{endDate}/{id?}', 	config: API.CRUD()},    // Info por referer
	{method: ['POST', 'PUT', 'DELETE'], 	path: '/api/{what}/{id?}', 												config: API.CRUD()},    // Info por referer


	{method: ['POST', 'GET'], 	path: '/track/{campid}/{action}/{multi}/{param*}', 	config: Conv.convRoute()} //multi value - 57ebbc827c06bdfb3408800b or single


];
