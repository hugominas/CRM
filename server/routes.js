'use strict';

const Conv = require('./controlers/conv').track;
const Admin = require('./controlers/admin').admin;

//var Tracking = require('./controllers/tracking');

exports.endpoints = [
	//NORMAL SESSION TRACKING PIXEL SCRIPT SESSS=ALL to save all visits
	//rp = 'img' || 'iframe' || 'script' || 's2s || redirect'
	//affid = 'other' -> organic pixel
	//{method: ['POST', 'GET'], 	path: '/', 	config: Track.universal},    // Info por referer
	{method: ['POST', 'GET'], 	path: '/admin/{param*}', 	config: Admin.adminRoute},    // Info por referer
	{method: ['POST', 'GET'], 	path: '/track/{campid}/{operation}/{param*}', 	config: Conv.convRoute()}
];
