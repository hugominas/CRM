import React from "react";
import { connect } from "react-redux"
import DocumentTitle from 'react-document-title';

import tableEditDelete from "../Layout/Components/tableEditDelete";
import ActionsToolbar from '../Layout/Components/ActionsToolbar';
import * as actions from '../../actions/adminActions';
import customRowComponent from '../Layout/Components/customRow';

import { BootstrapPager, GriddleBootstrap } from 'griddle-react-bootstrap';


@connect((store) => {
  return {
    campid: (store.campid)?store.campid:'',
    data : (store.campid)?store.admin.data[store.campid]:store.admin.data.leads

  };
})

export default class Campaigns extends React.Component {

      constructor (props){
        super();
        //LeadStore.get('leads'+(props.params.campid)?props.params.campid:'')
        //Get DAta
        //actions.get((this.props.campid)?'leads/'+this.props.campid:'leads/');
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

      wordData() {
      }

      componentWillMount() {
        //this.props.dispatch(actions.get('users'));
        //this.props.dispatch(fetchTweets())
        //LeadStore.on("change", this.getExternalData.bind(this));
        this.props.dispatch(actions.get('leads',this.props.params.campid));

      }

      componentWillUnmount() {
        //this.isUnmounted = true;
        //LeadStore.removeListener("change", this.getExternalData.bind(this));
      }

      getExternalData (){
        /*if(!this.isUnmounted ){
          this.setState({data:LeadStore.get('leads'+this.props.campid)})
          this.wordData();
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
        let button = (typeof this.props.data !== 'undefined')?<ActionsToolbar data='leads' />:'';
        return (

          <DocumentTitle title={'Campaigns'}>
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
