'use strict';

const sha256 = require('js-sha256');
const Joi = require('joi');
const api  = require('./api').api;
const Conf  = require('../conf/conf').config;

//constructor
function adminApp (){
  this.debug = false;
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


adminApp.prototype.auth = function(){
  let _this = this;
  return {

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
              request.session.set('user', u[0]);
              reply({status:'OK',data:'loged in'}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
            }).catch((err)=>{
              reply({status:'NOK',data:err}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
            })
          }
    }
  }
}

adminApp.prototype.logout = {
    handler: function(request, reply) {
      request.session.clear('user');
      reply({status:'OK',data:'user loggedout'}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
    }
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
