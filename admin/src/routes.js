import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import Campaigns from "./containers/Campaigns";
import Leads from "./containers/Leads";
import EditCampaigns from "./containers/editCampaigns";

import Users from "./containers/Users";
import Settings from "./containers/Settings";
import Dashboard from "./containers/Dashboard";
import layout from "./containers/Layout";
import Index from "./containers/Login";
import NotFoundPage from "./containers/NotFoundPage";



const authCheck = function(nextState, replace) {
  //if(Store.authCheck() == false)replace({ pathname: '/', state: { nextPathname: nextState.location.pathname }  })
}


export default (
  <Router>
    <Route path="/" component={Index}></Route>
      <Route path="admin" component={layout} onEnter={authCheck}>
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
        
        <Route path="*" component={NotFoundPage}></Route>

      </Route>
    </Router>
);
