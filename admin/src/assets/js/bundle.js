import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory, browserHistory } from "react-router";
//Store
import Store from './stores/Leads';

import Campaigns from "./pages/Campaigns";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import layout from "./pages/Layout";
import Flows from "./pages/Flows";
import Index from "./pages/Login";

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
      <Route path="flows" component={Flows}></Route>
      <Route path="users" component={Users}></Route>
      <Route path="settings" component={Settings}></Route>
    </Route>
  </Router>),
app);
