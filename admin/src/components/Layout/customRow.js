import React from "react";
import { Button, ButtonToolbar } from 'react-bootstrap';
import { IndexLink, Link } from "react-router";

import tableEditDelete from "./tableEditDelete";
import './customRow.scss';

export default class customRowComponent extends React.Component {
  constructor(props) {
    super();
  }


  render() {
    let {_id, action, campid, data, date, deleteElement, element} = this.props;
    let a = 0;
    let limitData = 3

    let urlConstruct = '/'+['admin',element,campid].filter(function(n){ return n != '' }).join('/')

    let url = urlConstruct+'/edit/' + _id;
    let viewURL =urlConstruct+'/'+ _id;
    let dataElement = Object.keys(data).map(ele => {
      a++;
      return <div key={_id+a+ele} class={(a>limitData)?"hidden col-lg-3":"col-lg-3"}><h6>{ele}</h6>{data[ele]}</div>;
    })

      return (
        <div class="col-lg-12 eleRow">
          <div class="container innerCont">
            <div class="col-lg-1">
              <div class="avatar"></div>
            </div>
            <div class="col-lg-2">
              <div class="action">{ action }</div>
              <div class="date">{ date }</div>
            </div>
            <div class="col-lg-7">
              {dataElement}
            </div>
            <div class="col-lg-2 actions">
              <IndexLink to={url}><Button bsSize="small">Edit</Button></IndexLink>
              <Button bsSize="small" onClick={()=>{deleteElement(_id)}}>Delete</Button>
              <IndexLink to={viewURL}><Button bsSize="small" bsStyle="success">View</Button></IndexLink>
            </div>
           </div>
       </div>
    );
  }
}
