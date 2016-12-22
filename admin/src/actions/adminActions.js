import * as types from './actionTypes';
import axios from "axios";
import { push } from 'react-router-redux'
import {toastr} from 'react-redux-toastr'

axios.defaults.baseURL = 'http://localhost:3007'
//axios.defaults.baseURL = 'http://admin.energia-galp.com'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//WORKS FOR CROSSDOMAIN
axios.defaults.withCredentials = true;

export function get(what, id='', pager={page:0,items:10,sort:'date',startDate:'00-00-0000',endDate:'00-00-0000'}, exportData=false) {
  return function(dispatch) {
    ///api/{what}/{page}/{items}/{sort}/{startDate}/{endDate}/
    let startDate=pager.startDate.replace(/-/g, '');
    let endDate=pager.endDate.replace(/-/g, '');
    //create query URL
    let queryURL = ['api',what, pager.page, pager.items, pager.sort,startDate, endDate, exportData, id]
    .join('/');

    axios({
      method: 'get',
      url: '/'+queryURL
    }).then((result)=>{
      //if not logedin
      if(result.data.data == 'not logedin'){
        dispatch(push('/'))
      }else{
        //toastr.success('Updated data', what+' updated');
        //dispatch data

        if(!exportData)
          dispatch({
            type: (id!='' && what!=='leads')?types.UPDATE_DATA_SINGLE:types.UPDATE_DATA,
            what,
            result,
          });
      }

    }).catch((err)=>{
      //console.log(err)
    });

  };

}


export function exportData(what, id='', pager={page:0,items:10,sort:'date',startDate:'00-00-0000',endDate:'00-00-0000'}, exportData=false) {
    ///api/{what}/{page}/{items}/{sort}/{startDate}/{endDate}/
    let startDate=pager.startDate.replace(/-/g, '');
    let endDate=pager.endDate.replace(/-/g, '');
    //create query URL
    let queryURL = [axios.defaults.baseURL,'api',what, pager.page, pager.items, pager.sort,startDate, endDate, exportData, id]
    .join('/');
    window.open(queryURL, '_blank')
}

export function set(what,data,id='') {
  return function(dispatch) {
    data.date=new Date;
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
