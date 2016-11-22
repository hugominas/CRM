import * as types from './actionTypes';
import axios from "axios";

export function get(what) {
  return function(dispatch) {
    axios({
      method: 'get',
      url: '/api/'+what
    }).then((result)=>{
      //if not logedin
      if(result.data.data == 'not logedin')dispatch({type: types.AUTH_USER,result});
      //dispatch data
      dispatch({
        type: types.UPDATE_DATA,
        what,
        result,
      });
    }).catch((result)=>{
      //if not logedin
      if(!result.data || result.data.data == 'not logedin')dispatch({type: types.AUTH_USER,result});
      //dispatch data
      dispatch({
        type: types.UPDATE_DATA,
        what,
        result,
      });
    });
  }
}

export function updateDataSet(data) {
  return {
    type: types.UPDATE_DATE,
    data,
  };
}

export function set(what,data) {
  return {
    type: types.DELETE_LEAD,
    id,
  };
}

export function del(what,id) {
  return {
    type: types.DELETE_LEAD,
    id,
  };
}

export function reloadLeads() {

}
