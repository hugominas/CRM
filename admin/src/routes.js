import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import Campaigns from "./components/Campaigns";
import Leads from "./components/Leads";
import LeadsEdit from "./components/Leads/edit";
import EditCampaigns from "./components/Campaigns/editCampaigns";

import Users from "./components/Users";
import Settings from "./components/Settings";
import Dashboard from "./components/Dashboard";
import layout from "./components/Layout";
import Index from "./components/Login";
import NotFoundPage from "./components/NotFoundPage";


export default (
  <Router>
    <Route path="/" component={Index}></Route>
      <Route path="admin" component={layout}>
        <IndexRoute component={Dashboard}></IndexRoute>

        <Route path="campaigns" component={Campaigns}></Route>
        <Route path="campaigns/:campid/edit/:leadid" component={LeadsEdit}></Route>
        <Route path="campaigns/edit/:campid" component={EditCampaigns}></Route>
        <Route path="campaigns/:campid" component={Leads}></Route>

        <Route path="leads" component={Leads}></Route>
        <Route path="leads/:leadid" component={LeadsEdit}></Route>
        <Route path="leads/edit/:leadid" component={Leads}></Route>

        <Route path="users" component={Users}></Route>
        <Route path="users/:campid/:userid" component={Users}></Route>
        <Route path="users/:userid" component={Users}></Route>

        <Route path="settings" component={Settings}></Route>

        <Route path="*" component={NotFoundPage}></Route>

      </Route>
    </Router>
);
