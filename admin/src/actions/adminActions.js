import * as types from './actionTypes';
import axios from "axios";
import {  push } from 'react-router-redux'
import {toastr} from 'react-redux-toastr'

export function get(what, id='', pager) {

  return function(dispatch) {
    axios({
      method: 'get',
      url: '/api/'+what+((id)?'/'+id:'')
    }).then((result)=>{
      //if not logedin
      if(result.data.data == 'not logedin'){
        dispatch(push('/'))
      }else{
        //toastr.success('Updated data', what+' updated');
              //dispatch data
        dispatch({
          type: (id!='')?types.UPDATE_DATA_SINGLE:types.UPDATE_DATA,
          what,
          result,
        });
      }

    }).catch((result)=>{
      //if not logedin
      if(result.data && result.data.data == 'not logedin'){
        dispatch(push('/'))
      }else if(result.data){
        //dispatch data
        dispatch({
          type: (id!='')?types.UPDATE_DATA_SINGLE:types.UPDATE_DATA,
          what,
          result,
        });
      }

    });

  };

}


export function set(what,data,id='') {
  return function(dispatch) {
    data.time=Date.now();
    axios({
      method: 'put',
      url: '/api/'+what+((id)?'/'+id:''),
      data: {
        data
      }
    }).then((act)=>{

      toastr.success('Saved data', what+' saved');
      //if not logedin
      if(result.data.data == 'not logedin'){
        dispatch(push('/'))
      }else{
        //dispatch data
        dispatch({
          type: types.UPDATE_DATA,
          what,
          result,
        });
      }
    }).catch((err)=>{
    console.log(err)
    });
  }
}

export function updateDataSet(data) {
  return {
    type: types.UPDATE_DATE,
    data,
  };
}


export function del(what,id) {
  return function(dispatch) {

    const toastrConfirmOptions = {
      onOk: () => {

        axios({
          method: 'delete',
          url: '/api/'+what+((id)?'/'+id:''),
        }).then((act)=>{
          toastr.success('Succeful', what+' deleted');
          //dispatch data
          dispatch({
            type: types.DELETE_DATA,
            what,
            id,
          });
        })

      },
      onCancel: () => {}
    };
    toastr.confirm('Are you sure you want to delete!', toastrConfirmOptions);



  };
}

export function reloadLeads() {

}
