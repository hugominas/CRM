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
    let {_id, date} = this.props.data;
    let a = 0;
    let limitData = 3



      return (
        <div class="col-lg-12 eleRow">
          <div class="container innerCont">
            <div class="col-lg-1">
              <div class="avatar"></div>
            </div>
            <div class="col-lg-2">
              <div class="action">{ _id }</div>
              <div class="date">{ date }</div>
            </div>
            <div class="col-lg-9">
            </div>
            <div class="col-lg-1">
            {tableEditDelete}
            </div>
           </div>
       </div>
    );
  }
}
