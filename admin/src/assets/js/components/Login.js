import React from 'react';
import * as actions from '../actions/LeadsActions';
import LeadStore from '../stores/Leads';
import { InputGroup, FormControl, ButtonGroup, Button, FormGroup, ControlLabel } from 'react-bootstrap';
import { browserHistory } from "react-router";
//import { Button, ButtonToolbar } from 'react-bootstrap';

export default class LoginForm extends React.Component {

  constructor(){
    super();
    this.state = {
      valid:LeadStore.authCheck()
    };
  }

  componentWillMount() {
    LeadStore.on("login", this.checkLogStatus.bind(this));
  }

  componentWillUnmount() {
    LeadStore.removeListener("login", this.checkLogStatus.bind(this));
  }


  checkLogStatus() {
    this.setState({valid:LeadStore.authCheck()});
  }

  handleChange(e) {
    let thisObj = this.state;
    thisObj[e.target.id] = e.target.value;
    this.setState(thisObj);
  }

  getValidationState(){
    if (this.state.valid =='OK') { window.location="#/admin"; return 'success';}
    else if (this.state.valid === 'NOK' || this.state.valid !== '') return 'error';
    else return;
  }

  sendData() {
    if(!this.state.email && !this.state.password){this.setState({valid:false}); return false;}
    actions.sendLogin(this.state.email,this.state.password);
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
