import React from 'react';
import * as actions from '../actions/LeadsActions';
//import { Button, ButtonToolbar } from 'react-bootstrap';

export default class Logout extends React.Component {

  constructor(){
    super();
    this.state = {};
    actions.sendLogout();
  }

  render() {
  }
}
