'use strict';

let cookie = require('cookie-cutter');

let React = require('react/addons') ;
let Router = require('react-router') ;

let mui = require('material-ui') ;
let { TextField, Dialog, RaisedButton, FlatButton } = require('material-ui') ;
let Select = require('react-select');
let MainStyle = require('../styles/main-style.jsx');

let styles = {
  partBox: {
    marginTop: '30px',
  },
  part: {
    marginTop: '30px',
  },
  taskTitle: {
    margin: '20px 0 20px 0',
    fontSize: '22px',
    fontWeight: 300,
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '15px 0 15px 0',
    textAlign: 'center',
  },
  taskTime: {
    fontSize: '18px',
    fontWeight: 200,
    margin: '5px 0 15px 0',
    textAlign: 'center',
  },
  taskBody: {
    fontSize: '14px',
    fontWeight: 150,
    padding: 20,
    lineHeight: 2,
    boxShadow: '2px 2px 3px #aaaaaa',
    border: '1px solid #E5E5E5',
  },
  taskMusic: {
    textAlign: 'center',
    margin: '10px 0 10px 0',
  },
  button: {
    marginTop: '20px',
  }

};
let fetcher = {
  getPart(id, callback) {
   fetch('http://api.flipchinese.com/api/v1/tasks/'+id)
    .then(function(response) {
        return response.json()
    }).then(function(data) {
        callback(data);
    })
  },
};

let Part = React.createClass({
  getInitialState(){
    return {
      tutor_text: null,
      audio: null,
    }
  },
  componentWillMount(){
    let audio = null;
    if(this.props.item.media){
      audio = <div style={styles.taskMusic}><audio controls="controls"><source src={this.props.item.media} type="audio/mpeg"/></audio></div>;
    }
    this.setState({
      tutor_text: this.props.item.tutor_text.replace(new RegExp('\n', "gm"), "<br />"),
      audio: audio,
    });
  },
  render(){
    return(
      <div style={styles.part}>
        <div style={styles.taskTitle}>
          {this.props.item.title}
        </div>
        <div style={styles.taskTime}>
          <i className="zmdi zmdi-time"></i>Expected Time :{this.props.item['length']} mins
        </div> 
          {this.state.audio}
        <div style={styles.taskBody} dangerouslySetInnerHTML={{__html: this.state.tutor_text}} />
      </div>
    );
  }
});

let Task = React.createClass({
  mixins: [ Router.Navigation, Router.State , React.addons.LinkedStateMixin ],
  contextTypes() {
    router: React.PropTypes.func
  },
  getInitialState() {
      return {
        parts: [],
        rating: 1,
        commentStudent: null,
        commentTask: null,
        length: null,
      };
  },
  componentWillMount(){
    let _userNames = [];
    let self = this ;
    fetcher.getPart(this.getParams().id,function(data){
      self.setState({
        parts: data.task.parts,
      });
    });

  },
  modalShow(){
    this.refs.customDialog.show();
  },
  _handleCustomDialogCancel() {
    this.refs.customDialog.dismiss();
  },
  _handleCustomDialogSubmit() {
    let id = cookie.get('user_id');
    let self = this ;
    fetch('http://api.flipchinese.com/api/v1/task_results/'+this.getParams().id, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
      {
        id: id,
        user_id: id,
        auth_token: cookie.get('auth_token'),
        task_result:{
          task_id: self.getParams().id,
          user_id: self.getQuery().user_id,
          tutor_id: id,
          length: self.state.length,
          rating: self.state.rating,
          tutor_on_learner: self.state.commentStudent,
          tutor_on_task: self.state.commentTask,
          }
        }
      ),
    })
    .then(function(response) {
    if (response.status >= 200 && response.status < 300) {
        self.refs.customDialog.dismiss();
        window.location.href = '#/teacher/result-teacher';
        return response.json()
      } else {
        alert('Comment Error...');
        self.refs.customDialog.dismiss();
      }
    }).then(function(data) {
    })
  },
  _handleCustomDialogSelectChange(id,val){
    this.setState({
      rating: val[0].label,
    });
  },
  render(){
    var customActions = [
      <FlatButton
        key={1}
        label="Cancel"
        secondary={true}
        onTouchTap={this._handleCustomDialogCancel} />,
      <FlatButton
        key={2}
        label="Submit"
        primary={true}
        onTouchTap={this._handleCustomDialogSubmit} />
    ];
    return (
        <div>
          <h2  style={MainStyle.headline}>Task</h2>
          <div style={styles.partBox}>
            {this.state.parts.map(function(item){
              return <Part item={item} />
            })}
          </div>
          <div style={styles.button}>
            <RaisedButton style={{width: "100%"}} primary={true} label="Submit" onClick={this.modalShow} />
          </div>
          <Dialog
            ref="customDialog"
            title="Finishing the Task"
            actions={customActions}
            modal={false}>
            <h3>Please comment on the task and the learner.</h3>
            <Select
              placeholder="Rating"
              options={[{value: 1,label: 'Rating:1'},{value: 2,label: 'Rating:2'},{value: 3,label: 'Rating:3'},{value: 4,label: 'Rating:4'},{value: 5,label: 'Rating:5'}]}
              value={this.state.rating}
              onChange={this._handleCustomDialogSelectChange}
              searchable={false}
            />
            <div>
            <TextField
              floatingLabelText="Actual Length"
              ref="length"
              valueLink={this.linkState('length')}
              style={MainStyle.textField}
            />
            </div>
            <div>
            <TextField
              floatingLabelText="Notes on Learner"
              ref="note"
              valueLink={this.linkState('commentStudent')}
              style={MainStyle.textField}
            />
            </div>
            <div>
            <TextField
              floatingLabelText="On Task"
              ref="search"
              valueLink={this.linkState('commentTask')}
              style={MainStyle.textField}
            />
            </div>
        </Dialog>
       </div>
    );
  }
});

module.exports = Task;
