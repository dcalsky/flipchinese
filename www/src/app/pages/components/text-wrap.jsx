'use strict';

let React = require('react/addons');

let TextWrap = React.createClass({
    render() {
        return (
            <div dangerouslySetInnerHTML={{__html: this.props.text}} style={{fontSize:'14px', padding: "0px 12px"}} />
        )
    }
});

module.exports = TextWrap;
