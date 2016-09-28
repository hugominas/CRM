'use strict';
const conf = require("./conf");
const mongojs = require('mongodb-promises');

///////////////////////// LOCAL
exports.dbTrackLocal = function() {
    let databaseUrl = conf.config().trackDB();
    let collections = ['campaigns', 'users','data'];
    let db = mongojs.db(databaseUrl, collections);
    console.log(db);
    return db;
}
