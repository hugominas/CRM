import React from "react";
import DocumentTitle from 'react-document-title';
import tableEditDelete from "../components/tableEditDelete";
import LeadStore from '../stores/Leads';
import ActionsToolbar from '../components/ActionsToolbar';
import * as actions from '../actions/LeadsActions';

import { BootstrapPager, GriddleBootstrap } from 'griddle-react-bootstrap';



export default class Campaigns extends React.Component {

      constructor (props){
        super();
        if(props)props.params
        //SetState
        this.state = {
          campid: (props.params.campid)?props.params.campid:'',
          data : LeadStore.get('leads'+(props.params.campid)?props.params.campid:''),
          columnMeta:   [{
            "columnName": "_id",
            "order": 9999,
            "locked": false,
            "visible": true,
            component:'campaigns',
            "customComponent": tableEditDelete
          }]
        }
        //Get DAta
        actions.get((this.state.campid)?'leads/'+this.state.campid:'leads/');
        this.wordData();

      }

      wordData() {
      }

      componentWillMount() {
        LeadStore.on("change", this.getExternalData.bind(this));
      }

      componentWillUnmount() {
        this.isUnmounted = true;
        LeadStore.removeListener("change", this.getExternalData.bind(this));
      }

      getExternalData (){
        if(!this.isUnmounted ){
          this.setState({data:LeadStore.get('leads'+this.state.campid)})
          this.wordData();
        }
      }

      setPage (index){
        //This should interact with the data source to get the page at the given index
        index = index > this.state.maxPages ? this.state.maxPages : index < 1 ? 1 : index + 1;
        this.getExternalData(index);
      }

      setPageSize (size){
      }




      render() {
        let button = (typeof this.state.data !== 'undefined')?<ActionsToolbar data='campaigns' />:'';
        return (

          <DocumentTitle title={'Campaigns'}>
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
                columnMetadata={this.state.columnMeta}
                results={this.state.data}
                />
          </div>
          </DocumentTitle>
        );
      }
}
