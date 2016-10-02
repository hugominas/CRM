import React from "react";

import Lead from "../components/Lead";
import * as LeadActions from "../actions/LeadsActions";
import LeadStore from "../stores/Leads";


export default class Users extends React.Component {
  constructor() {
    super();
    this.getLeads = this.getLeads.bind(this);
    this.state = {
      leads: LeadStore.getAll(),
    };
  }

  componentWillMount() {
    LeadStore.on("change", this.getLeads);
  }

  componentWillUnmount() {
    LeadStore.removeListener("change", this.getLeads);
  }

  getLeads() {
    this.setState({
      leads: LeadStore.getAll(),
    });
  }

  reloadLeads() {
    LeadActions.reloadLeads();
  }

  render() {
    const { leads } = this.state;

    const LeadComponents = leads.map((lead) => {
        return <Lead key={lead.id} {...lead}/>;
    });

    return (
      <div>
        <button onClick={this.reloadLeads.bind(this)}>Reload!</button>
        <h1>Leads</h1>
        <ul>{LeadComponents}</ul>
      </div>
    );
  }
}
