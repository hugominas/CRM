import dispatcher from "../dispatcher";

export function createLead(text) {
  dispatcher.dispatch({
    type: "CREATE_LEAD",
    text,
  });
}

export function deleteLead(id) {
  dispatcher.dispatch({
    type: "DELETE_LEAD",
    id,
  });
}

export function reloadLeads() {

}
