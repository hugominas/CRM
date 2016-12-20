import React from "react";
import { connect } from "react-redux"
import DocumentTitle from 'react-document-title';
import * as types from '../../actions/actionTypes';

import ActionsToolbar from '../../components/Layout/ActionsToolbar';
import * as actions from '../../actions/adminActions';

import {Col, InputGroup, FormControl, ButtonGroup, Button, FormGroup, ControlLabel } from 'react-bootstrap';

@connect((store) => {
  return{
      id:store.admin.users._id,
      email:store.admin.users.email,
      name:store.admin.users.name,
      password:store.admin.users.password,
      time:store.admin.users.time
  };
})

export default class editUsers extends React.Component {

      constructor (props){
        super();
        this.state= {
          valid : '',
          userid : (props.params && props.params.userid)? props.params.userid : ''
        }
        //Get DAta
      }

      componentWillMount() {
        this.props.dispatch(actions.get('users',this.state.userid));
        //this.props.dispatch(actions.get('campaigns',this.campid));
      }

      handleChange(e) {

          this.props.dispatch({
            type: types.UPDATE_FORM,
            what: 'users',
            name: e.target.id,
            value:e.target.value
          });
       }


       getValidationState(){
         if (this.valid === 'NOK' || this.valid !== '') return 'error';
         else return;
       }

       sendData() {
         console.log(this.props.name , this.props.email  , this.props.password)
         if(!this.props.name && !this.props.email  && !this.props.password){this.state.valid=false; return false;}
         this.props.dispatch(actions.set('users',{name:this.props.name,email:this.props.email,password:this.props.password}, this.props.id));
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
                       <InputGroup.Addon>email</InputGroup.Addon>
                       <FormControl
                         type="email"
                         id="email"
                         value={this.props.email}
                         onChange={this.handleChange.bind(this)}
                         placeholder="email"
                          />
                     </InputGroup>
                   </FormGroup>

                   <FormGroup validationState={this.getValidationState()}>
                    <InputGroup>
                      <InputGroup.Addon>password</InputGroup.Addon>
                      <FormControl
                        type="password"
                        id="password"
                        value={this.props.password}
                        onChange={this.handleChange.bind(this)}
                        placeholder="password"
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
