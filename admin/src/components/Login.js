import React from 'react';
import { connect } from "react-redux"

import * as actions from '../actions/authActions';

import { InputGroup, FormControl, ButtonGroup, Button, FormGroup, ControlLabel } from 'react-bootstrap';
import { browserHistory } from "react-router";
//import { Button, ButtonToolbar } from 'react-bootstrap';



@connect((store) => {
  return {
    user: store.auth.login,
    valid: store.auth.valid
  };
})

export default class LoginForm extends React.Component {

  constructor(){
    super();
    this.inputData = {
      email: '',
      password: ''
    };
  }

  componentWillMount() {
  }

  componentWillUnmount() {
    //LeadStore.removeListener("login", this.checkLogStatus.bind(this));
  }


  checkLogStatus() {
    //this.setState({valid:LeadStore.authCheck()});
  }

  handleChange(e) {
    let thisObj = this.inputData;
    thisObj[e.target.id] = e.target.value;
  }

  getValidationState(){
    if (this.props.valid === 'NOK' || this.props.valid !== '') return 'error';
    else return;
  }

  sendData() {
    if(!this.inputData.email && !this.inputData.password){this.props.valid=false; return false;}
    this.props.dispatch(actions.sendLogin(this.inputData.email,this.inputData.password));
    //this.setState({ thisName : e.target.value });
  }

  render() {


    return (


      <form>
          <h3>Please login here</h3>
          <ControlLabel>new registrations are not allowed</ControlLabel>
          <FormGroup  validationState={this.getValidationState()}>
           <InputGroup>
             <InputGroup.Addon>email</InputGroup.Addon>
             <FormControl
                type="text"
                id="email"
                onChange={this.handleChange.bind(this)}
                placeholder="your@email.com"
                />
           </InputGroup>
         </FormGroup>
         <FormGroup validationState={this.getValidationState()}>
          <InputGroup>
            <InputGroup.Addon>pass</InputGroup.Addon>
            <FormControl
              type="password"
              id="password"
              onChange={this.handleChange.bind(this)}
              placeholder="your password"
               />
          </InputGroup>
        </FormGroup>

         <ButtonGroup vertical block>
             <Button  bsStyle="success" onClick={()=>this.sendData()}>Sign in</Button>
         </ButtonGroup>
       </form>

    );
  }
}
