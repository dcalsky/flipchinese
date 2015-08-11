let React = require('react');
let Router = require('react-router');

let Login = React.createClass({
	getInitialState() {
	    return {
	    
	    };
	},
	render(){
		return(
			<div className="account">
				<section className="appbar">
					<ul className="appbar-list row">
						<li className="appbar-icon col-xs-2 start-xs" onClick={()=>{this.goBack()}}>
							<i className="zmdi zmdi-chevron-left"></i>
						</li>
						<li className="appbar-title col-xs-9 row center-xs middle-xs">
							<h4>Login</h4>
						</li>
					</ul>
				</section>
				<section>
					Account
				</section>
			</div>
		)
	}
});

module.exports = Login ;