'use strict';

let cookie = require('cookie-cutter');

let React = require('react/addons') ;
let Router = require('react-router') ;

let mui = require('material-ui') ;
let { Tabs, Tab, RaisedButton, TextField } = mui ;
let Select = require('react-select');
let History = require('../components/my-history.jsx');
let Order = require('../components/order.jsx');
let MainStyle = require('../styles/main-style.jsx');
let _ = require('underscore')  ;

let ValidationMixin = require('react-validation-mixin');
let Joi = require('joi');

let checkStatus = require('../../utils/check-status.js');

let {Typography,Colors} = mui.Styles  ;

let styles = {
  label: {
    fontSize: '24px',
    fontWeight: 300,
    color: '#0084CA',
  },
  infoBox: {
    padding: 20,
    boxShadow: '2px 2px 3px #aaaaaa',
    margin: '30px 0 10px 30px',
    width: '85%',
    border: '1px solid #E5E5E5'
  },
  textBox: {
    margin: '20px 0',
  },
  selectbox: {
    width: '40%',
    margin: '20px 0',
  },
  submitButton: {
    margin: '20px 0',
    width: '100%',
  }
};

let fetcher = {
  getUserInfo(id,callback) {
    fetch('http://api.flipchinese.com/api/v1/users/'+id)
    .then(function(response) {
      return response.json();
    }).then(function(data) {
        callback(data);
    });
  },
  updateUserInfo(id,user_id,auth_token,user,callback){
    fetch('http://api.flipchinese.com/api/v1/users/'+id, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        user_id: user_id,
        auth_token: auth_token,
        user: user,
      }),
    })
    .then(checkStatus)
    .then(function (data) {
        callback(data)
    });
  },
  updateUserPassword(user_id,auth_token,old_password,new_password,callback){
    fetch('http://api.flipchinese.com/api/v1/users/change_password', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user_id,
        auth_token: auth_token,
        old_password: old_password,
        new_password: new_password,
      }),
    })
    .then(checkStatus)
    .then(function (data) {
        callback(data)
    }).catch(function(error) {
        window.location.href = '#/main/connect-error';
    });
  }
};

let Profile = React.createClass({
  validatorTypes:  {
        country_origin: Joi.string().allow(null).min(3).max(25).label('Country Origin'),
        location: Joi.string().allow(null).min(3).max(25).label('Location'),
        contact_phone: Joi.number().allow(null).label('Contact Phone'),
        contact_other: Joi.string().allow(null).min(3).max(25).label('Contact Other'),
        birth_year: Joi.string().allow(null).min(4).max(10).label('Birth Year'),
        password: Joi.string().allow(null).required().min(6).max(14).label('Password'),
        password_comfirm: Joi.allow(null).valid(Joi.ref('password')).required().label('Password Confirmation'),
  },
  mixins: [ Router.Navigation, React.addons.LinkedStateMixin ,ValidationMixin],
  contextTypes() {
    router: React.PropTypes.func
  },
  getInitialState() {
    return {
      level: null,
      birth_year: null,
      country_origin: null,
      gender: null,
      years_in_china: null,
      location: null,
      contact_phone: null,
      contact_other: null,
      password: null,
      password_comfirm: null,
      password_old: null,
      loadCompleted: false,
      label_userInfo: null,
      label_password: null,
    };
  },
  componentWillMount(){
    if(!cookie.get('user_id') || !cookie.get('auth_token')){
        this.transitionTo('sign-in');
    }
    this.getUserInfo();
    mixpanel.track("open", {
      'where': "setting",
    });
  },
  getUserInfo(){
    let self = this;
    fetcher.getUserInfo(cookie.get('user_id'),function(data){
      console.log(data.user.level);
      self.setState({
        level: data.user.level,
        birth_year: data.user.birth_year,
        country_origin: data.user.country_origin,
        gender: data.user.gender,
        years_in_china: data.user.years_in_china,
        location: data.user.location,
        contact_phone: data.user.contact_phone,
        contact_other: data.user.contact_other,
        loadCompleted: true,
        label_password: null,
      });
    });
  },
  _tabChange(tabIndex){
    this.initialSelectedIndex = tabIndex;
  },
  _handleInfoSubmit(e){
    mixpanel.track("change personal info");
    let self = this;
    this.setState({loadCompleted: false,})
    e.preventDefault();
    var onValidate = function(error, validationErrors) {
      if (error) {
        this.setState({loadCompleted: true,});
        return;
      } else {
          let user = {
            level: this.state.level,
            birth_year: this.state.birth_year,
            country_origin: this.state.country_origin,
            gender: this.state.gender,
            years_in_china: this.state.years_in_china,
            location: this.state.location,
            contact_phone: this.state.contact_phone,
            contact_other: this.state.contact_other,
          };
        fetcher.updateUserInfo(cookie.get('user_id'),cookie.get('user_id'),cookie.get('auth_token'),user,function(data){
          if(data){
            self.getUserInfo();
            self.setState({
              loadCompleted: true,
              label_userInfo: 'Completed!'
            });
          }
        });
      }
    }.bind(this);
    this.validate(onValidate);
  },
  _handlePasswordSubmit(e){
    mixpanel.track("change password");
    let self = this;
    this.setState({
      loadCompleted: false,
      label_password: null,
    })
    e.preventDefault();
    var onValidate = function(error, validationErrors) {
      if (error) {
        return ;
      } else {
        fetcher.updateUserPassword(cookie.get('user_id'),cookie.get('auth_token'),this.state.password_old,this.state.password,function(data){
          if(data.result == 'ok'){
            self.setState({
              loadCompleted: true,
              password: null,
              password_old: null,
              password_comfirm: null,
              label_password: 'Completed!'
            });
          }else{
            self.setState({
              loadCompleted: true,
              password: null,
              password_old: null,
              password_comfirm: null,
              label_password: data.message+'!',
            });
          }
        });
      }
    }.bind(this);
    this.validate(onValidate);
  },
  renderHelpText(message){
    return (
      <p style={{fontSize: 16,color: 'red'}}>{message}</p>
    );
  },  
  _genderChange(val){
    this.setState({
      gender: val
    });
  },
  _yearChange(val){
    this.setState({
      years_in_china: val
    });
  },
  _levelChange(val){
    this.setState({
      level: val
    });
  },
  render(){
    return (
        <div>
          <h2 style={MainStyle.headline}>Account</h2>
          <Tabs  initialSelectedIndex={this.initialSelectedIndex} onChange={this._tabChange}>
            <Tab label="My Order">
              <Order />
            </Tab>
            <Tab label="History Task">
              <History />
            </Tab>
            <Tab label='Personal Info'>
              <form style={styles.infoBox} onSubmit={this._handleInfoSubmit}>
                <label style={styles.label}>Location</label>

                <div style={styles.textBox}>
                  <TextField 
                    floatingLabelText="Country Origin" 
                    valueLink={this.linkState('country_origin')}
                    disabled={!this.state.loadCompleted}
                    onBlur={this.handleValidation('country_origin')}
                  />
                {this.getValidationMessages('country_origin').map(this.renderHelpText)}
                </div>

                <div style={styles.textBox}>           
                  <TextField 
                    floatingLabelText="Location" 
                    valueLink={this.linkState('location')}
                    disabled={!this.state.loadCompleted}
                    onBlur={this.handleValidation('location')}
                  />    
                {this.getValidationMessages('location').map(this.renderHelpText)}    
                </div>    

                <label style={styles.label}>Personal Info</label>

                <div style={styles.selectbox}>
                  <Select
                    value={this.state.gender}
                    options={[{value: "male",label: "male"},{value: "female",label: "female"}]}
                    floatingLabelText="Gender" 
                    disabled={!this.state.loadCompleted}
                    onChange={this._genderChange}
                    searchable={false}
                    clearable={false}
                  />
                </div>

                <div style={styles.textBox}>             
                  <TextField 
                    floatingLabelText="Birth Year" 
                    valueLink={this.linkState('birth_year')}
                    onBlur={this.handleValidation('birth_year')}
                    disabled={!this.state.loadCompleted}
                  />    
                  {this.getValidationMessages('birth_year').map(this.renderHelpText)}  
                </div>

                <label style={styles.label}>Level</label>

                <div style={styles.selectbox}>        
                  <Select
                    value={'Your Level:'+this.state.level}
                    options={[
                      {value: 1,label: 'Zero Beginner'},
                      {value: 2,label: 'Beginner'},
                      {value: 3,label: 'Intermediate'},
                      {value: 4,label: 'Advanced'},
                    ]}
                    floatingLabelText="Level" 
                    disabled={!this.state.loadCompleted}
                    onChange={this._levelChange}
                    searchable={false}
                    clearable={false}
                  />
                </div>     

                <div style={styles.selectbox}>     
                  <Select
                    value={this.state.years_in_china}
                    options={[
                      {value: 'Not yet',label: 'Not yet'},
                      {value: 'Less than 1 month',label: 'Less than 1 month'},
                      {value: 'Less than 1 year',label: 'Less than 1 year'},
                      {value: '1-2 years',label: '1-2 years'},
                      {value: '2-3 years',label: '2-3 years'},
                      {value: 'More than 3 years',label: 'More than 3 years'},
                    ]}
                    floatingLabelText="Years in China" 
                    disabled={!this.state.loadCompleted}
                    onChange={this._yearChange}
                    searchable={false}
                    clearable={false}
                  />
                </div>  
 
                <label style={styles.label}>Contact</label>

                <div style={styles.textBox} >           
                  <TextField 
                    floatingLabelText="Contact Phone" 
                    valueLink={this.linkState('contact_phone')}
                    onBlur={this.handleValidation('contact_phone')}
                    disabled={!this.state.loadCompleted}
                  />  
                  {this.getValidationMessages('contact_phone').map(this.renderHelpText)}
                </div>

                <div style={styles.textBox}>               
                  <TextField 
                    floatingLabelText="Contact Other" 
                    valueLink={this.linkState('contact_other')}
                    onBlur={this.handleValidation('contact_other')}
                    disabled={!this.state.loadCompleted}
                  />    
                  {this.getValidationMessages('contact_other').map(this.renderHelpText)}  
                </div>    
                <div style={styles.submitButton}>
                  <RaisedButton type="submit" style={{width: "100%"}} disabled={!this.state.loadCompleted} primary={true} label="Change" />
                </div>
                <div style={{width: '100%'}}>
                  <b style={{fontSize: 20,color: 'red',textAlign: 'center'}}>{this.state.label_userInfo}</b>
                </div>
              </form>
            </Tab>
            <Tab label="Change Password">
               <form style={styles.infoBox} onSubmit={this._handlePasswordSubmit}>
                <label style={styles.label}>Change Password</label>

                <div style={styles.textBox}>
                  <TextField 
                    floatingLabelText="Old Password" 
                    valueLink={this.linkState('password_old')}
                    disabled={!this.state.loadCompleted}
                  />   
                </div>

                <div style={styles.textBox}>           
                  <TextField 
                  floatingLabelText="New Password" 
                    valueLink={this.linkState('password')}
                    onBlur={this.handleValidation('password')}
                    disabled={!this.state.loadCompleted}
                  />    
                  {this.getValidationMessages('password').map(this.renderHelpText)}      
                </div>    

                <div style={styles.textBox}>
                  <TextField 
                  floatingLabelText="Verify Password" 
                    valueLink={this.linkState('password_comfirm')}
                    onBlur={this.handleValidation('password_comfirm')}
                    disabled={!this.state.loadCompleted}
                  /> 
                  {this.getValidationMessages('password_comfirm').map(this.renderHelpText)}
                </div>
                <div style={styles.submitButton}>
                  <RaisedButton type="submit" style={{width: "100%"}} disabled={!this.state.loadCompleted} primary={true} label="Change" />
                </div>
                <div style={{width: '100%'}}>
                  <b style={{fontSize: 20,color: 'red',textAlign: 'center'}}>{this.state.label_password}</b>
                </div>
              </form>
            </Tab>         
          </Tabs>
        </div>
    );
  }
});

module.exports = Profile;
