import React from "react";
import { Button, ButtonToolbar } from 'react-bootstrap';
import { IndexLink, Link } from "react-router";

export default class tableEditDelete extends React.Component {
  constructor(props) {
    super();
  }


  render() {
    let url = '/admin/'+this.props.metadata.component+"/edit/" + this.props.data;
    let delURL ='/admin/'+this.props.metadata.component+"/delete/" + this.props.data;
    let viewURL ='/admin/'+this.props.metadata.component+"/" + this.props.data;
    if(this.props.metadata.component==='campaigns'){
      viewURL ='/admin/leads/' + this.props.data;
    }
      return (
        <div>
         <IndexLink to={url}><Button>Edit</Button></IndexLink> <IndexLink to={delURL}><Button>Delete</Button></IndexLink> <IndexLink to={viewURL}><Button bsStyle="success">View</Button></IndexLink>
       </div>
    );
  }
}
