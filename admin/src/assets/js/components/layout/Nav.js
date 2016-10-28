import React from "react";
import { IndexLink, Link } from "react-router";
import LeadStore from '../../stores/Leads';
import * as actions from '../../actions/LeadsActions';

//date Picker
import { DateField, MultiMonthView } from 'react-date-picker'


export default class Nav extends React.Component {
  constructor() {
    super()
    this.state = {
      collapsed: true,
      passDate: LeadStore.getDates('start'),
      nowDate: LeadStore.getDates('end')
    };
  }

  LeadStore

  toggleCollapse() {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  }

  onChangeStart (dateString, { dateMoment, timestamp }) {
    actions.updateDataSet({start:dateString,end:this.state.nowDate})
  }

  onChangeEnd (dateString, { dateMoment, timestamp }) {
    actions.updateDataSet({start:this.state.passDate,end:dateString})
  }

  render() {
    const { location } = this.props;
    const { collapsed } = this.state;
    let currentTile = 'Dashboard';

    const dashboardClass = location.pathname === "/" ? "active" : "";
    const campaignsClass = location.pathname.match(/campaigns/) ? "active" : "";
    currentTile = (campaignsClass!='')?'Manage your Campaigns':currentTile;

    const usersClass = location.pathname.match(/users/) ? "active" : "";
    currentTile = (usersClass!='')?'Manage Aplication User':currentTile;
    const settingsClass = location.pathname.match(/settings/) ? "active" : "";
    currentTile = (settingsClass!='')?'Change your Settings':currentTile;
    const leadsClass = location.pathname.match(/leads/) ? "active" : "";
    currentTile = (leadsClass!='')?'Check all your Customers':currentTile;
    const navClass = collapsed ? "collapse" : "";



    return (
      <div>
      <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
          <div class="navbar-header">


          <button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".navbar-collapse">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="/">{/*<i class="fa fa-google-wallet" aria-hidden="true"></i> followme*/}OnGlap</a>

          </div>
          <div class={"navbar-collapse " + navClass} id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
              <li class={dashboardClass}>
                <IndexLink to="/admin" onClick={this.toggleCollapse.bind(this)}>Dashboard</IndexLink>
              </li>
              <li class={campaignsClass}>
                <Link to="/admin/campaigns" onClick={this.toggleCollapse.bind(this)}>Campaigns</Link>
              </li>
              <li class={leadsClass}>
                <Link to="/admin/leads" onClick={this.toggleCollapse.bind(this)}>Customers</Link>
              </li>
              <li class={usersClass}>
                <Link to="/admin/users" onClick={this.toggleCollapse.bind(this)}>Users</Link>
              </li>
              <li class={settingsClass}>
                <Link to="/admin/settings" onClick={this.toggleCollapse.bind(this)}>Settings</Link>
              </li>
              <li>
                <Link to="/admin/logout" onClick={this.toggleCollapse.bind(this)}>Logout</Link>
              </li>
              <li>
                      <DateField
                        defaultValue={this.state.passDate}
                        dateFormat="YYYY-MM-DD"
                        onChange={this.onChangeStart.bind(this)}
                      />
              </li>
              <li>
                      <DateField
                        defaultValue={this.state.nowDate}
                        dateFormat="YYYY-MM-DD"
                        onChange={this.onChangeEnd.bind(this)}
                      />
              </li>
            </ul>
        </div>
      </nav>
      <div class="bs-docs-header" id="content"><div class="container"><h1><img src="http://www.energia-galp.com/assets/img/logoGalpOn.png" class="logo" />{currentTile}</h1><p class="subtitle">please see the sections below</p></div></div>

      </div>
    );
  }
}
