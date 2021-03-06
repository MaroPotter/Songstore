import React, { Component } from 'react';
import logo from '../logo.png';
import title from '../title2.png';
import './Main.css';

class NavigationBar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark p-0 shadow navbarr">
          <a>
              <img src={logo} className="logo" alt="Songstore's logo"/>
          </a>
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="#songList"
          target="_self"
          rel="noopener noreferrer"
        >
        <img src={title} className="title" alt="Songstore's title"/>
        </a>


            <button className="user"><span id="account">User: {this.props.account}</span></button>


      </nav>
    );
  }
}

export default NavigationBar;