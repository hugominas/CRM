import React from "react";
import { Button, ButtonToolbar } from 'react-bootstrap';
import { IndexLink, Link } from "react-router";

import tableEditDelete from "./tableEditDelete";
import './customRow.scss';

export default class customRowComponent extends React.Component {
  constructor(props) {
    super();
    this.expanded=false;
  }



  expandClass(){
    return
  }

  render() {
    let {_id, action, campid, data, date, deleteElement, element, expanded, expandElement} = this.props;
    let a = 0;
    let limitData = 3
    let dateTime = new Date(date);
    let dateString = dateTime.getDate()+'/'+(dateTime.getMonth()+1)+'/'+dateTime.getFullYear()+' '+dateTime.getHours()+':'+((dateTime.getMinutes()<10)?'0'+dateTime.getMinutes():dateTime.getMinutes());
    let urlConstruct = '/'+['admin',element,campid].filter(function(n){ return n != '' }).join('/')

    let url = urlConstruct+'/edit/' + _id;
    //let viewURL =urlConstruct+'/'+ _id;
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
            <div class="col-lg-3">
              <div class="action">{ data.nome_titular }</div>
              <div class="date">{ dateString } { data.produto }</div>
            </div>
            <div class={(expanded)?"col-lg-6 active":"col-lg-6"}>
              {dataElement}
            </div>
            <div class="col-lg-2 actions">
              <IndexLink to={url}><Button bsSize="small">Edit</Button></IndexLink>
              <Button bsSize="small" onClick={()=>{deleteElement(_id)}}>Delete</Button>
              <Button bsSize="small" bsStyle="success" onClick={()=>{expandElement(_id)}}>View</Button>
            </div>
           </div>
       </div>
    );
  }
}
