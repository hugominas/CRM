import React from "react";

//import { Button, ButtonToolbar } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import tableEditDelete from "../components/tableEditDelete";
import LeadStore from '../stores/Leads';
import * as actions from '../actions/LeadsActions';

import { BootstrapPager, GriddleBootstrap } from 'griddle-react-bootstrap';


export default class Users extends React.Component {
  constructor (){
    super();
    this.state = {
      data : actions.get('users'),
      columnMeta:   {
        "columnName": "actions",
        "order": 9999,
        "locked": false,
        "visible": true,
        'component': 'campaigns',
        "customComponent": tableEditDelete
        }
    }
  }

  componentWillMount() {
    LeadStore.on("change", this.getExternalData.bind(this));
  }

  componentWillUnmount() {
    LeadStore.removeListener("change", this.getExternalData.bind(this));
  }

  getExternalData (){
    this.setState({data:LeadStore.get('users')})
  }


  setPage (index){
    //This should interact with the data source to get the page at the given index
    index = index > this.state.maxPages ? this.state.maxPages : index < 1 ? 1 : index + 1;
    this.getExternalData(index);
  }

  setPageSize (size){
  }

  render() {
    return (
      <DocumentTitle title={'Users'}>
        <div class="container innerCont">
          <GriddleBootstrap
              hover={true}
              striped={true}
              bordered={false}
              condensed={false}
              showFilter={true}
              showSettings={true}
              pagerOptions={{ maxButtons: 7 }}
              customPagerComponent={ BootstrapPager }
              columnMetadata={this.state.columnMeta}
              results={this.state.data}
              />
        </div>
      </DocumentTitle>
    );
  }
}
