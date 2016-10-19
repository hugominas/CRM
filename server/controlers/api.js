
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
  this.users = this.db.collection('users');
  this.campaigns = this.db.collection('campaigns');
  this.flows = this.db.collection('flows');
  this.admin = require('./admin');
  //current Request
  this.request = {session:'internalRequesst'}
}


//method
apiApp.prototype.CRUD = function() {
  let _this = this;
  // VALIDATE ROUTE
  return {
    validate: {
        params: {
          what: this.Joi.string(),
          id: this.Joi.string()
        }
    },
    handler: function(request, reply) {
      if(_this.hasOwnProperty(request.params.what) && _this.__proto__.hasOwnProperty(request.method)){
        let q = {}
        _this.request=request;

        //Switch dataType and query
        switch (request.params.what) {
          case 'campaigns':
            q.query = (request.params.id)?{_id: _this.mDB.ObjectId(request.params.id)}:{};
            q.db = 'campaigns';
            break;
          case 'users':
            q.query = (/^[0-9a-fA-F]{24}$/.test(request.params.id))?{_id: this.mDB.ObjectId(request.params.id)}:{email: request.params.id};
            q.db = 'users';
            break;
          case 'lead':
            q.query = {leadid: request.params.id};
            q.db = 'data';
            break;
          case 'flows':
            q.query = (request.params.id)?{_id: _this.mDB.ObjectId(request.params.id)}:{};
            q.db = 'flows';
            break;
        }
        //SEND REQUEST TO CORRECT METHOD
        let objMethods = _this.__proto__;
        objMethods[request.method](q,request.params.what,request.params.id,(request.payload)?request.payload.data:'', _this)
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
apiApp.prototype.get= function(q, what, id, data, _this) {
  return new Promise((resolve, reject) => {
    if(!_this.admin.checkPermission(_this.request))reject('not logedin');
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
apiApp.prototype.post= function(q, what, id, data, _this) {
  return new Promise((resolve, reject) => {
    if(!_this.admin.checkPermission(_this.request))reject('not logedin');
    //UPDATE ENTRY
    if(id){
      _this[q.db].update(q.query,data,{ upsert: true })
      .then((resultArr)=>{
        resolve(resultArr);
      })
      .catch((err)=>{
        reject(err)
      });
    }else{
      data._id=_this.mDB.ObjectId();
      _this[q.db].insert(data)
      .then((resultArr)=>{
        resolve(resultArr);
      })
      .catch((err)=>{
        reject(err)
      });
    }

  });
}

//method SET/EDIT
apiApp.prototype.put= function(q, what, id, data, _this) {
  return new Promise((resolve, reject) => {
    if(!_this.admin.checkPermission(_this.request))reject('not logedin');
    this.post(q, what, id, data, _this).then((data)=>{
      resolve(data);
    }).catch((err)=> {
      reject(err);
    });
  })
}

//method delete
apiApp.prototype.del= function(q, what, id, data, _this) {
  return new Promise((resolve, reject) => {
    if(!_this.admin.checkPermission(_this.request))reject('not logedin');
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
