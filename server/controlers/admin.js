'use strict';

const sha256 = require('js-sha256');
const Joi = require('joi');
const api  = require('./api').api;
const Conf  = require('../conf/conf').config;
const jwt = require('jsonwebtoken');
const mDB = require('mongodb');

//constructor
function adminApp (){
  this.debug = false;
}

//method
adminApp.prototype.adminRoute = {
    auth: false ,
    handler: {
     directory: {
       path: '../admin/dist',
       listing: true
     }
   }
}


adminApp.prototype.auth = function(){
  let _this = this;
  return {
    auth: false ,

    validate: {
        params: {
          data:{
            email: Joi.string().email(),
            password: Joi.string()
          }
        }
    },

    handler: function(request, reply) {
      if(!request.payload.data){reply({status:'NOK',data:'no data'}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");}
      else{
      let password = request.payload.data.password,
              user = request.payload.data.email;
            _this.authCheck(user,sha256(password+Conf.secret)).then((u)=>{
              delete u[0].password;
              request.yar.set('user', u[0]);
              let token = _this.getToken(u[0]._id);
              reply({status:'OK',token: token, data:'loged in'}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
            }).catch((err)=>{
              reply({status:'NOK',data:err}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
            })
          }
    }
  }
}

adminApp.prototype.logout = {
    auth: 'jwt',
    handler: function(request, reply) {
      request.yar.clear('user');
      reply({status:'OK',data:'user loggedout'}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
    }
}


adminApp.prototype.getToken = function (id) {
  let secretKey = Conf.tokenSecret;

  return jwt.sign({
    id: id
  }, secretKey, {expiresIn: '18h'});
}

adminApp.prototype.validateUser = function (id) {
  return new Promise((resolve, reject) => {
    let Db = require('../conf/db').dbTrackLocal();
    Db.collection('users').find({_id: mDB.ObjectId(id)})
     .then((u)=>{
       if(u.length==0){
         reject(u);
       }else{
         resolve(u);
       }
     }).catch((err)=>{
       reject(err);
     })
   })

}

adminApp.prototype.authCheck = function(user,password){
  return new Promise((resolve, reject) => {
    let Db = require('../conf/db').dbTrackLocal();
    Db.collection('users').find({email: user, password:password})
     .then((u)=>{
       if(u.length==0){
         reject('invalid credentials');
       }else{
         resolve(u);
       }
     }).catch((err)=>{
       reject(err);
     })
  })
}


exports.admin = new adminApp();
