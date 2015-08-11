'use strict';

let cookie = require('cookie-cutter');

let React = require('react/addons');
let Router = require('react-router');

let mui = require('material-ui');
let extend = mui.Utils.Extend;
let FullWidthSection = require('../components/full-width-section.jsx');
let {Spacing, Typography, Colors} = mui.Styles;
let {Snackbar,TextField,RaisedButton,Checkbox,FontIcon,ClearFix} = mui ;
let Link = Router.Link ;

let checkStatus = require('../utils/check-status.js');
let ValidationMixin = require('react-validation-mixin');
let Joi = require('joi');

let SignUp = React.createClass({
  mixins: [ Router.Navigation , ValidationMixin , React.addons.LinkedStateMixin],
  validatorTypes:  {
        username: Joi.string().required().min(4).max(14).label('Username'),
        email: Joi.string().required().email().label('Email Address'),
        password: Joi.string().required().min(6).max(14).label('Password'),
        verifyPassword: Joi.valid(Joi.ref('password')).required().label('Password Confirmation'),
  },
  getInitialState(){
    return {
        username: null,
        email: null,
        password: null,
        verifyPassword: null,
        completed: true,
    };
  },
  componentWillMount() {
    if(cookie.get('user_id') && cookie.get('auth_token')){
      this.transitionTo('/main/my-pack');
    }
    mixpanel.track("open", {
      'where': "sign-up",
    });
  },
  getStyles() {
    let styles = {
      root: {
        paddingTop: Spacing.desktopKeylineIncrement
      },
      fullWidthSection: {
        maxWidth: '650px',
        margin: '0 auto'
      },
      headline: {
        fontSize: '36px',
        lineHeight: '32px',
        paddingTop: '16px',
        marginBottom: '12px',
        letterSpacing: '0',
        fontWeight: Typography.fontWeightNormal,
        color: Typography.textDarkBlack
      },
      title: {
        fontSize: '20px',
        lineHeight: '28px',
        paddingTop: '19px',
        marginBottom: '13px',
        letterSpacing: '0',
        fontWeight: Typography.fontWeightMedium,
        color: '#f00'//Typography.textDarkBlack
      },
      codeExample: {
        backgroundColor: this.context.muiTheme.palette.canvasColor,
        marginBottom: '32px'
      },
      textfield: {
        width: '100%'
      },
      buttonIcon: {
        color: Typography.textFullWhite
      },
      buttonLabel: {
        padding: '0px 16px 0px 8px'
      },
      buttonNormal: {
        margin: '10px 10px 5px 0px',
      },
      flatButtonIcon: {
        height: '100%',
        display: 'inline-block',
        verticalAlign: 'middle',
        float: 'left',
        paddingLeft: '12px',
        lineHeight: '36px',
        color: Colors.cyan500
      },
      checkboxNormal: {
        margin: '5px 10px 5px 0px'
      },
      helpBlock: {
        display: 'block',
        marginTop: '5px',
        marginBottom: '5px',
        color: 'red',
      }
    };
    styles.buttonIcon = extend(styles.flatButtonIcon, styles.buttonIcon);
    return styles ;
  },
  handleSubmit(e) {
    let self = this;
    self.setState({completed: false,});
    e.preventDefault();
    if(!(this.isValid('email') && this.isValid('username') && this.isValid('password') && this.isValid('verifyPassword'))){
      this.setState({
        completed: true,
      }); 
      return
    }
    fetch('http://api.flipchinese.com/api/v1/users/signup', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user:{
        username: self.state.username,
        password: self.state.password,
        email: self.state.email,
      }})
    })
    .then(checkStatus)
    .then(function(data) {
        mixpanel.track("register", {
          'where': "sign-up",
        });
        mixpanel.identify(data.user.id);
        cookie.set('user_id', data.user.id);
        cookie.set('auth_token', data.user.auth_token);
        cookie.set('username', data.user.username);
        cookie.set('role',data.user.role);
        cookie.set('email',self.state.email);
        self.setState({completed: true,});
        
        if(cookie.get('fromCart') == 'true'){
          self.transitionTo('/main/cart');
        }else{
          self.transitionTo('/main/my-pack');
        }
    })
    .catch(function(error) {
          self.setState({
            completed: true,
          });
          self.refs.snackbar.show();
      });

  },
  contextTypes: {
    muiTheme: React.PropTypes.object
  },
  renderHelpText(message) {
    return (
      <span style={this.getStyles().helpBlock}>{message}</span>
    );
  },
  _handleAction(e){
    this.refs.snackbar.dismiss();
  },
  render() {
    let styles = this.getStyles();

    return (
      <div style={styles.root}>
        <FullWidthSection  style={styles.fullWidthSection}>
          <h1 style={styles.headline}>Sign Up</h1>
          <p>
          <form onSubmit={this.handleSubmit}>
            <TextField 
              style={styles.textfield}
              floatingLabelText="Username" 
              ref="username" 
              valueLink={this.linkState('username')}
              onBlur={this.handleValidation('username')}
            />
            {this.getValidationMessages('username').map(this.renderHelpText)}
            <TextField 
              style={styles.textfield}
              floatingLabelText="Email" 
              ref="email" 
              valueLink={this.linkState('email')}
              onBlur={this.handleValidation('email')}
            />
            {this.getValidationMessages('email').map(this.renderHelpText)}
            <br/>
            <TextField 
              type="password" 
              style={styles.textfield} 
              floatingLabelText="Password(at least 8 characters)" 
              ref="password" 
              valueLink={this.linkState('password')} 
              onBlur={this.handleValidation('password')}
            />
            {this.getValidationMessages('password').map(this.renderHelpText)}
            <TextField 
              type="password" 
              style={styles.textfield} 
              floatingLabelText="Verify Password" 
              ref="verifyPassword" 
              valueLink={this.linkState('verifyPassword')} 
              onBlur={this.handleValidation('verifyPassword')}
            />
            {this.getValidationMessages('verifyPassword').map(this.renderHelpText)}
            <br/>
            <RaisedButton type="submit" style={styles.buttonNormal} disabled={!this.state.completed} primary={true} label="Register" labelStyle={styles.buttonLabel}>
              <FontIcon style={styles.buttonIcon} className="zmdi zmdi-flag"/>
            </RaisedButton>
            <Link to="sign-in">
              <RaisedButton style={styles.buttonNormal} label="RETURN TO SIGN IN" secondary={true}  />
            </Link>
            <Snackbar
              ref="snackbar"
              message="email or username is repeated !"
              action="undo"
              onActionTouchTap={this._handleAction}
            />
          </form>
          </p>
        </FullWidthSection>
      </div>
    );
  }

})



module.exports = SignUp;
