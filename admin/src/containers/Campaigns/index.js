import React from "react";
import { connect } from "react-redux"
import DocumentTitle from 'react-document-title';

import ActionsToolbar from '../../components/Layout/ActionsToolbar';
import CustomRowCampaigns from '../../components/Layout/customRowCampaigns';

import * as actions from '../../actions/adminActions';



@connect((store) => {
  return {
    data : (store.admin.data.campaigns || [])
  };
})

export default class Campaigns extends React.Component {

      constructor (){
        super();

        //Get DAta
      }

      componentWillMount() {
        this.props.dispatch(actions.get('campaigns'));
        //LeadStore.on("change", this.getExternalData.bind(this));
      }

      componentWillUnmount() {
        //this.isUnmounted = true;
        //LeadStore.removeListener("change", this.getExternalData.bind(this));
      }

      getExternalData (){
      /*  if(!this.isUnmounted ){
          this.setState({data:LeadStore.get('campaigns')})
        }*/
      }

      deleteElement (id){
        this.props.dispatch(actions.del('campaigns',id));
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
        let grid = this.props.data.map((ele)=>{
            return <CustomRowCampaigns key={ele._id} deleteElement={this.deleteElement.bind(this)} {... ele} />
        })
        return (

          <DocumentTitle title={'Campaigns'}>
          <div class="upContainer">
            {button}
            {grid}
          </div>
          </DocumentTitle>
        );
      }
}
