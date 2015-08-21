let React = require('react');
let Router = require('react-router');

let Appbar = React.createClass({
	mixins: [Router.Navigation],
	getInitialState() {
	    return {
	    	
	    };
	},
	render(){
		return(
			<div className="appbar">
				<ul className="appbar-list row">
					<li className="appbar-icon col-xs-1 start-xs">
						<i className="zmdi zmdi-chevron-left"></i>
					</li>
					<li className="appbar-title col-xs-10 row center-xs middle-xs">
						<h4>Fast</h4>
						<i className="zmdi zmdi-caret-down bottom-xs"></i>
					</li>
					<li className="col-xs-1 end-xs"></li>
				</ul>
			</div>
		);
	}
});

module.exports = Appbar ;