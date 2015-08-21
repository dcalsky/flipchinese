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
        password: Joi.string().required().min(8).max(14).label('Password'),
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
	componentWillMount() {
	    if(cookie.get('user_id') && cookie.get('auth_token')){
	      this.transitionTo('/main/my-pack');
	    }
	    if(cookie.get('email')){
	      this.setState({
	        email: cookie.get('email'),
	      });
	    }
	},
	_handleRegister(e){
		e.preventDefault();
	    if(!this.isValid('email') || !this.isValid('username') || !this.isValid('password') || !this.isValid('verifyPassword') || !this.state.password || !this.state.email || !this.state.username || !this.state.verifyPassword || this.state.password.length < 8 || this.state.username < 6 || this.state.verifyPassword < 8){
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
	        self.transitionTo('/main/account');
	        self.setState({signCompleted: true,});
	      }
	      , error(err){
      		console.log(err);
      		self.setState({signCompleted: true,});
	      }
	    });
	},
	_turnToLogin(){
		this.transitionTo('/main/login');
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
					<ul className="appbar-list row middle-xs">
						<li className="appbar-icon col-xs-1 start-xs" style={{cursor: 'pointer'}} onClick={()=>{this.goBack()}}>
							<i className="zmdi zmdi-chevron-left"></i>
						</li>
						<li className="appbar-title col-xs-10 row center-xs">
							<h4>Register</h4>
						</li>
					</ul>
				</section>
				<section style={{backgroundColor: '#fafafa', height: window.innerHeight-150, padding: '40px 0'}}>
					<form onSubmit={this._handleRegister} className="center-xs middle-xs">
						<img src="./images/logo_blue.png" style={{height: 80, width: 80}} />
						<h4 style={{fontSize: '1.6em', color: '#1967d2', marginBottom: 10}}>Flip Chinese</h4>
						<div className="input-group">
							<i className="zmdi zmdi-account-circle"></i>
							<input 
					            ref="username" 
					            className="input col-xs"
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
					            className="input col-xs"
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
					            className="input col-xs"
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
					            className="input col-xs"
					            valueLink={this.linkState('verifyPassword')}
					            onBlur={this.handleValidation('verifyPassword')}
								placeholder="Enter Password again" 
							/>
						</div>
						{this.getValidationMessages('verifyPassword').map(this.renderHelpText)}
						<div className="button-group">
							<button type="submit" className="button-raised" disabled={this.state.signCompleted ? false : true} style={{backgroundColor: '#ff3b77', color: '#fff'}} >{this.state.signCompleted ? 'Register' : 'Signing...'}</button>
							<button type="button" className="button-raised" style={{backgroundColor: '#1967d2'}} onClick={this._turnToLogin}>Cancel</button>
						</div>
					</form>
				</section>
			</div>
		)
	}
});

module.exports = Login ;