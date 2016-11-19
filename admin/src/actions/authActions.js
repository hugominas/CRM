import * as types from '../constants/actionTypes';
import axios from "axios";
import {  push } from 'react-router-redux'


export function sendLogin(email,password) {
    return function(dispatch) {
      axios({
          method: 'post',
          url: 'http://localhost:3007/admin/auth',
          data: {
            data:{
              password: password,
              email: email
            }
          }
        }).then((result)=>{
          if(result.data.status=='OK'){
            dispatch({
              type: types.AUTH_USER,
              result:'OK'
            })
            dispatch(push('/admin'))
          }else{
            dispatch({
              type: types.INCORRECT_USER,
              result: 'NOK'
            });
          }
        })
    }
}


export function sendLogout() {
  return function(dispatch) {
    axios({
      method: 'get',
      url: '/admin/logout'
    }).then((act)=>{
      dispatch({
        type: types.LOGOUT_USER,
        result:'OK',
      });
    }).catch((err)=>{
      dispatch({
        type: types.LOGOUT_USER,
        result:'NOK',
      });
    });
  }
}
