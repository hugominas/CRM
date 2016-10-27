import dispatcher from "../dispatcher";
import axios from "axios";

export function sendLogin(email,password) {
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
      dispatcher.dispatch({
        type: "AUTH_USER",
        result,
      });
    }).catch((result)=>{
      dispatcher.dispatch({
        type: "AUTH_USER",
        result,
      });
    });
}

export function get(what) {
  axios({
    method: 'get',
    url: '/api/'+what
  }).then((result)=>{
    //if not logedin
    if(result.data.data == 'not logedin')dispatcher.dispatch({type: "AUTH_USER",result});
    //dispatch data
    dispatcher.dispatch({
      type: "UPDATE_DATA",
      what,
      result,
    });
  }).catch((result)=>{
    //if not logedin
    if(!result.data || result.data.data == 'not logedin')dispatcher.dispatch({type: "AUTH_USER",result});
    //dispatch data
    dispatcher.dispatch({
      type: "UPDATE_DATA",
      what,
      result,
    });
  });
}

export function updateDataSet(data) {
  dispatcher.dispatch({
    type: "UPDATE_DATE",
    data,
  });
}

export function set(what,data) {
  dispatcher.dispatch({
    type: "DELETE_LEAD",
    id,
  });
}

export function del(what,id) {
  dispatcher.dispatch({
    type: "DELETE_LEAD",
    id,
  });
}

export function reloadLeads() {

}
