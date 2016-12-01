import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import Campaigns from "./containers/Campaigns";
import Leads from "./containers/Leads";
import LeadsEdit from "./containers/Leads/edit";
import EditCampaigns from "./containers/Campaigns/editCampaigns";

import Users from "./containers/Users";
import Settings from "./containers/Settings";
import Dashboard from "./containers/Dashboard";
import layout from "./containers/Layout";
import Index from "./containers/Login";
import NotFoundPage from "./containers/NotFoundPage";


export default (
  <Router>
    <Route path="/" component={Index}></Route>
      <Route path="admin" component={layout}>
        <IndexRoute component={Dashboard}></IndexRoute>

        <Route path="campaigns" component={Campaigns}></Route>
        <Route path="campaigns/add" component={EditCampaigns}></Route>
        <Route path="campaigns/:campid/edit/:leadid" component={LeadsEdit}></Route>
        <Route path="campaigns/edit/:campid" component={EditCampaigns}></Route>
        <Route path="campaigns/:campid" component={Leads}></Route>

        <Route path="leads" component={Leads}></Route>
        <Route path="leads/add" component={Leads}></Route>
        <Route path="leads/:leadid" component={LeadsEdit}></Route>
        <Route path="leads/edit/:leadid" component={Leads}></Route>

        <Route path="users" component={Users}></Route>
        <Route path="users/add" component={Users}></Route>
        <Route path="users/:campid/:userid" component={Users}></Route>
        <Route path="users/:userid" component={Users}></Route>

        <Route path="settings" component={Settings}></Route>

        <Route path="*" component={NotFoundPage}></Route>

      </Route>
    </Router>
);
