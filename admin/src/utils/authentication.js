import * as types from '../actions/actionTypes';
import {  push } from 'react-router-redux'

export function checkAuth() {
  return store => next => action => {

    if (typeof(Storage) !== "undefined" && action.type) {


        if(localStorage.getItem("login") && localStorage.getItem("login") !== ''){

            let nowTime = new Date();
            //Check if 30 min passed
            if((nowTime.setMinutes(nowTime.getMinutes() + 30)<parseInt(localStorage.getItem("login")))){

              localStorage.login='';
              if(window.location.pathname != "/") window.location = '/'
              return next(action)


            }else {
              return next(action)
            }

          }else{
            if(window.location.pathname != "/" && action.type !== 'LOCATION_CHANGE') window.location = '/'
            return next(action)
          }


    }else{

      return next(action)

    }

  }
}
