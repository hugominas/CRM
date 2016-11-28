import React from "react";
import { connect } from "react-redux"
import DocumentTitle from 'react-document-title';

//import { Button, ButtonToolbar } from 'react-bootstrap';
import tableEditDelete from "../Layout/Components/tableEditDelete";
import * as actions from '../../actions/adminActions';
import ActionsToolbar from '../Layout/Components/ActionsToolbar';

import { BootstrapPager, GriddleBootstrap } from 'griddle-react-bootstrap';


@connect((store) => {
  console.log(store.admin)
  return {
    data : (store.admin.data.users || []),
    columnMeta:   [{
      "columnName": "_id",
      "order": 9999,
      "locked": false,
      "visible": true,
      component:'users',
      "customComponent": tableEditDelete
    }]
  };
})


export default class Users extends React.Component {
  constructor (){
    super();
    //SetState

  }

  componentWillMount() {
    this.props.dispatch(actions.get('users'));
  }

  componentWillUnmount() {
    //this.isUnmounted = true;
    //LeadStore.removeListener("change", this.getExternalData.bind(this));
  }

  getExternalData (){
    /*if(!this.isUnmounted ){
      this.setState({data:LeadStore.get('users')})
    }*/
  }


  setPage (index){
    //This should interact with the data source to get the page at the given index
    index = index > this.props.maxPages ? this.props.maxPages : index < 1 ? 1 : index + 1;
    //this.getExternalData(index);
  }

  setPageSize (size){
  }

  render() {
    let button = (typeof this.props.data !== 'undefined')?<ActionsToolbar data='campaigns' />:'';
    return (
      <DocumentTitle title={'Users'}>
        <div class="container innerCont">
          {button}
          <GriddleBootstrap
              hover={true}
              striped={true}
              bordered={false}
              condensed={false}
              showFilter={true}
              showSettings={true}
              pagerOptions={{ maxButtons: 7 }}
              customPagerComponent={ BootstrapPager }
              columnMetadata={this.props.columnMeta}
              results={this.props.data}
              />
        </div>
      </DocumentTitle>
    );
  }
}
