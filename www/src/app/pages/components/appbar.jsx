'use strict';

let React = require('react');
let Router = require('react-router');
let Link = Router.Link;

let Appbar = React.createClass({
	getInitialState() {
	    return {
	    	isMenuShow: false,
	    };
	},
	mixins: [ Router.Navigation ],
	_backToHome(){
		window.location.href = 'http://www.flipchinese.com/';
	},
	_toMyPack(){
        mixpanel.track("to my pack", {
          'by': "appbar",
        });
		this.transitionTo('my-pack');
	},
	_toLogin(){
        mixpanel.track("to login", {
          'by': "appbar",
        });
		this.transitionTo('sign-in');
	},
	_toAccount(){
        mixpanel.track("to account", {
          'by': "appbar",
        });
		this.transitionTo('setting');
	},
	_toLogout(){
        mixpanel.track("to logout", {
          'by': "appbar",
        });
		this.transitionTo('logout');
	},
	_closeMenu(){
		this.setState({
			isMenuShow: false,
		});
	},
	_showMenu(){
		let self = this;
        mixpanel.track("use option button", {
          'by': "appbar",
        });
		if(this.state.isMenuShow == false){
			setTimeout(function(){self._closeMenu()},2000);
		}
		this.setState({
			isMenuShow: !this.state.isMenuShow,
		});
		
	},
    render() {
    	let status = <p onClick={this._toLogin} className="appbar-login">Log in</p>
    	if(this.props.username){
    		status = <p>Welcome, <b style={{fontSize: 20}}>{this.props.username}</b></p>
    	}
        return (
            <div className="appbar">
	            <ul className="row middle-xs">
	            	<li className="col-xs-2 title" onClick={this._backToHome}>{this.props.title}</li>
	            	<li className="col-xs-6 nav row start-xs">
			            	{this.props.nav.map(function(item){
			            		return(
			            			<a className="nav-item col-xs-3 center-xs" href={item.route}>
			            				{item.title}
			            			</a>
			            		)
			            	})}
	            	</li>
	            	<li className="col-xs-4 status end-xs row middle-xs">
		            	{status}
		            	{
		            		this.props.isLogin?
			            	<div className="option" onClick={this._showMenu}>
								<div className="dropdown-menu-content" onMouseLeave={this._showMenu}>
								{
									this.state.isMenuShow?
									<div className="drop-menu" >
										<ul	className="center-xs">
											<li className="drop-menu-item" onClick={this._toAccount}>Account</li>
											<li className="drop-menu-item" onClick={this._toMyPack}>My Packs</li>
											<li className="drop-menu-item" onClick={this._toLogout}>Log out</li>
										</ul>
									</div>
									:
									null
								}
								</div>
								<i className="zmdi zmdi-more-vert"></i>
							</div>
							:
							null
		            	}
	            	</li>
	            </ul>
            </div>
        );
    }
});

module.exports = Appbar;