import { EventEmitter } from "events";
import dispatcher from "../dispatcher";

class LeadsStore extends EventEmitter {

  constructor() {
    super()
    this.login = '';
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
        this[action.what] = action.result.data.data;
        this.emit("change");
        break;
      }
      case "AUTH_USER": {
        this.login = action.result.data.status;
        if(this.login === 'OK'){
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
