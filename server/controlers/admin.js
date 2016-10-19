'use strict';

//constructor
function adminApp (){
  this.debug = false;
  this.Joi = require('joi');
  this.api  = require('./api');
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
          email: _this.Joi.string().email(),
          password: _this.Joi.string()
        }
    },
    handler: function(request, reply) {
      let userSession = utils.checkPermission(params),
              pasword = request.payload.password,
                 user = request.payload.email,
                _this = this;

                this.api.get({db:'users',query:{email: user, password:password}})
                .then((u)=>{
                  if(u.length==0)reply({status:'NOK',data:'invalid credentials'});
                  delete u[0].password;
                  request.session.set('user', curr);
                  reply({status:'OK',data:'loged in'});
                }).catch((err)=>{
                  reply({status:'NOK',data:err});
                })

    }
  }
}

adminApp.prototype.checkPermission = function(req){
  if(req.session=='internalRequesst'){
      return true;
  }else if(typeof req.session != 'undefined' && typeof req.session.get == 'function'){
      return  req.session.get('user');
  }else{
      return false;
  }
}

exports.admin = new adminApp();
