import React from "react";
import { Button, ButtonToolbar } from 'react-bootstrap';
import { IndexLink, Link } from "react-router";

import './customRow.scss';

export default class customRowUsers extends React.Component {
  constructor(props) {
    super();
    this.props = props
  }


  render() {
    let {element, expanded, expandElement, _id, name, email, group, time, deleteElement} = this.props;
    let a = 0;
    let limitData = 3

    let dt = new Date(time);
    let date = dt.getDate() + '/' + parseInt(dt.getMonth()+1) + '/' + dt.getFullYear();

    let url = '/admin/campaigns/edit/' + _id;
    let viewURL ='/admin/campaigns/'+ _id;

      return (
        <div class="col-lg-6 eleRow">
          <div class="container innerCont">
            <div class="col-lg-2">
              <div class="avatar"></div>
            </div>
            <div class="col-lg-6">
              <div class="action">{ name }</div>
              <div class="group">{ group } { date }</div>
              <div class="date">{ email }</div>
            </div>

            <div class="col-lg-4 actions">
              <IndexLink to={url}><Button bsSize="small">Edit</Button></IndexLink>
              <Button bsSize="small" onClick={()=>{deleteElement(_id)}}>Delete</Button>
              <IndexLink to={viewURL}><Button bsSize="small" bsStyle="success">View</Button></IndexLink>
            </div>
           </div>
       </div>
    );
  }
}
