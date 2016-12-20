import React from "react";
import { connect } from "react-redux"
import DocumentTitle from 'react-document-title';

import tableEditDelete from "../../components/Layout/tableEditDelete";
import ActionsToolbar from '../../components/Layout/ActionsToolbar';

import * as types from '../../actions/actionTypes';
import * as actions from '../../actions/adminActions';
import CustomRowComponent from '../../components/Layout/customRow';

import {Col, Pagination } from 'react-bootstrap';

import "./edit.scss";

@connect((store) => {
  return {
    campid: (store.campid)?store.campid:'',
    data : store.admin.data.leads,
    pager: store.admin.pager,
    expanded: store.admin.expanded
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

      exportDataURL(){
        this.props.dispatch(actions.exportData('leads',this.props.params.campid,{... this.props.pager},true));
      }

      handleSelect (pagenum){
        pagenum = pagenum-1;
        this.props.dispatch({
          type: types.UPDATE_PAGER,
          pager: {... this.props.pager, page:pagenum}
        });
        this.props.dispatch(actions.get('leads','',{... this.props.pager, page:pagenum}));
      }


      expandElement(_id){
        this.props.dispatch({
          type: types.UPDATE_SELECTED,
          id: _id
        });
      }


      workElements (data){
        let a = 0;
        return data.map((ele)=>{
            a++;
            return <CustomRowComponent key={ele._id+a}
            campid={this.props.campid}
            element="leads"
            expanded={(this.props.expanded==ele._id)}
            expandElement={this.expandElement.bind(this)}
            deleteElement={this.deleteElement.bind(this)}
            {... ele} />
        })
      }

      render() {

        let button = (typeof this.props.data !== 'undefined')?<ActionsToolbar data='leads' exportData={()=>this.exportDataURL().bind(this)} />:'';

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
                activePage={this.props.pager.page}
                onSelect={this.handleSelect.bind(this)} />
            </div>

          </DocumentTitle>
        );
      }
}
