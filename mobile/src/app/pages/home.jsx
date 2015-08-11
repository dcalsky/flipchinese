
let React = require('react');
let Router = require('react-router');

let Home = React.createClass({
	mixins: [Router.Navigation],
    render() {
        return (
            <div>
            	Hello Mobile!
            </div>
        );
    }
});

module.exports = Home;