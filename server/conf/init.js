'use strict';

function systemCheck(){
  this.Db  = require('./db');
  this.Api  = require('../controlers/api').api;
  this.Conf  = require('./conf').config;
  this.db  = this.Db.dbTrackLocal();
  this.mongojs = require('mongodb-promises');
}

systemCheck.prototype.doChecks = function (){
  return new Promise((resolve,reject)=>{

    Promise.all([
      this.checkDBConn(),
      this.chekckAdminUser()
    ]).then(value => {
      resolve(value);
    }, reason => {
      reject(reason)
    });

  })
}

///////////////////////// LOCAL
systemCheck.prototype.checkDBConn = function() {
  return new Promise((resolve, reject) => {
    switch (true) {
      case (typeof this.Db.dbTrackLocal!== 'function'):
        reject("please check db config, cannot connect", this.Conf)
        break;
      default:
        console.log('✓ database login check')
        resolve('all good');
        break;
    }
  })
}

systemCheck.prototype.chekckAdminUser = function() {
  return new Promise((resolve, reject) => {
    //request.session.set('user', {email:this.Conf.adminEmail,group:'admin'});
    let options = {email:this.Conf.adminEmail, group:'admin'}
    this.Api.get({db:'users',query:{email:this.Conf.adminEmail}}, options)
    .then((resultArr)=>{
      if(resultArr.length<1){
        console.log('✖ admin user not found')
        this.setAdminUser().then(()=>{
          resolve(resultArr);
        }).catch((err)=>{
          reject(err)
        })
      }else{
        console.log('✓ admin user found')
        resolve(resultArr);
      }
    })
    .catch((err)=>{
      reject(err)
    });

  })
}

systemCheck.prototype.setAdminUser = function() {
  return new Promise((resolve, reject) => {
    let options = [{email:this.Conf.adminEmail, group:'admin'}]
    let data = {
      name:'Administrator',
      email:this.Conf.adminEmail,
      group:'admin',
      password:this.Conf.adminPassword,
      time:Date.now()
    }
    this.Api.post({q:{db:'users'},data:data,credentials:options}).then((result)=>{
      console.log('✓ admin user inserted')
      resolve(result);
    }).catch((err)=>{
      reject(err);
    })

  })


}

exports.systemCheck = new systemCheck();
