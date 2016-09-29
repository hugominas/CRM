'use strict';

const Conv = require('./controlers/conv').track;
const Admin = require('./controlers/admin').admin;
const Campaigns = require('./controlers/campaigns').campaigns;
const Users = require('./controlers/users').users;

//var Tracking = require('./controllers/tracking');

exports.endpoints = [
	//NORMAL SESSION TRACKING PIXEL SCRIPT SESSS=ALL to save all visits
	//rp = 'img' || 'iframe' || 'script' || 's2s || redirect'
	//affid = 'other' -> organic pixel
	//http://localhost:3007/track/57ebbc827c06bdfb3408800b/save/57ebbc827c06bdfb3408800b/asdasd/asdada
	//{method: ['POST', 'GET'], 	path: '/', 	config: Track.universal},    // Info por referer
	{method: ['POST', 'GET'], 	path: '/admin/{param*}', 	config: Admin.adminRoute},    // Info por referer

	//Users
	{method: ['POST', 'GET'], 	path: '/api/get/user/{id?}', 	config: Users.get()},    // Info por referer
	{method: ['POST', 'GET'], 	path: '/api/set/user/{id?}', 	config: Users.set()},    // Info por referer
	{method: ['POST', 'GET'], 	path: '/api/del/user/{id?}', 	config: Users.del()},    // Info por referer

	//Campaigns
	{method: ['POST', 'GET'], 	path: '/api/get/camp/{id?}', 	config: Campaigns.get()},    // Info por referer
	{method: ['POST', 'GET'], 	path: '/api/set/camp/{id?}', 	config: Campaigns.set()},    // Info por referer
	{method: ['POST', 'GET'], 	path: '/api/del/camp/{id?}', 	config: Campaigns.del()},    // Info por refere


	{method: ['POST', 'GET'], 	path: '/track/{campid}/{action}/{multi}/{param*}', 	config: Conv.convRoute()} //multi value - 57ebbc827c06bdfb3408800b or single
];
