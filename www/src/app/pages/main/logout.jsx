'use strict';

let storage = require('react-storage');
let cookie = require('cookie-cutter');

let React = require('react') ;
let Router = require('react-router') ;

let Logout = React.createClass({
  mixins: [ Router.Navigation ],
  componentWillMount () {
    mixpanel.track("log out");
    cookie.set('user_id','');
    cookie.set('auth_token','');
    cookie.set('role','');
    cookie.set('username','');
    cookie.set('fromCart','');
    storage.clear();
    this.transitionTo('sign-in');
  },
  render(){
    return null;
  }
});

module.exports = Logout;
