'use strict';

let cookie = require('cookie-cutter');

let React = require('react/addons');
let Router = require('react-router');

let mui = require('material-ui');
let extend = mui.Utils.Extend;
let FullWidthSection = require('../components/full-width-section.jsx');
let {Spacing, Typography, Colors} = mui.Styles;
let {Snackbar,TextField,RaisedButton,Checkbox,FontIcon} = mui ;
let Link = Router.Link ;

let checkStatus = require('../utils/check-status.js');
let ValidationMixin = require('react-validation-mixin');
let Joi = require('joi');

let SignIn = React.createClass({
  mixins: [ Router.Navigation , ValidationMixin , React.addons.LinkedStateMixin],
  validatorTypes:  {
        email: Joi.string().email().label('Email Address'),
        password: Joi.string().min(8).max(14).label('Password'),
  },
  getInitialState(){
    return {
        email: null,
        password: null,
        completed: true,
        remember: true,
    };
  },
  componentWillMount() {
    if(cookie.get('user_id') && cookie.get('auth_token')){
      this.transitionTo('/main/my-pack');
    }
    console.log(cookie.get('email'))
    if(cookie.get('email_remember')){
      this.setState({
        email: cookie.get('email_remember'),
      });
    }
    mixpanel.track("open", {
      'where': "sign-in",
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
      },
      checkbox: {
        margin: '10px 0'
      }

    };
    styles.buttonIcon = extend(styles.flatButtonIcon, styles.buttonIcon);
    return styles ;
  },
  handleSubmit(e) {
    e.preventDefault();
    let self = this;
    this.setState({
      completed: false,
    }); 
    if(!this.isValid('email') || !this.isValid('password') || !this.state.email || !this.state.password){
      this.setState({
        completed: true,
      }); 
      return;
    }
      console.log("Log in");
    fetch('http://api.flipchinese.com/api/v1/users/login', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: self.state.email,
        password: self.state.password,
      })
    })
    .then(checkStatus)
    .then(function(data) {
        console.log(data.user)
        mixpanel.track("login", {
          'where': "sign-in",
        });
        mixpanel.identify(data.user.id);
        cookie.set('user_id', data.user.id);
        cookie.set('auth_token', data.user.auth_token);
        cookie.set('username', data.user.username);
        cookie.set('role',data.user.role);
        if(self.state.remember){
          cookie.set('email_remember',self.state.email);
        }else{
          cookie.set('email_remember','');
        }
        self.setState({completed: true,});
        if(data.user.role.toLowerCase() == 'lp' || data.user.role.toLowerCase() == 'tutor'){
          self.transitionTo('/teacher/select-teacher');
          mixpanel.track("teacher login", {
            'where': "sign-in",
          });
        }else if(cookie.get('fromCart') == 'true'){
          self.transitionTo('/main/cart');
          mixpanel.track("new user login", {
            'where': "sign-in",
          });
        }else{
          mixpanel.track("old user login", {
            'where': "sign-in",
          });
          self.transitionTo('/main/my-pack');
        }
    })
    .catch(function(error) {
      console.log(error)
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
  _remember(event, checked){
    this.setState({
      remember: checked,
    });
  },
  render() {
    let styles = this.getStyles();

    return (
      <div style={styles.root}>
        <FullWidthSection style={styles.fullWidthSection}>
          <h1 style={styles.headline}>Sign In</h1>
          <p>
          <form onSubmit={this.handleSubmit}>
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
            <Checkbox
              name="checkbox"
              style={styles.checkbox}
              value={this.state.remember}
              label="Remember Me"
              defaultChecked={true}
              onCheck={this._remember}
            />
            <RaisedButton type="submit" style={styles.buttonNormal} disabled={!this.state.completed} primary={true} label="Log in" labelStyle={styles.buttonLabel}>
              <FontIcon style={styles.buttonIcon} className="zmdi zmdi-mail-send"/>
            </RaisedButton>
              <Link to="sign-up">
                <RaisedButton style={styles.buttonNormal} label="NO ACCOUT ? SIGN UP" secondary={true}  />
              </Link>
            <Snackbar
              ref="snackbar"
              message="Email or Password error !"
              action="undo"
              onActionTouchTap={this._handleAction}
            />
          </form>
          </p>
        </FullWidthSection>
      </div>
    );
  }

});



module.exports = SignIn;
