import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import Campaigns from "./pages/Campaigns";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";

const app = document.getElementById('app');

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={Dashboard}></IndexRoute>
      <Route path="campaigns" component={Campaigns}></Route>
      <Route path="flows" component={Flows}></Route>
      <Route path="users" component={Users}></Route>
      <Route path="settings" component={Settings}></Route>
    </Route>
  </Router>,
app);
