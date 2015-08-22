'use strict'
let React = require('react');
let Router = require('react-router');
let RouteHandler = Router.RouteHandler;
let StateMixin = Router.State;

let Material = require('../components/material.jsx');

let Materials = React.createClass({
    mixins: [StateMixin],
    render(){
        return <Material id={this.getParams().id} />
    }
});

module.exports = Materials;