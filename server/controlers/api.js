
'use strict';

//constructor
function apiApp (){
  this.debug = false;
  this.Joi = require('joi');
  this.Db  = require('../conf/db');
  this.db  = this.Db.dbTrackLocal();
  this.mDB = require('mongodb');
  //Colections
  this.data = this.lead = this.db.collection('data');
  this.users = this.db.collection('user');
  this.campaigns = this.db.collection('campaigns');
  this.flows = this.db.collection('flows');
}


//method
apiApp.prototype.CRUD = function() {
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
        let q = {}

        //Switch dataType and query
        switch (request.params.what) {
          case 'campaign':
            q.query = {campid: request.params.id}
            q.db = 'data';
            break;
          case 'user':
            q.query = {_id: request.params.id}
            q.db = 'users';
            break;
          case 'lead':
            q.query = {leadid: request.params.id};
            q.db = 'data';
            break;
          case 'flows':
            q.query = {id: request.params.id};
            q.db = 'flows';
            break;
        }
        //SEND REQUEST TO CORRECT METHOD
        _this[request.method](q,request.params.what,request.params.id)
        .then((response)=>{
          reply({status:'OK',data:response}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
        }).catch((err)=>{
          reply({status:'NOK',data:err}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
        });

      }else{
        reply({status:'NOK',data:'not valid request'}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
      }
    }
  }
}

//method GET
apiApp.prototype.get= function(q, what, id) {
  let _this = this;
  return new Promise((resolve, reject) => {
    _this[q.db].find(q.query)
    .then((resultArr)=>{
      resolve(resultArr);
    })
    .catch((err)=>{
      reject(err)
    });
  });
}

//method SET/EDIT
apiApp.prototype.put= function(query, what, id) {
  let _this = this;
  return new Promise((resolve, reject) => {
    _this[q.db].find(q.query)
    .then((resultArr)=>{
      resolve(resultArr);
    })
    .catch((err)=>{
      reject(err)
    });
  });
}

//method delete
apiApp.prototype.del= function(query, what, id) {
  let _this = this;
  return new Promise((resolve, reject) => {
    _this[q.db].find(q.query)
    .then((resultArr)=>{
      resolve(resultArr);
    })
    .catch((err)=>{
      reject(err)
    });
  });
}

exports.api = new apiApp();
