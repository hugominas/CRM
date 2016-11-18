import * as types from '../constants/actionTypes';
import axios from "axios";


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
          console.log(result,1)
          if(result.data.status=='OK'){
            dispatch({
              type: types.AUTH_USER,
              result:'OK'
            });
          }
        }).catch((err)=>{
          console.log(err)
          if(err.data.status=='NOK'){
            dispatch({
              type: types.LOGOUT_USER,
              result: 'OK'
            });
          }
        });
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
