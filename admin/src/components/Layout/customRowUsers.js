import React from "react";
import { Button, ButtonToolbar } from 'react-bootstrap';
import { IndexLink, Link } from "react-router";

import tableEditDelete from "./tableEditDelete";
import './customRow.scss';

export default class customRowCampaigns extends React.Component {
  constructor(props) {
    super();
  }


  render() {
    let {_id, name, email, group, time} = this.props.data;
    let a = 0;
    let limitData = 3

    let dt = new Date(time);
    let date =  parseInt(dt.getDate()) + '/' + parseInt(dt.getMonth()+1) + '/' + dt.getFullYear();

    let url = '/admin/users/edit/' + _id;
    let delURL ='/admin/users/delete/' + _id;
    let viewURL ='/admin/users/'+ _id;

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
              <IndexLink to={delURL}><Button bsSize="small">Delete</Button></IndexLink>
              <IndexLink to={viewURL}><Button bsSize="small" bsStyle="success">View</Button></IndexLink>
            </div>
           </div>
       </div>
    );
  }
}
