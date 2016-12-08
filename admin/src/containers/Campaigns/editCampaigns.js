import React from "react";
import { connect } from "react-redux"
import DocumentTitle from 'react-document-title';
import * as types from '../../actions/actionTypes';

import ActionsToolbar from '../../components/Layout/ActionsToolbar';
import * as actions from '../../actions/adminActions';

import {Col, InputGroup, FormControl, ButtonGroup, Button, FormGroup, ControlLabel } from 'react-bootstrap';

@connect((store) => {
  return{
      id:store.admin.campaigns._id,
      local:store.admin.campaigns.local,
      name:store.admin.campaigns.name,
      time:store.admin.campaigns.time
  };
})

export default class editCampaigns extends React.Component {

      constructor (props){
        console.log(props)
        super();
        this.state= {
          valid : '',
          campid : (props.params && props.params.campid)? props.params.campid : ''
        }
        //Get DAta
      }

      componentWillMount() {
        this.props.dispatch(actions.get('campaigns',this.state.campid));
        //this.props.dispatch(actions.get('campaigns',this.campid));
      }

      handleChange(e) {
          this.props.dispatch({
            type: types.UPDATE_FORM,
            what: 'campaigns',
            name: e.target.id,
            value:e.target.value
          });
       }


       getValidationState(){
         if (this.valid === 'NOK' || this.valid !== '') return 'error';
         else return;
       }

       sendData() {
         if(!this.props.name && !this.props.local){this.state.valid=false; return false;}
         this.props.dispatch(actions.set('campaigns',{name:this.props.name,local:this.props.local}, this.props.id));
         //this.setState({ thisName : e.target.value });
       }



      render() {

        return (
         <DocumentTitle title={'Edit Campaigns'}>
           <div class="container innerContBody">

             <Col xs={12} md={8} >
                 <form>
                     <FormGroup validationState={this.getValidationState()}>
                      <InputGroup>
                        <InputGroup.Addon>name</InputGroup.Addon>
                        <FormControl
                           type="text"
                           id="name"
                           value={this.props.name}
                           onChange={this.handleChange.bind(this)}
                           placeholder="campaign name"
                           />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup validationState={this.getValidationState()}>
                     <InputGroup>
                       <InputGroup.Addon>local</InputGroup.Addon>
                       <FormControl
                         type="text"
                         id="local"
                         value={this.props.local}
                         onChange={this.handleChange.bind(this)}
                         placeholder="local"
                          />
                     </InputGroup>
                   </FormGroup>

                    <ButtonGroup vertical block>
                        <Button  bsStyle="success" onClick={()=>this.sendData()}>Send</Button>
                    </ButtonGroup>
                  </form>
                  </Col>
               <Col xs={6} md={4} />
           </div>
         </DocumentTitle>
        );
      }
}
