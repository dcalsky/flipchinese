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
						<i className="zmdi zmdi-apps"></i>
						<h4>Fast</h4>
					</li>
					<li className={this.isActive('focus') ? "col-xs-4 center-xs active" : "col-xs-4 center-xs"} onClick={()=>{this._turnTo('focus')}}>
						<i className="zmdi zmdi-compass"></i>
						<h4>Find Packs</h4>
					</li>
					<li className={this.isActive('my-pack') ? "col-xs-4 center-xs active" : "col-xs-4 center-xs"} onClick={()=>{this._turnTo('my-pack')}}>
						<i className="zmdi zmdi-case-check"></i>
						<h4>My Packs</h4>
					</li>
				</ul>
			</section>
		);
	}
});

module.exports = Footer ;