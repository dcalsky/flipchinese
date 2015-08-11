let React = require('react');
let Router = require('react-router');

let Account = React.createClass({
	getInitialState() {
	    return {
	    
	    };
	},
	render(){
		return(
			<div className="account">
				<section className="appbar">
					<ul className="appbar-list row">
						<li className="appbar-icon col-xs-2 start-xs">
							<i className="zmdi zmdi-chevron-left"></i>
						</li>
						<li className="appbar-title col-xs-9 row center-xs middle-xs">
							<h4>Account</h4>
						</li>
						<li className="col-xs-1 end-xs"></li>
					</ul>
				</section>
				<section>
					Account
				</section>
			</div>
		)
	}
});

module.exports = Account ;