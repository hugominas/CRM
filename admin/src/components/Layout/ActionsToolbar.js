import React from "react";
import { Button, ButtonToolbar } from 'react-bootstrap';
import { IndexLink, Link } from "react-router";


export default class ActionsToolbar extends React.Component {
  constructor(props) {
    super();
    this.component = props.data;
    //this.state={data:setTimeout(LeadStore.get(props.data),3000)}; store.admin.data[props.data]
  }


  render() {
      return (
        <div class="getData">
          <IndexLink><Button bsStyle="warning" onClick={this.props.exportData}>click here to download all data</Button></IndexLink>&nbsp;<IndexLink to={'/admin/'+this.component+'/add/'}><Button bsStyle="success">Add new</Button></IndexLink>
        </div>
    );
  }
}
