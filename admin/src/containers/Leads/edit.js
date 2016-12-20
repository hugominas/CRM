import React from "react";
import { connect } from "react-redux";
import DocumentTitle from 'react-document-title';

import tableEditDelete from "../../components/Layout/tableEditDelete";
import ActionsToolbar from '../../components/Layout/ActionsToolbar';
import CustomRowComponent from '../../components/Layout/customRow';
import * as actions from '../../actions/adminActions';

import "./edit.scss";


import { BootstrapPager, GriddleBootstrap } from 'griddle-react-bootstrap';

@connect((store) => {
  console.log(store.admin.data.leads)
  return {
    data: store.admin.data.leads
  };
})

export default class Lead extends React.Component {
  constructor(props) {
    super();
    this.params = {}

  }


  componentWillMount() {
    this.props.dispatch(actions.get('leads',this.props.params.leadid));
  }

  exportDataURL(){

  }

  deleteElement(){

  }

  workElements (){
    let a = 0;
    return this.props.data.map((ele)=>{
        a++;
        return <CustomRowComponent key={ele._id+a} campid={this.props.campid} element="leads" deleteElement={this.deleteElement.bind(this)} {... ele} />
    })
  }

  render() {
    let button = (typeof this.props.data !== 'undefined')?<ActionsToolbar data='leads' exportData={this.exportDataURL()} />:'';

    let grid = this.workElements();

    return (

      <DocumentTitle title={'Leads'}>
      <div class="upContainer">
          {button}
          {grid}

        </div>

      </DocumentTitle>
    );
  }
}
