import React from "react";
import { connect } from "react-redux"
import DocumentTitle from 'react-document-title';

import ActionsToolbar from '../../components/Layout/ActionsToolbar';
import CustomRowCampaigns from '../../components/Layout/customRowCampaigns';

import * as types from '../../actions/actionTypes';
import * as actions from '../../actions/adminActions';
import {Col, Pagination } from 'react-bootstrap';



@connect((store) => {
  return {
    data : (store.admin.data.campaigns || []),
    pager: store.admin.pager
  };
})

export default class Campaigns extends React.Component {

      constructor (props){
        super();
      }

      componentWillMount() {
        this.props.dispatch(actions.get('campaigns','',{... this.props.pager, page:0}));
        //LeadStore.on("change", this.getExternalData.bind(this));
      }

      handleSelect (pagenum){
      /*  if(!this.isUnmounted ){
          this.setState({data:LeadStore.get('campaigns')})
        }*/
        this.props.dispatch({
          type: types.UPDATE_PAGER,
          pager: {... this.props.pager, page:pagenum}
        });
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
            <Pagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              items={20}
              maxButtons={7}
              activePage={this.page}
              onSelect={this.handleSelect} />
          </div>
          </DocumentTitle>
        );
      }
}
