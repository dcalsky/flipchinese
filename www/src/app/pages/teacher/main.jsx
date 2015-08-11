'use strict';

let React = require('react');
let Router = require('react-router');
let RouteHandler = Router.RouteHandler;
let LeftNav = require('../components/left-nav.jsx');

class Main extends React.Component {

  render() {
     let menuItems = [
     { type: "text", text: 'Teacher Page'},
      { type: "link", route: 'select-teacher', text: 'Task Select'},
      { type: "link", route: 'result-teacher', text: 'Task Result'},
      { type: "link", route: 'logout', text: 'Logout'},
    ];

      return (
        <div className="row">
          <section className="col-xs-2">
            <LeftNav menuItems={menuItems} />
          </section>
          <section className="col-xs-8 main">
            <RouteHandler />
          </section>
        </div>
      );
  }
}

module.exports = Main;
