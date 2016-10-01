'use strict';
// GET DEFAULTS

// GET COnstructor
function trackData(){
  this.debug = true;
  this.Joi = require('joi');
  this.Db  = require('../conf/db');
  this.getVisit  = require('./track').getVisitData;
  this.db  = this.Db.dbTrackLocal();
  this.mDB = require('mongodb');
  this.data = this.db.collection('data');
  this.checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");//57ebbc827c06bdfb3408800b
}

trackData.prototype.log = function(msg){
  if(this.debug)console.log(msg);
}

trackData.prototype.convRoute = function() {
  let _this = this;
  // VALIDATE ROUTE
  return {
    validate: {
        params: {
          campid: this.Joi.string().regex(/^[0-9a-fA-F]{24}$/),
          action: this.Joi.string(),
          multi: this.Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow('single'),
          param: this.Joi.allow('')
        }
    },
    handler: function(request, reply) {

        ///TODO: CHECK IF CAMPID IS IN CAMPID DB
        ///////////////
        /////

        ///HANDLE REQUEST EXTRA PARAMAS
        let requestExtraParts = _this.toObject((request.params.param)?request.params.param.split('/'):[]);
        //IF WE HAVE POST ADD TO FIRST ARRAY
        if(request.payload)Object.keys(request.payload.data).map((ele)=>{requestExtraParts[ele]=request.payload.data[ele]});
        //LOG
        //_this.log(requestExtraParts)
        //_this.log('In conv Route ' + JSON.stringify(request.params) + JSON.stringify(requestExtraParts))
        // CHECK IF THERE IS A LEADID IF NODE SAVE VISIT
        let sessLeadId = request.session.get('leadId');
        console.log(sessLeadId);
        if(!requestExtraParts.leadId && typeof sessLeadId === 'undefined'){
          //GET VISIT data
          let response = _this.getVisit(request, reply, (response)=>{
            //SAVE DATA
            _this.convSave({campid:request.params.campid, action:'start'}, response).then((curr)=>{
              //HAVE LEADID NOW SAVE
              requestExtraParts.leadId=curr;
              //SET LEAD AS TRACKING ID
              request.session.set('leadId', curr);
              if((request.params.action!='start' || request.params.action!='visit') && request.params.multi!=='single'){
                _this.convSave({campid:request.params.campid, action:request.params.action}, requestExtraParts).then((curr)=>{
                  reply({status:'OK',data:curr}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
                }).catch((err)=>{
                  reply({status:'NOK',data:err}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
                })
              }else{
                reply({status:'NOK',data:'you can only save one lead'}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
              }
            })
          });

      }else if(_this.checkForHexRegExp.test(requestExtraParts.leadId)){
          //SAVE DATA
          _this.convSave({campid:request.params.campid, action:request.params.action}, requestExtraParts).then((curr)=>{
            reply({status:'OK',data:curr}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
          }).catch((err)=>{
            reply({status:'NOK',data:err}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
          })
      }else if(typeof sessLeadId !== 'undefined' &&  request.params.multi!=='single'){
          requestExtraParts.leadId=sessLeadId;
          //SAVE DATA WITH SESSION
          _this.convSave({campid:request.params.campid, action:request.params.action}, requestExtraParts).then((curr)=>{
            reply({status:'OK',data:curr}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
          }).catch((err)=>{
            reply({status:'NOK',data:err}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
          })
      }else{
        reply({status:'NOK',data:'you can only save one lead'}).header("P3P", "CP=IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT");
      }
    }
  }
}

trackData.prototype.convSave=function(type, params){
  let _this = this;
   return new Promise((resolve, reject) => {
     // LOGS IN
     //_this.log('Ready to save to '+ JSON.stringify(_this.db)+ ' data '+ JSON.stringify(type) + JSON.stringify(params))
     switch (type.action) {
       case 'start':

         // FIND VISIT
         let visitObj = {
           _id: _this.mDB.ObjectId(),
           campid: type.campid,
           date: new Date(),
           action: type.action,
           data:params

         }
         // WRITE VISIT
         _this.data.insert(visitObj).then((resultArr)=>{
           resolve(resultArr.ops[0]._id)
         }).catch((err)=>{
           reject(err)
         })

         break;
       default:
         // FIND VISIT
         let leadID  = ''+params.leadId;
         let convObj = {
           _id: _this.mDB.ObjectId(),
           campid: type.campid,
           leadid:leadID,
           date: new Date(),
           action: type.action,
           data: params
         }

         // FIND VISIT
         _this.data.find({leadid: params.leadId, action:type.action}).then((resultArr)=>{
           let leadoforError = convObj.data.leadId;
           if(resultArr.length>0){
            //CHECK IF ITS THE SAME
            let toSave = true;
            resultArr.map((result)=>{if(_this.deepCompare(result.data,convObj.data)) toSave=false; })
            if(toSave){
              //JUST INSERT
              _this.data.insert(convObj).then((result)=>{
                 resolve(result.ops[0].leadid)
               }).catch((err)=>{
                 reject(err)
               })
            }else{
              reject('lead already saved with this data id - '+leadoforError);
            }
          }else{
            //JUST INSERT
            _this.data.insert(convObj).then((result)=>{
               resolve(result.ops[0].leadid)
             }).catch((err)=>{
               reject(err)
             })
           }
         })



     }

  });
}

trackData.prototype.toObject = function (arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[i] = arr[i];
  return rv;
}

trackData.prototype.deepCompare = function (x,y) {
  if ( x === y ) return true;
      // if both x and y are null or undefined and exactly the same

    if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
      // if they are not strictly equal, they both need to be Objects

    if ( x.constructor !== y.constructor ) return false;
      // they must have the exact same prototype chain, the closest we can do is
      // test there constructor.

    for ( var p in x ) {
      if ( ! x.hasOwnProperty( p ) ) continue;
        // other properties were tested using x.constructor === y.constructor

      if ( ! y.hasOwnProperty( p ) ) return false;
        // allows to compare x[ p ] and y[ p ] when set to undefined

      if ( x[ p ] === y[ p ] ) continue;
        // if they have the same strict value or identity then they are equal

      if ( typeof( x[ p ] ) !== "object" ) return false;
        // Numbers, Strings, Functions, Booleans must be strictly equal

      if ( ! Object.equals( x[ p ],  y[ p ] ) ) return false;
        // Objects and Arrays must be tested recursively
    }

    for ( p in y ) {
      if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
        // allows x[ p ] to be set to undefined
    }
    return true;
}



exports.track = new trackData();
