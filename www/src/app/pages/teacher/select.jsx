'use strict';

let cookie = require('cookie-cutter');

let React = require('react/addons') ;
let Router = require('react-router') ;

let mui = require('material-ui') ;
let { RaisedButton,  FlatButton } = require('material-ui') ;
let MainStyle = require('../styles/main-style.jsx');
let _ = require('underscore')  ;
let Select = require('react-select');

let styles = {
  selectBox: {
    marginTop: '30px',
  },
  selectButton: {
    marginTop: '30px',
    textAlign: 'center',
  },
  prepareBox: {
    marginTop: '30px',
    textAlign: 'center',
  },
  prepareInfo: {
    marginTop: '30px',
    backgroundColor: '#FAFAFA',
    fontSize: '20px',
    fontWeight: 200,
  }

};
let fetcher = {
  getStudentPacks(id,user_id,autn_token, callback) {
   fetch('http://api.flipchinese.com/api/v1/users/'+id+'/pack_items')
    .then(function(response) {
        return response.json()
    }).then(function(data) {
        callback(data);
    })
  },
  getStudentName(page,role,callback){
    fetch('http://api.flipchinese.com/api/v1/users?page=-1&role='+role)
    .then(function(response) {
      return response.json()
    }).then(function(data) {
        callback(data);
    })
  },
  getPrepare(id,callback){
    fetch('http://api.flipchinese.com/api/v1/prepare?id='+id)
    .then(function(response) {
      return response.json()
    }).then(function(data) {
        callback(data);
    })
  }
};
let Prepare = React.createClass({
  render(){
    if(this.props.content){
      return (
        <div style={styles.prepareBox}>
          <div style={styles.prepareInfo}>
            Name:{this.props.content.info.name}
            <br/>
            Level:{this.props.content.info.level}
            <br/>
            Location:{this.props.content.info.location}
          </div>
          <div style={styles.prepareInfo}>
            {this.props.content.info.special.map(function(item){
              return item;
            })}
          </div>
        </div>
      );
    }else{
      return null ;
    }
  }
});
let SelectTask = React.createClass({
  mixins: [ Router.Navigation, Router.State , React.addons.LinkedStateMixin ],
  contextTypes() {
    router: React.PropTypes.func
  },
  getInitialState() {
      return {
        userNames: [],
        userTask: [],
        currentName: null,
        currentTask: null,
        taskID: null,
        userID: null,
        disabled: true,
        buttonDisabled: true,
        prepare: null,
      };
  },
  componentWillMount(){
    let _userNames = [];
    let self = this ;
    fetcher.getStudentName(1,'learner',function(data){
      data.users.map(function(user){
        console.log(user.username);
        _userNames.push({value: user.id,label: user.username});
      });
      self.setState({
        userNames: _userNames,
      });
    });

  },
  selectUser(id,val){
    let _userTask = [];
    let self = this ;
    console.log(val);
    fetcher.getStudentPacks(val[0].value,cookie.get('user_id'),cookie.get('autn_token'),function(data){
      data.pack_items.map(function(pack_item){
        pack_item.pack.tasks.map(function(task){
          _userTask.push({value: task.id,label: task.title})
        });
      });
      self.setState({
        userTask: _userTask,
        userID: val[0].value,
        currentName: val[0].label,
        currentTask: null,
        disabled: false,
      });
    });
  },
  selectTask(id,val){
    this.setState({
      currentTask: val[0].label,
      taskID: val[0].value,
      buttonDisabled: false,
    });
  },
  prepare(){
    let self = this ;
    fetcher.getPrepare(this.state.taskID,function(data){
      self.setState({
        prepare: data.prepare,
      });
    });
  },
  doTask(){
    let self = this ;
    if(this.state.currentTask && this.state.currentName && this.state.userID && this.state.taskID){
      this.transitionTo('/teacher/task-teacher/'+this.state.taskID,{id: this.state.taskID},{user_id: this.state.userID});
    }else{
      alert('Please choose a student or task!');
    }
  },
  render(){
    var self = this ;
    return (
        <div>
          <h2  style={MainStyle.headline}>Task Select</h2>
          <div style={styles.selectBox} >
            <div style={styles.selectBox}>
              <label>UserName:</label>
              <Select
                  placeholder="Please select username..."
                  options={this.state.userNames}
                  value={this.state.currentName}
                  onChange={this.selectUser}
              />
            </div>
            <div style={styles.selectBox}>
              <label>Task:</label>
              <Select
                  placeholder="Please select task..."
                  options={this.state.userTask}
                  onChange={this.selectTask}
                  value={this.state.currentTask}
                  disabled={this.state.disabled}
              />
            </div>
            <div style={styles.selectButton}>
              <RaisedButton disabled={this.state.buttonDisabled} primary={true} onClick={this.doTask} label="Do Task" />
              <br /><br />
              <FlatButton onClick={this.prepare} label="I want to prepare" />
            </div>
          </div>
          <hr />
            <Prepare content={this.state.prepare} />
        </div>
    );
  }
});

module.exports = SelectTask;
