
'use strict';

const Joi = require('joi');
const Db  = require('../conf/db');
const db  = Db.dbTrackLocal();
const mDB = require('mongodb');
const sha256 = require('js-sha256');
const Conf  = require('../conf/conf').config;

//Colections
let collections = {
  data  : db.collection('data'),
  leads : db.collection('data'),
  lead  : db.collection('data'),
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
        _this.requestSession=request.yar.get('user');
        //Switch dataType and query
        switch (request.params.what) {
          case 'campaigns':
            q.query = (request.params.id)?{_id: mDB.ObjectId(request.params.id)}:{};
            q.db = 'campaigns';
            break;
          case 'users':
            q.query = (request.params.id)?(/^[0-9a-fA-F]{24}$/.test(request.params.id))?{_id: mDB.ObjectId(request.params.id)}:{email: request.params.id}:{};
            q.db = 'users';
            break;
          case 'leads':
              q.query = (request.params.id)?{campid: request.params.id}:{};
              q.db = 'data';
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
        //Encode Pass
        if(request.payload && request.payload.data && request.payload.data.password)
           request.payload.data.password=sha256(request.payload.data.password+Conf.secret);

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

          if(params.q.db=='users'){
              resultArr.forEach((ele)=>{
                delete ele.password;
              })
              resolve(resultArr);
          }else if (params.what=='leads'){
              let output = [];
              let agregate = {};
              resultArr=resultArr.filter((ele)=>{
                //create aggregate
                if(ele.leadid){
                  (agregate[''+ele.leadid])?agregate[''+ele.leadid].push(ele):agregate[''+ele.leadid]=[ele];
                  return true;
                }else {
                  return false;
                }
              }).map((ele)=>{
                //create outpute
                  (ele.history)?ele.history.push(agregate[''+ele._id]):ele.history=[''+agregate[ele._id]]
                  return ele;
              })

              resolve(resultArr);
          }else{
              resolve(resultArr);
          }
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
apiApp.prototype.delete= function(params) {
  let _this = this;
  return new Promise((resolve, reject) => {
    if(!this.checkPermission(params.credentials))
    {reject('not logedin');}else{
      collections[params.q.db].remove(params.q.query)
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
