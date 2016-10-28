import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory, browserHistory } from "react-router";
//Store
import Store from './stores/Leads';

import Campaigns from "./pages/Campaigns";
import Leads from "./pages/Leads";
import EditCampaigns from "./pages/editCampaigns";

import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import layout from "./pages/Layout";
import Flows from "./pages/Flows";
import Index from "./pages/Login";
import Logout from "./pages/Logout";

const app = document.getElementById('app');


const authCheck = function(nextState, replace) {
  if(Store.authCheck() == false)replace({ pathname: '/', state: { nextPathname: nextState.location.pathname }  })
}

Store.on("login", authCheck);

ReactDOM.render(
  (<Router history={hashHistory}>
    <Route path="/" component={Index}></Route>
    <Route path="/admin" component={layout} onEnter={authCheck}>
      <IndexRoute component={Dashboard}></IndexRoute>

      <Route path="campaigns" component={Campaigns}></Route>
      <Route path="campaigns/edit/:campid" component={EditCampaigns}></Route>

      <Route path="leads" component={Leads}></Route>
      <Route path="leads/:campid" component={Leads}></Route>
      <Route path="leads/edit/:leadid" component={Leads}></Route>

      <Route path="users" component={Users}></Route>
      <Route path="users/:campid/:userid" component={Users}></Route>
      <Route path="users/:userid" component={Users}></Route>

      <Route path="settings" component={Settings}></Route>

      <Route path="logout" component={Logout}></Route>
    </Route>
  </Router>),
app);
