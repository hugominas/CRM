'use strict';
///////////////////////// CONFIG
exports.config = function (){
    let userDBTrack = 'ruth',
        passDBTrack = 'mArl3n3',
        host = 'localhost',
        dbName = 'PSAPI'
    return {
        trackDB: function(){
            return userDBTrack+':'+passDBTrack+'@'+host+'/'+dbName //"username:password@example.com/mydb"
        }
    }
}
