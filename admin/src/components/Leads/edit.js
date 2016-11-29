import React from "react";
import { connect } from "react-redux";
import DocumentTitle from 'react-document-title';

import tableEditDelete from "../Layout/Components/tableEditDelete";
import ActionsToolbar from '../Layout/Components/ActionsToolbar';
import customRowComponent from '../Layout/Components/customRow';
import * as actions from '../../actions/adminActions';



import { BootstrapPager, GriddleBootstrap } from 'griddle-react-bootstrap';

@connect((store) => {
  return {
    data: store.admin.data.lead
  };
})

export default class Lead extends React.Component {
  constructor(props) {
    super();
    this.params = {}
    this.columnMeta =   [{
      "columnName": "_id",
      "order": 9999,
      "locked": false,
      "visible": true,
      component:'campaigns',
      campid:props.params.campid,
      "customComponent": tableEditDelete
    }]
  }

  componentWillMount() {
    this.props.dispatch(actions.get('lead',this.props.params.leadid));
  }

  render() {
    console.log(this.props)
    const { complete, edit, text } = this.props;

    let button = (typeof this.props.data !== 'undefined')?<ActionsToolbar data='leads' />:'';

    /*if (edit) {
      return (
        <li>
          <input value={text} focus="focused"/>
        </li>
      );
    }*/

    return (
      <DocumentTitle title={'Leads'}>
      <div class="upContainer">


        {button}
        <GriddleBootstrap
            hover={true}
            striped={true}
            bordered={false}
            condensed={false}
            showFilter={true}
            showSettings={true}

            useCustomRowComponent={true}
            customRowComponent={customRowComponent}
            enableToggleCustom={true}
            resultsPerPage={10}

            pagerOptions={{ maxButtons: 7 }}
            customPagerComponent={ BootstrapPager }
            columnMetadata={this.columnMeta}
            results={this.props.data}
            />
      </div>
      </DocumentTitle>
    );
  }
}
