'use strict';

//constructor
function adminApp (){
  this.debug = false;
  this.Joi = require('joi');
  this.Db  = require('../conf/db');
  this.getVisit  = require('./track').getVisitData;
  this.db  = this.Db.dbTrackLocal();
  this.mDB = require('mongodb');
  this.data = this.lead = this.db.collection('data');
  this.users = this.db.collection('user');
  this.campaigns = this.db.collection('campaigns');
}

//method
adminApp.prototype.adminRoute = {
    handler: {
     directory: {
       path: '../admin/dist',
       listing: true
     }
   }
}

//method
adminApp.prototype.getLeads= function() {
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
adminApp.prototype.get= function() {
  let _this = this;
  // VALIDATE ROUTE
  return {
    validate: {
        params: {
          what: this.Joi.string(),
          id: this.Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        }
    },
    handler: function(request, reply) {
      if(_this.hasOwnProperty(request.params.what)){
        let query = {}
        let db = 'data';

        switch (request.params.what) {
          case 'campaign':
            query = {campid: request.params.id}
            db = 'campaigns';
            break;
          case 'user':
            query = {_id: request.params.id}
            db = 'users';
            break;
          case 'lead':
            query = {leadid: request.params.id};
            db = 'data';
            break;
        }

        _this[request.params.what].find(query)
        .then((resultArr)=>{
          reply(resultArr);
        })
      }else{
        reply({status:'NOK',messages:'not valid request'});}
      }
    }
  }


//method
adminApp.prototype.set = function() {
  let _this = this;
  // VALIDATE ROUTE
  return {
    validate: {
        params: {
          what: this.Joi.string(),
          id: this.Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        }
    },
    handler: function(request, reply) {
      if(_this.hasOwnProperty(request.params.what)){
        let query = {}
        let db = 'data';

        switch (request.params.what) {
          case 'campaign':
            query = {campid: request.params.id}
            db = 'campaigns';
            break;
          case 'user':
            query = {_id: request.params.id}
            db = 'users';
            break;
          case 'lead':
            query = {leadid: request.params.id};
            db = 'data';
            break;
        }

        _this[request.params.what].find(query)
        .then((resultArr)=>{
          reply(resultArr);
        })
      }else{
        reply({status:'NOK',messages:'not valid request'});}
      }
    }
  }


//method
adminApp.prototype.del= function() {
  let _this = this;
  // VALIDATE ROUTE
  return {
    validate: {
        params: {
          what: this.Joi.string(),
          id: this.Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        }
    },
    handler: function(request, reply) {
      if(_this.hasOwnProperty(request.params.what)){
        let query = {}
        let db = 'data';

        switch (request.params.what) {
          case 'campaign':
            query = {campid: request.params.id}
            db = 'campaigns';
            break;
          case 'user':
            query = {_id: request.params.id}
            db = 'users';
            break;
          case 'lead':
            query = {leadid: request.params.id};
            db = 'data';
            break;
        }

        _this[request.params.what].find(query)
        .then((resultArr)=>{
          reply(resultArr);
        })
      }else{
        reply({status:'NOK',messages:'not valid request'});}
      }
    }
  }



exports.admin = new adminApp();
