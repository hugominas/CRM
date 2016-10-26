import React from "react";
import { IndexLink, Link } from "react-router";

export default class Nav extends React.Component {
  constructor() {
    super()
    this.state = {
      collapsed: true,
    };
  }

  toggleCollapse() {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  }

  render() {
    const { location } = this.props;
    const { collapsed } = this.state;
    let currentTile = 'Dashboard';

    const dashboardClass = location.pathname === "/" ? "active" : "";
    const campaignsClass = location.pathname.match(/campaigns/) ? "active" : "";
    currentTile = (campaignsClass!='')?'Manage your Campaigns':currentTile;
    const flowsClass = location.pathname.match(/flows/) ? "active" : "";
    currentTile = (flowsClass!='')?'Administer your Flows':currentTile;
    const usersClass = location.pathname.match(/users/) ? "active" : "";
    currentTile = (usersClass!='')?'Manage Aplication User':currentTile;
    const settingsClass = location.pathname.match(/settings/) ? "active" : "";
    currentTile = (settingsClass!='')?'Change your Settings':currentTile;
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
          <a class="navbar-brand" href="/"><i class="fa fa-google-wallet" aria-hidden="true"></i> followme</a>

          </div>
          <div class={"navbar-collapse " + navClass} id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
              <li class={dashboardClass}>
                <IndexLink to="/admin" onClick={this.toggleCollapse.bind(this)}>Dashboard</IndexLink>
              </li>
              <li class={campaignsClass}>
                <Link to="/admin/campaigns" onClick={this.toggleCollapse.bind(this)}>Campaigns</Link>
              </li>
              <li class={usersClass}>
                <Link to="/admin/users" onClick={this.toggleCollapse.bind(this)}>Users</Link>
              </li>
              <li class={flowsClass}>
                <Link to="/admin/flows" onClick={this.toggleCollapse.bind(this)}>Flows</Link>
              </li>
              <li class={settingsClass}>
                <Link to="/admin/settings" onClick={this.toggleCollapse.bind(this)}>Settings</Link>
              </li>
              <li>
                <Link to="/admin/logout" onClick={this.toggleCollapse.bind(this)}>Logout</Link>
              </li>
            </ul>
        </div>
      </nav>
      <div class="bs-docs-header" id="content"><div class="container"><h1>{currentTile}</h1><p class="subtitle">please see the sections below</p></div></div>

      </div>
    );
  }
}
