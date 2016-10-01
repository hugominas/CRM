'use strict';
const conf = require("./conf").config;
const mongojs = require('mongodb-promises');

///////////////////////// LOCAL
exports.dbTrackLocal = function() {

    let databaseUrl =  conf.userDBTrack+':'+conf.passDBTrack+'@'+conf.host;
    //let collections = ['campaigns', 'users','data'];
    let db = mongojs.db(databaseUrl,'PSAPI');
    return db;
}
