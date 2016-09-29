'use strict';

//constructor
function campaignsApp (){
  this.debug = false;
  this.Joi = require('joi');
  this.Db  = require('../conf/db');
  this.getVisit  = require('./track').getVisitData;
  this.db  = this.Db.dbTrackLocal();
  this.mDB = require('mongodb');
  this.data = this.db.collection('data');
}



//method
campaignsApp.prototype.get= function() {
  let _this = this;
  // VALIDATE ROUTE
  return {
    validate: {
        params: {
          campid: this.Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        }
    },
    handler: function(request, reply) {
      _this.data.find({campid: request.params.campid}).then((resultArr)=>{
        reply(resultArr);
      })
    }
  }
}

//method
campaignsApp.prototype.set = function() {
  let _this = this;
  // VALIDATE ROUTE
  return {
    validate: {
        params: {
          campid: this.Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        }
    },
    handler: function(request, reply) {
      _this.data.find({campid: request.params.campid}).then((resultArr)=>{
        reply(resultArr);
      })
    }
  }
}

//method
campaignsApp.prototype.del= function() {
  let _this = this;
  // VALIDATE ROUTE
  return {
    validate: {
        params: {
          campid: this.Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        }
    },
    handler: function(request, reply) {
      _this.data.find({campid: request.params.campid}).then((resultArr)=>{
        reply(resultArr);
      })
    }
  }
}


exports.campaigns = new campaignsApp();
