import React from 'react';
import DocumentTitle from 'react-document-title';

import Footer from "../../components/Layout/Footer";
import LoginForm from '../../components/Login/LoginForm';
import "./Login.scss";



export default class LoginPage extends React.Component {

  constructor(){
    super();
  }


  render() {

    const { location } = this.props;
    const containerStyle = {
        marginTop: "60px"
    };

    return (
      <DocumentTitle title={'Start'}>
        <div class="login">

          <div class="bs-docs-header" id="content"><div class="container">
            <img src="http://www.energia-galp.com/assets/img/logoGalpOn.png" />
          </div></div>


          <div class="container innerCont" style={containerStyle}>
            <div class="row">
              <div class="col-lg-12">

                <LoginForm/>

              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
