import React from "react";
import { connect } from "react-redux"
import DocumentTitle from 'react-document-title';

import tableEditDelete from "../Layout/Components/tableEditDelete";
import ActionsToolbar from '../Layout/Components/ActionsToolbar';
import * as actions from '../../actions/adminActions';

import { BootstrapPager, GriddleBootstrap } from 'griddle-react-bootstrap';


@connect((store) => {
  return {
    campid: (store.campid)?store.campid:'',
    data : (store.admin.data[store.campid] || []),
    columnMeta:   [{
      "columnName": "_id",
      "order": 9999,
      "locked": false,
      "visible": true,
      component:'campaigns',
      "customComponent": tableEditDelete
    }]
  };
})

export default class Campaigns extends React.Component {

      constructor (props){
        super();

        //LeadStore.get('leads'+(props.params.campid)?props.params.campid:'')
        //Get DAta
        //actions.get((this.props.campid)?'leads/'+this.props.campid:'leads/');

      }

      wordData() {
      }

      componentWillMount() {
        //this.props.dispatch(actions.get('users'));
        //this.props.dispatch(fetchTweets())
        //LeadStore.on("change", this.getExternalData.bind(this));
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
        let button = (typeof this.props.data !== 'undefined')?<ActionsToolbar data='campaigns' />:'';
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
                columnMetadata={this.props.columnMeta}
                results={this.props.data}
                />
          </div>
          </DocumentTitle>
        );
      }
}
