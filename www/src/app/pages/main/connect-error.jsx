'use strict';

let React = require('react/addons');

let mui = require('material-ui');
let {  RaisedButton } = mui;

let Error = require('../components/error.jsx');

let MainStyle = require('../styles/main-style.jsx');

let ConnectError = React.createClass({
    back(){
        window.history.go(-1);
    },
    render() {
        return (
            <div>
                <Error show={true} desc="Network connection error..." />
                <br />
                <div style={{textAlign: 'center'}}>
                <RaisedButton  primary={true} onClick={this.back} label="Back" />
                </div>
            </div>
        );
    }
});

module.exports = ConnectError;
