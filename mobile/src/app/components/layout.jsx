let React = require('react');
let Router = require('react-router');
let RouteHandler = Router.RouteHandler;
let Footer = require('./footer.jsx');

let Layout = React.createClass({
	render(){
		return(
			<div className="app">
				<RouteHandler />
				<Footer />
			</div>
		);
	}
});

module.exports = Layout;