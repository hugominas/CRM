
'use strict';

let Joi = require('joi');
let Db  = require('../conf/db');
let db  = Db.dbTrackLocal();
let mDB = require('mongodb');

//Colections
let collections = {
  data :db.collection('data'),
  data : db.collection('data'),
  users : db.collection('users'),
  campaigns : db.collection('campaigns'),
  flows : db.collection('flows')
}


//constructor
function apiApp (){
  this.debug = false;
  //current Request
  this.requestSession = {}
}


//method
apiApp.prototype.CRUD = function() {
  let _this = this;
  // VALIDATE ROUTE
  return {
    validate: {
        params: {
          what: Joi.string(),
          id: Joi.string()
        }
    },
    handler: function(request, reply) {
      if(collections.hasOwnProperty(request.params.what) && _this.__proto__.hasOwnProperty(request.method)){
        let q = {}
        _this.requestSession=request.session.get('user');
        //Switch dataType and query
        switch (request.params.what) {
          case 'campaigns':
            q.query = (request.params.id)?{_id: mDB.ObjectId(request.params.id)}:{};
            q.db = 'campaigns';
            break;
          case 'users':
            q.query = (/^[0-9a-fA-F]{24}$/.test(request.params.id))?{_id: mDB.ObjectId(request.params.id)}:{email: request.params.id};
            q.db = 'users';
            break;
          case 'lead':
            q.query = {leadid: request.params.id};
            q.db = 'data';
            break;
          case 'flows':
            q.query = (request.params.id)?{_id: mDB.ObjectId(request.params.id)}:{};
            q.db = 'flows';
            break;
        }
        //SEND REQUEST TO CORRECT METHOD
        let objMethods = _this.__proto__;
        let params = {
          q:q,
          what:request.params.what,
          id:request.params.id,
          data:(request.payload)?request.payload.data:'',
          credentials:_this.requestSession
        }
        objMethods[request.method](params)
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
apiApp.prototype.get= function(params) {
  let _this = this;
  return new Promise((resolve, reject) => {
      if(!this.checkPermission(params.credentials)){
        reject('not logedin');
      }else{
        collections[params.q.db].find(params.q.query)
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
apiApp.prototype.post= function(params) {
  let _this = this;
  return new Promise((resolve, reject) => {
    if(!this.checkPermission(params.credentials))
    {reject('not logedin');}else{
      //UPDATE ENTRY
      if(params.id){
        collections[params.q.db].update(params.q.query,params.data,{ upsert: true })
        .then((resultArr)=>{
          resolve(resultArr);
        })
        .catch((err)=>{
          reject(err)
        });
      }else{
        params.data._id=mDB.ObjectId();
        collections[params.q.db].insert(params.data)
        .then((resultArr)=>{
          resolve(resultArr);
        })
        .catch((err)=>{
          reject(err)
        });
      }
    }
  });
}

//method SET/EDIT
apiApp.prototype.put= function(params) {
  let _this = this;
  return new Promise((resolve, reject) => {
      this.post(params).then((data)=>{
        resolve(data);
      }).catch((err)=> {
        reject(err);
      });
  })
}

//method delete
apiApp.prototype.del= function(params) {
  let _this = this;
  return new Promise((resolve, reject) => {
    if(!this.checkPermission(params.requestSession))
    {reject('not logedin');}else{
      collections[params.q.db].find(params.q.query)
      .then((resultArr)=>{
        resolve(resultArr);
      })
      .catch((err)=>{
        reject(err)
      });
    }
  });
}

apiApp.prototype.checkPermission = function(session){
  if(typeof session != 'undefined'){
      return  (session.group=='admin' || session[0].group=='admin')?true:false;
  }else{
      return false;
  }
}

exports.api = new apiApp();
