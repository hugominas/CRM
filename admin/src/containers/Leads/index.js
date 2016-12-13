import React from "react";
import { connect } from "react-redux"
import DocumentTitle from 'react-document-title';

import tableEditDelete from "../../components/Layout/tableEditDelete";
import ActionsToolbar from '../../components/Layout/ActionsToolbar';

import * as types from '../../actions/actionTypes';
import * as actions from '../../actions/adminActions';
import CustomRowComponent from '../../components/Layout/customRow';

import {Col, Pagination } from 'react-bootstrap';

import { BootstrapPager, GriddleBootstrap } from 'griddle-react-bootstrap';


@connect((store) => {
  return {
    campid: (store.campid)?store.campid:'',
    data : store.admin.data.leads,
    pager: store.admin.pager
  };
})

export default class Campaigns extends React.Component {

      constructor (props){
        super();
      }


      componentDidUpdate(prevProps, prevState){
        if(prevProps.pager.startDate !== this.props.startDate
          || prevProps.pager.endDate !== this.props.endDate ){
            this.props.dispatch(actions.get('leads',this.props.params.campid,{... this.props.pager}));
          }
      }

      componentWillMount() {
        this.props.dispatch(actions.get('leads',this.props.params.campid,{... this.props.pager, page:0}));
      }

      deleteElement (id){
        this.props.dispatch(actions.del('lead',id));
      }

      handleSelect (pagenum){
        pagenum = pagenum-1;
        this.props.dispatch({
          type: types.UPDATE_PAGER,
          pager: {... this.props.pager, page:pagenum}
        });
        this.props.dispatch(actions.get('leads','',{... this.props.pager, page:pagenum}));
      }

      workElements (data){
        let a = 0;
        return this.props.data.map((ele)=>{
            a++;
            return <CustomRowComponent key={ele._id+a} campid={this.props.campid} element="leads" deleteElement={this.deleteElement.bind(this)} {... ele} />
        })
      }

      render() {

        let button = (typeof this.props.data !== 'undefined')?<ActionsToolbar data='leads' />:'';

        let grid = this.workElements(this.props.data);

        return (

          <DocumentTitle title={'Leads'}>
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
                activePage={this.props.pager.activePage}
                onSelect={this.handleSelect.bind(this)} />
            </div>

          </DocumentTitle>
        );
      }
}
