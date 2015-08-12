let React = require('react');
let Router = require('react-router');

let Footer = React.createClass({
	mixins: [Router.Navigation, Router.State],
	getInitialState() {
	    return {
	    	
	    };
	},
	_turnTo(route){
		this.transitionTo(route);
	},
	render(){
		return(
			<section className="footer">
				<ul className="footer-list row">
					<li className={this.isActive('fast') ? "col-xs-4 center-xs active" : "col-xs-4 center-xs"} onClick={()=>{this._turnTo('fast')}}>
						<i className="zmdi zmdi-codepen"></i>
						<h4>fast</h4>
					</li>
					<li className={this.isActive('focus') ? "col-xs-4 center-xs active" : "col-xs-4 center-xs"} onClick={()=>{this._turnTo('focus')}}>
						<i className="zmdi zmdi-case"></i>
						<h4>focus</h4>
					</li>
					<li className={this.isActive('account') ? "col-xs-4 center-xs active" : "col-xs-4 center-xs"} onClick={()=>{this._turnTo('account')}}>
						<i className="zmdi zmdi-account-circle"></i>
						<h4>account</h4>
					</li>
				</ul>
			</section>
		);
	}
});

module.exports = Footer ;