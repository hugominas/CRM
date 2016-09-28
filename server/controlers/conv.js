'use strict';
// GET DEFAULTS

// GET COnstructor
function trackData(){
  this.debug = true;
  this.Joi = require('joi');
  this.Db = require('../conf/db');
  this.db = this.Db.dbTrackLocal();
}

trackData.prototype.log = function(msg){
  if(this.debug)console.log(msg);
}

trackData.prototype.convRoute = function() {
  let _this = this;
  // VALIDATE ROUTE
  return {
    validate: {
        params: {
          campid: this.Joi.number().integer(),
          operation: this.Joi.string(),
          param: this.Joi.allow('')
        }
    },
    handler: function(request, reply) {
      ///HANDLE REQUEST EXTRA PARAMAS
      const requestExtraParts = (request.params.param)?request.params.param.split('/'):[];
      //IF WE HAVE POST ADD TO FIRST ARRAY
      if(request.payload)requestExtraParts.join(request.payload.data);
      //LOG
      _this.log('In conv Route - ' + JSON.stringify(request.params) + JSON.stringify(requestExtraParts))
      //SAVE DATA
      _this.convSave(request.params, requestExtraParts)

    }
  }
}

trackData.prototype.convSave=function(type, params){
  let _this = this;
   return new Promise((resolve, reject) => {
     _this.log('Ready to save to -'+ JSON.stringify(_this.db)+ ' data '+ JSON.stringify(type) + JSON.stringify(typeparams))
  });
}

exports.track = new trackData();
