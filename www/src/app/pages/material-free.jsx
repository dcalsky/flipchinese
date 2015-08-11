'use strict';

let React = require('react');
let Router = require('react-router');
let RouteHandler = Router.RouteHandler;


let Material = React.createClass({
    mixins: [Router.Navigation, Router.State],
    componentWillUpdate(nextProps, nextState) {
        console.log(nextProps)
    },
    _back(){
        this.goBack();
    },
    render() {
        return (
         <RouteHandler/>
        );
    }
});

module.exports = Material;
