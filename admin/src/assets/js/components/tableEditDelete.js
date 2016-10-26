import React from "react";
import { Button, ButtonToolbar } from 'react-bootstrap';
import { IndexLink, Link } from "react-router";

export default class tableEditDelete extends React.Component {
  constructor(props) {
    super();
    console.log(props.metadata.component)
  }


  render() {
    let url = '/'+this.props.metadata.component+"/edit/" + this.props.data;
    let deleteURL ='/'+this.props.metadata.component+"/delete/" + this.props.data;
      return (
        <div>
         <IndexLink to={url}><Button bsStyle="success">Edit</Button></IndexLink> <IndexLink to={deleteURL}><Button bsStyle="danger">Delete</Button></IndexLink>
       </div>
    );
  }
}
