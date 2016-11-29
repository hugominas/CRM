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



      return (
        <div class="col-lg-6 eleRow">
          <div class="container innerCont">
            <div class="col-lg-1">
              <div class="avatar"></div>
            </div>
            <div class="col-lg-6">
              <div class="action">{ name }</div>
              <div class="date">{ email }</div>
            </div>
            <div class="col-lg-2">
            <div class="date">{ group }</div>
            <div class="date">{ time }</div>
            </div>
            <div class="col-lg-1">
            {tableEditDelete}
            </div>
           </div>
       </div>
    );
  }
}
