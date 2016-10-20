'use strict';

//constructor
function adminApp (){
  this.debug = false;
  this.Joi = require('joi');
  this.api  = require('./api').api;
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
          email: this.Joi.string().email(),
          password: this.Joi.string()
        }
    },
    handler: function(request, reply) {
      let password = request.payload.data.password,
             user = request.payload.data.email;
            _this.authCheck(user,password).then((u)=>{
              delete u[0].password;
              request.session.set('user', u);
              reply({status:'OK',data:'loged in'});
            }).catch((err)=>{
              reply({status:'NOK',data:err});
            })

    }
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
