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

trackData.prototype.session = function(param){
  if(typeof params.req.session != 'undefined' && typeof params.req.session.get == 'function'){
       return (params.req.session.get('user')) ? params.req.session.get('user') : false;
   }else{
       return false;
   }
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
          param: this.Joi.allow('')
        }
    },
    handler: function(request, reply) {

      ///TODO: CHECK IF CAMPID IS IN CAMPID DB
      ///////////////
      /////

      ///HANDLE REQUEST EXTRA PARAMAS
      const requestExtraParts = (request.params.param)?request.params.param.split('/'):[];
      //IF WE HAVE POST ADD TO FIRST ARRAY
      if(request.payload)requestExtraParts.join(request.payload.data);
      //LOG
      //_this.log('In conv Route ' + JSON.stringify(request.params) + JSON.stringify(requestExtraParts))
      // CHECK IF THERE IS A LEADID IF NODE SAVE VISIT
      let sessLeadId = request.session.get('leadId');
      if(!requestExtraParts.leadId && typeof sessLeadId === 'undefined'){
        //GET VISIT data
        let response = _this.getVisit(request, reply, (response)=>{
          //SAVE DATA
          _this.convSave({campid:request.params.campid, action:'start'}, response).then((curr)=>{
            //HAVE LEADID NOW SAVE
            requestExtraParts.leadId=curr;
            request.session.set('leadId', curr);
            if(request.params.action!='start' || request.params.action!='visit'){
              _this.convSave({campid:request.params.campid, action:request.params.action}, requestExtraParts).then((curr)=>{
                reply({status:'OK',leadId:curr});
              }).catch((err)=>{
                reply({status:'NOK',message:err});
              })
            }
          })
        });

    }else if(_this.checkForHexRegExp.test(requestExtraParts.leadId)){
        //SAVE DATA
        _this.convSave({campid:request.params.campid, action:request.params.action}, requestExtraParts).then((curr)=>{
          reply({status:'OK',leadId:curr});
        }).catch((err)=>{
          reply({status:'NOK',message:err});
        })
    }else if(typeof sessLeadId !== 'undefined'){
        requestExtraParts.leadId=sessLeadId;
        //SAVE DATA
        _this.convSave({campid:request.params.campid, action:request.params.action}, requestExtraParts).then((curr)=>{
          reply({status:'OK',leadId:curr});
        }).catch((err)=>{
          reply({status:'NOK',message:err});
        })
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
         _this.data.find({_id: _this.mDB.ObjectId(params.leadId), action:type.action}).then((resultArr)=>{
           if(resultArr.length>0){
            //CHECK IF ITS THE SAME

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




exports.track = new trackData();
