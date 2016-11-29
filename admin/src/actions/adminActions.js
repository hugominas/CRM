import * as types from './actionTypes';
import axios from "axios";
import {  push } from 'react-router-redux'

export function get(what, id='') {

  return function(dispatch) {
    axios({
      method: 'get',
      url: '/api/'+what+((id)?'/'+id:'')
    }).then((result)=>{
      //if not logedin
      if(result.data.data == 'not logedin'){
        dispatch(push('/'))
      }else{
        //Update id requested
        if(id!=''){
          dispatch({
            type: types.UPDATE_SELECTOR,
            what,
            id,
          });
        }

        //dispatch data
        dispatch({
          type: types.UPDATE_DATA,
          what,
          result,
        });
      }

    }).catch((result)=>{
      console.log(result)
      //if not logedin
      if(result.data.data == 'not logedin'){
        dispatch(push('/'))
      }else if(result.data){
        //dispatch data
        dispatch({
          type: types.UPDATE_DATA,
          what,
          result,
        });
      }

    });

  };

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
    data,
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
