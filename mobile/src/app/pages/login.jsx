let React = require('react/addons');
let Router = require('react-router');

let cookie = require('cookie-cutter');
let ValidationMixin = require('react-validation-mixin');
let reqwest = require('reqwest');
let Joi = require('joi');

let Login = React.createClass({
	mixins: [ Router.Navigation , ValidationMixin , React.addons.LinkedStateMixin],
	validatorTypes:  {
        email: Joi.string().email().label('Email Address'),
        password: Joi.string().min(8).max(14).label('Password'),
	},
	getInitialState() {
	    return {
	   		user_id: null,
	   		password: null,
	   		loginCompleted: true,
	    };
	},
  	componentWillMount() {
	    if(cookie.get('user_id') && cookie.get('auth_token')){
	      this.goBack();
	    }
	    if(cookie.get('email')){
	      this.setState({
	        email: cookie.get('email'),
	      });
	    }
  	},
	renderHelpText(message) {
	    return (
	      <p style={{color: 'red', fontSize: 16}}>{message}</p>
	    );
	},
	_handleLogin(e){
		e.preventDefault();
	    if(!(this.isValid('email') && this.isValid('password'))){
	      return;
	    }
		this.setState({loginCompleted: false});
		let self = this;
	    reqwest({
	        url: 'http://api.flipchinese.com/api/v1/users/login'
	      , type: 'json'
	      , method: 'post'
	      , data: {
	      		email: self.state.email,
	      		password: self.state.password,
	      }
	      , success(resp) {
	      	console.log(resp)
	        cookie.set('user_id', resp.user.id);
	        cookie.set('auth_token', resp.user.auth_token);
	        cookie.set('username', resp.user.username);
	        cookie.set('role',resp.user.role);
	        if(self.state.remember){
	          cookie.set('email',self.state.email);
	        }else{
	          cookie.set('email','');
	        }
	        self.transitionTo('account');
	        self.setState({loginCompleted: true,});
	      }
	      , error(err){
      		console.log(err);
	      }
	    });
	},
	_turnToSign(){
		this.transitionTo('sign');
	},
	render(){
		return(
			<div className="main">
				<section className="appbar">
					<ul className="appbar-list row middle-xs">
						<li style={{cursor: 'pointer'}} className="appbar-icon col-xs-2 start-xs" onClick={()=>{this.goBack()}}>
							<i className="zmdi zmdi-chevron-left"></i>
						</li>
						<li className="appbar-title col-xs-9 row center-xs">
							<h4>Login</h4>
						</li>
					</ul>
				</section>
				<section style={{backgroundColor: '#fafafa', height: window.innerHeight-150, padding: '40px 0'}}>
					<form onSubmit={this._handleLogin} className="center-xs middle-xs">
						<div className="input-group">
							<i className="zmdi zmdi-email"></i>
							<input 
					            ref="email" 
					            className="input col-xs-12"
					            valueLink={this.linkState('email')}
					            onBlur={this.handleValidation('email')}
								placeholder="Email"
							/>
						</div>
						{this.getValidationMessages('email').map(this.renderHelpText)}
						<div className="input-group">
							<i className="zmdi zmdi-key"></i>
							<input 
					            ref="password" 
					            className="input col-xs-12"
					            type="password"
					            valueLink={this.linkState('password')}
					            onBlur={this.handleValidation('password')}
								placeholder="Password"
							/>
						</div>
						{this.getValidationMessages('password').map(this.renderHelpText)}
						<div className="col-xs-12 button-group">
							<button type="button" className="button-raised" onClick={this._turnToSign}>Register</button>
							<button type="submit" className="button-raised" disabled={this.state.loginCompleted ? false : true} style={{backgroundColor: '#02b81b', color: '#fff'}} >{this.state.loginCompleted ? 'login' : 'logining...'}</button>
						</div>
					</form>
				</section>
			</div>
		)
	}
});

module.exports = Login ;