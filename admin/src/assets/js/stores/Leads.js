import { EventEmitter } from "events";

import dispatcher from "../dispatcher";

class LeadsStore extends EventEmitter {
  constructor() {
    super()
    this.leads = [
      {
        id: 113464613,
        text: "Go Shopping",
        complete: false
      },
      {
        id: 235684679,
        text: "Pay Water Bill",
        complete: false
      },
    ];
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
      case "CREATE_LEAD": {
        this.createTodo(action.text);
        break;
      }
      case "RECEIVE_LEAD": {
        this.todos = action.todos;
        this.emit("change");
        break;
      }
    }
  }

}

const leadStore = new LeadStore;
dispatcher.register(leadStore.handleActions.bind(leadStore));

export default leadStore;
