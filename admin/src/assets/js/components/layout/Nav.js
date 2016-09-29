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

    const dashboardClass = location.pathname === "/" ? "active" : "";
    const campaignsClass = location.pathname.match(/^\/campaigns/) ? "active" : "";
    const usersClass = location.pathname.match(/^\/users/) ? "active" : "";
    const settingsClass = location.pathname.match(/^\/settings/) ? "active" : "";
    const navClass = collapsed ? "collapse" : "";

    return (
      <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" onClick={this.toggleCollapse.bind(this)} >
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
          </div>
          <div class={"navbar-collapse " + navClass} id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
              <li class={dashboardClass}>
                <IndexLink to="/" onClick={this.toggleCollapse.bind(this)}>Dashboard</IndexLink>
              </li>
              <li class={campaignsClass}>
                <Link to="campaigns" onClick={this.toggleCollapse.bind(this)}>Campaigns</Link>
              </li>
              <li class={usersClass}>
                <Link to="users" onClick={this.toggleCollapse.bind(this)}>Users</Link>
              </li>
              <li class={settingsClass}>
                <Link to="settings" onClick={this.toggleCollapse.bind(this)}>Settings</Link>
              </li>
              <li>
                <Link to="logout" onClick={this.toggleCollapse.bind(this)}>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}