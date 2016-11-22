import * as types from './actionTypes';
import axios from "axios";
import {  push } from 'react-router-redux'
import {toastr} from 'react-redux-toastr'


axios.defaults.baseURL = 'http://localhost:3007'

export function sendLogin(email,password) {
    return function(dispatch) {
      console.log('logginin')
      axios({
          method: 'post',
          url: '/admin/auth',
          data: {
            data:{
              password: password,
              email: email
            }
          }
        }).then((result)=>{
          if(result.data.status=='OK'){
            localStorage.login = Date.now();
            toastr.success('Login', 'you have successfuly logged in');
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
            toastr.error('Error', 'please verify your details');
          }
        })
    }
}


export function sendLogout() {
  return function(dispatch) {
    axios({
      method: 'post',
      url: '/admin/logout'
    }).then((act)=>{
      dispatch({
        type: types.LOGOUT_USER,
        result:'OK',
      });
      toastr.warning('Warning', 'you have been succefully logedout');
      localStorage.login='';
      dispatch(push('/'))

    }).catch((err)=>{
      dispatch({
        type: types.LOGOUT_USER,
        result:'NOK',
      });
    });
  }
}
