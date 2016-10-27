import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import * as actions from '../actions/LeadsActions';

class LeadsStore extends EventEmitter {

  constructor() {
    super()
    this.login = '';
    this.nowDate  = new Date();
    this.passDate = new Date();
    this.passDate = this.passDate.setMonth(this.passDate.getMonth() - 1)
    if (typeof(Storage) !== "undefined") {
      if(localStorage.getItem("login")){
          let nowTime = new Date();
          //Check if 20 min passed
          if(nowTime.setMinutes(nowTime.getMinutes() - 30)<localStorage.getItem("login"))
            this.login = 'OK';
        }
      }
  }

  get(what){
    return this[what];
  }

  getDates(which){
    if(which=='start')return this.passDate;
    if(which=='end')return this.nowDate;
    return {start:this.passDate, end:this.nowDate};
  }

  authCheck() {
    return this.login;
  }

  createTodo(text) {
    const id = Date.now();

    this.leads.push({
      id,
      text,
      complete: false,
    });

    this.emit("change");
  }

  getAll() {
    return this.leads;
  }

  handleActions(action) {
    switch(action.type) {
      case "UPDATE_DATA": {
        let updateWhat = (action.what.indexOf('/')>=0)?action.what.replace('/',''):action.what;
        this[updateWhat] = action.result.data.data;
        this.emit("change");
        break;
      }
      case "UPDATE_DATE": {
        console.log(action.data)
        this.passDate = action.data.start;
        this.nowDate = action.data.end;
        this.emit("update");
        break;
      }
      case "AUTH_USER": {
        if(action.result.data.status === 'OK'){
          localStorage.login = Date.now();
          this.emit("login");
        }else{
          localStorage.login='';
        //  window.location='/';
        }
        break;
      }
    }
  }

}

const leadStore = new LeadsStore;
dispatcher.register(leadStore.handleActions.bind(leadStore));

export default leadStore;
