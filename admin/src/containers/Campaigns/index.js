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
      }

      handleSelect (pagenum){
        pagenum = pagenum-1;
        this.props.dispatch({
          type: types.UPDATE_PAGER,
          pager: {... this.props.pager, page:pagenum}
        });
        this.props.dispatch(actions.get('campaigns','',{... this.props.pager, page:pagenum}));
      }

      workElements (data){
        return data.map((ele)=>{
            return <CustomRowCampaigns key={ele._id} deleteElement={this.deleteElement.bind(this)} {... ele} />
        })
      }

      deleteElement (id){
        this.props.dispatch(actions.del('campaigns',id));
      }

      render() {

        let button = (typeof this.props.data !== 'undefined')?<ActionsToolbar data='campaigns' />:'';
        let grid = this.workElements(this.props.data);

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
              items={this.props.pager.totalPages}
              maxButtons={7}
              activePage={this.props.pager.page}
              onSelect={this.handleSelect.bind(this)} />
          </div>
          </DocumentTitle>
        );
      }
}
