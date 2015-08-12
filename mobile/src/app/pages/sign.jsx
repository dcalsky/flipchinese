let React = require('react/addons');
let Router = require('react-router');

let cookie = require('cookie-cutter');
let reqwest = require('reqwest');
let ValidationMixin = require('react-validation-mixin');
let Joi = require('joi');

let Login = React.createClass({
	mixins: [ Router.Navigation , ValidationMixin , React.addons.LinkedStateMixin],
	validatorTypes:  {
        username: Joi.string().required().min(4).max(14).label('Username'),
        email: Joi.string().required().email().label('Email Address'),
        password: Joi.string().required().min(6).max(14).label('Password'),
        verifyPassword: Joi.valid(Joi.ref('password')).required().label('Password Confirmation'),
	},
	getInitialState() {
	    return {
	    	username: null,
	   		email: null,
	   		password: null,
	   		verifyPassword: null,
	   		signCompleted: true,
	    };
	},
	_handleRegister(e){
		e.preventDefault();
	    if(!(this.isValid('email') && this.isValid('username') && this.isValid('password') && this.isValid('verifyPassword'))){
	      return
	    }
		this.setState({signCompleted: false});
		let self = this;
	    reqwest({
	        url: 'http://api.flipchinese.com/api/v1/users/signup'
	      , type: 'json'
	      , method: 'post'
	      , data: {user:{
		        username: self.state.username,
		        password: self.state.password,
		        email: self.state.email,
	      	}
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
	        self.setState({signCompleted: true,});
	      }
	      , error(err){
      		console.log(err);
	      }
	    });
	},
	_turnToLogin(){
		this.transitionTo('login');
	},
	renderHelpText(message) {
	    return (
	      <p style={{color: 'red', fontSize: 14, fontWeight: 400}}>{message}</p>
	    );
	},
	render(){
		return(
			<div className="main">
				<section className="appbar">
					<ul className="appbar-list row">
						<li className="appbar-icon col-xs-2 start-xs" onClick={()=>{this.goBack()}}>
							<i className="zmdi zmdi-chevron-left"></i>
						</li>
						<li className="appbar-title col-xs-9 row center-xs middle-xs">
							<h4>Register</h4>
						</li>
					</ul>
				</section>
				<section style={{backgroundColor: '#fafafa', height: window.innerHeight-150, padding: '40px 0'}}>
					<form onSubmit={this._handleRegister} className="center-xs middle-xs">
						<div className="input-group">
							<i className="zmdi zmdi-account-circle"></i>
							<input 
					            ref="username" 
					            className="input col-xs-12"
					            valueLink={this.linkState('username')}
					            onBlur={this.handleValidation('username')}
								placeholder="Username"
							/>
						</div>
						{this.getValidationMessages('username').map(this.renderHelpText)}
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
					            type="password"
					            className="input col-xs-12"
					            valueLink={this.linkState('password')}
					            onBlur={this.handleValidation('password')}
								placeholder="Password"
							/>
						</div>
						{this.getValidationMessages('password').map(this.renderHelpText)}
						<div className="input-group">
							<i className="zmdi zmdi-key"></i>
							<input 
					            ref="verifyPassword" 
					            type="password"
					            className="input col-xs-12"
					            valueLink={this.linkState('verifyPassword')}
					            onBlur={this.handleValidation('verifyPassword')}
								placeholder="Enter Password again" 
							/>
						</div>
						{this.getValidationMessages('verifyPassword').map(this.renderHelpText)}
						<div className="button-group">
							<button type="button" className="button-raised" onClick={this._turnToLogin}>Login</button>
							<button type="submit" className="button-raised" disabled={this.state.signCompleted ? false : true} style={{backgroundColor: '#02b81b', color: '#fff'}} >{this.state.signCompleted ? 'Register' : 'Signing...'}</button>
						</div>
					</form>
				</section>
			</div>
		)
	}
});

module.exports = Login ;