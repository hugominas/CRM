
'use strict';

const Joi = require('joi');
const Db  = require('../conf/db');
const db  = Db.dbTrackLocal();
const mDB = require('mongodb');
const sha256 = require('js-sha256');
const Conf  = require('../conf/conf').config;

//Colections
let collections = {
  data      : db.collection('data'),
  leads     : db.collection('data'),
  lead      : db.collection('data'),
  overview  : db.collection('data'),
  users     : db.collection('users'),
  campaigns : db.collection('campaigns'),
  flows     : db.collection('flows')
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
  ///api/{what}/{page}/{items}/{sort}/{startDate}/{endDate}/
  return {
    validate: {
        params: {
          what: Joi.string(),
          id: Joi.string(),
          page: Joi.number().allow(''),
          items: Joi.number().allow(''),
          startDate: Joi.number().allow(''),
          endDate: Joi.number().allow(''),
          sort: Joi.string().allow(''),
          exportData: Joi.boolean().truthy('true').falsy('false') // USED FOR SORT OR EXPORT
        }
    },
    handler: function(request, reply) {
      //admin /api/campaigns/page/items/order/id
      if(collections.hasOwnProperty(request.params.what) && _this.__proto__.hasOwnProperty(request.method)){

        let q = {}
        _this.requestSession=request.yar.get('user');
        let endDate, startDate = '';

        if(request.params.startDate && request.params.endDate){
          ///Work Date pattern
          let datePattern = /(\d{2})(\d{2})(\d{4})/;
          ///Work startDate
          startDate = new Date(request.params.startDate.toString().trim().replace(datePattern,'$3-$2-$1')+' 00:00:01');
          ///Work endDate
          endDate = new Date(request.params.endDate.toString().trim().replace(datePattern,'$3-$2-$1')+' 23:59:59');
        }


        //Switch dataType and query
        switch (request.params.what) {
          case 'campaigns':
            q.query = (request.params.id)?{_id: mDB.ObjectId(request.params.id)}:{};
            q.query.date = { $gte : startDate, $lte: endDate };
            q.db = 'campaigns';
            break;
          case 'users':
            q.query = (request.params.id)?(/^[0-9a-fA-F]{24}$/.test(request.params.id))?{_id: mDB.ObjectId(request.params.id)}:{email: request.params.id}:{};
            q.db = 'users';
            break;
          case 'leads':
            q.query = (request.params.id)?{'data.leadId': request.params.id}:{};
            if(!request.params.id)q.query.date = { $gte : startDate, $lte: endDate };
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
          case 'overview':
            q.query = {};
            q.query.date = { $gte : startDate, $lte: endDate };
            q.db = 'data';
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
          page:request.params.page || 0,
          items:request.params.items || 10,
          data:(request.payload)?request.payload.data:'',
          credentials:_this.requestSession
        }
        
        if(request.params.exportData)params.items=-1;
        objMethods[request.method](params)
        .then((response)=>{
          //TAKE CARE OF EXPORT ON REPLY
          if(request.params.exportData){
            reply(_this.outputCSV(_this.requestSession,response))
            .header('Content-Type', 'application/octet-stream')
            .header("Content-Disposition", "attachment; filename=" + request.params.what + "_" + request.params.startDate + "_" +request.params.endDate + ".csv")
            .header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
          }else{
            reply({status:'OK',data:response}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
          }
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
apiApp.prototype.get = function(params) {
  let _this = this;
  return new Promise((resolve, reject) => {
      if(!this.checkPermission(params.credentials)){
        reject('not logedin');
      }else{
        if(params.what=='leads' && !params.id){

          params.q.query["data.leadId"] = { "$exists": true }
           //Optimizy for mongo 3.16 with project slice
           //CREATE pipeline
           let pipeline = [
                { $match:  params.q.query  },
                { $project : { date: 1, action: 1, _id: 0, 'data':1 } },
                { $group: {
                  _id: "$data.leadId",
                  action:{"$first":"$action"},
                  date:{"$first":"$date"},
                  data:{"$first":"$data"},
                  }
                },
                { $sort: { date: -1 } }
              ]
            //RUN query
            collections[params.q.db].aggregate(pipeline,
                 function(err, result){

                      if(err){
                        reject(err)
                      }else if(params.items!==-1){
                        let skip = params.page*params.items;
                        let totalCount = result.length;//--GEt total count here
                        result=result.slice(skip,(skip+params.items));
                         result.push({count:totalCount});
                         resolve(result);
                      }else{
                        resolve(result);
                      }
                  }
               )

        }else if(params.what=='overview'){

          params.q.query["data.leadId"] = { "$exists": true }
          let pipeline = [
            { $match:  params.q.query  },
             { $group: {
                _id: "$data.leadId",
                action:{"$first":"$action"},
                date:{"$first":"$date"},
                }
              },
              {$project :{
                  day : {"$dayOfMonth" : "$date"},
                  month : {"$month" : "$date"},
                  year : {"$year" : "$date"},

              }},
              {$group: {
                  _id : {year : "$year", month : "$month", day : "$day"},
                  total : { "$sum" : 1}
              }}
          ]
          //RUN query
          collections[params.q.db].aggregate(pipeline,
               function(err, result){

                    if(err){
                      reject(err)
                    }else{
                      resolve(result);
                    }
                }
             )
        }else{
          let offset = (params.page !== '' && params.items !== '' && params.items !== -1)?{limit:params.items,skip:(params.page*params.items)}:'';
          collections[params.q.db].find(params.q.query,  offset)
          .then((resultArr)=>{
            collections[params.q.db].count(params.q.query).then((total)=>{
              resultArr.push({count:total});
              if(params.q.db=='users'){
                  resultArr.forEach((ele)=>{
                    delete ele.password;
                  })
                  resolve(resultArr);
              }else{
                  resolve(resultArr);
              }
            })
          }).catch((err)=>{
                reject(err)
              });
        }
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
apiApp.prototype.recursiveWorkCSV = function(data){

  let objArray = data;

  let line = [];
  let header = []
  let lines = []

  Object.keys(objArray).map((subele)=>{
    if(lines.length==0)header.push(subele);

    if(typeof objArray[subele] == 'object' && subele !=='_id' && subele !=='leadId' && Object.keys(objArray[subele]).length>0){
      let outputdata=this.recursiveWorkCSV(objArray[subele])
      header=header.concat(outputdata.header);
      line=line.concat(outputdata.lines);
    }else{
      line.push(objArray[subele]);
    }
  })
  lines.push(line.join(';'))

  return {header,lines}

}


apiApp.prototype.outputCSV = function(credentials,data){
  let _this = this;

    if(!_this.checkPermission(credentials)) {
      return('not logedin');
    }else{
      let headers = '';
      let body = '';
      //line + '\r\n';
      //return header+ '\r\n'+str;*/
      data.map((ele)=>{
        if(!ele.hasOwnProperty('count')){
          let workedCSV = this.recursiveWorkCSV(ele)
          body+=workedCSV.lines.join(';')+'\r\n'
          headers=workedCSV.header.join(';')
        }
      })
      return headers+ '\r\n' +body
      //return _this.workCSV(data)
    }

}



exports.api = new apiApp();
