'use strict';

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


exports.admin = new adminApp();
