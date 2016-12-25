'use strict';
const sha256 = require('js-sha256');
const Db  = require('./db');
const Api  = require('../controlers/api').api;
const Conf  = require('./conf').config;
const db  = Db.dbTrackLocal();
const mongojs = require('mongodb-promises');
function systemCheck(){

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
      case (typeof Db.dbTrackLocal!== 'function'):
        reject("please check db config, cannot connect", Conf)
        break;
      default:
        console.log('✓ database access check')
        resolve('all good');
        break;
    }
  })
}

systemCheck.prototype.chekckAdminUser = function() {
  return new Promise((resolve, reject) => {
    //request.yar.set('user', {email:Conf.adminEmail,group:'admin'});
    let options = {email:Conf.adminEmail, group:'admin'}
    Api.get({q:{db:'users',query:{email:Conf.adminEmail}}, credentials:options})
    .then((resultArr)=>{
      if(resultArr.length<1 || resultArr[0].count<1 ){
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
    let options = [{email:Conf.adminEmail, group:'admin'}]
    let data = {
      name:'Administrator',
      email:Conf.adminEmail,
      group:'admin',
      password:sha256(Conf.adminPassword+Conf.secret),
      time:Date.now()
    }
    Api.post({q:{db:'users'},data:data,credentials:options}).then((result)=>{
      console.log('✓ admin user inserted')
      resolve(result);
    }).catch((err)=>{
      reject(err);
    })

  })


}

exports.systemCheck = new systemCheck();
