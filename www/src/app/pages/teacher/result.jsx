'use strict';

let cookie = require('cookie-cutter');

let React = require('react/addons');
let Router = require('react-router');

let mui = require('material-ui');
let {  TextField,Dialog, RaisedButton, FlatButton } = mui;
let Select = require('react-select');
let _ = require('underscore');

let Error = require('../components/error.jsx');
let LoadButton = require('../components/load-button.jsx');
let Progress = require('../components/progress.jsx');
let MainStyle = require('../styles/main-style.jsx');

let checkStatus = require('../../utils/check-status.js');

let styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-around',
    msFlexAlign: 'center',
    WebkitAlignItems: 'center',
    WebkitBoxAlign: 'center',
    alignItems: 'center',
    textAlign: 'center',
    border: '1px solid #EEE',
    backgroundColor: '#E5E5E5',
    padding: '20px 0',
  },
  goods: {
    flex: 1,
    fontSize: 16
  },
  title: {
    flex: 2,
    fontSize: 16
  },
  pack: {
    display: 'flex',
    justifyContent: 'space-around',
    msFlexAlign: 'center',
    WebkitAlignItems: 'center',
    WebkitBoxAlign: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px 10px',
    borderBottom: '1px solid #aaa'
  },
  image: {
    flex: 1,
    height: 140,
    width: 'auto',
  },
  order: {
    boxShadow: '2px 2px 3px #aaaaaa',
    border: '1px solid #e5e5e5',
    display: 'block',
    margin: '0 0 20px 0',
    width: '100%',
    padding: 0,
  },
  load: {
    width: '100%',
  }
};

let fetcher = {
  getHistoryTasks(page,user_id,auth_token,callback) {
    fetch('http://api.flipchinese.com/api/v1/task_results?page=' + page + '&tutor_id=' + user_id )
      .then(checkStatus)
      .then(function (data) {
          callback(data)
      }).catch(function(error) {
          window.location.href = '#/main/connect-error';
      });
    },
};

let HistoryTaskContent = React.createClass({
  mixins: [ Router.Navigation ],
  showDetail(){
    this.refs.customDialog.show();
  },
  _handleCustomDialogCancel() {
    this.refs.customDialog.dismiss();
  },
  render() {
    let item = this.props.item;
    let startTime = new Date(item.start_time);
    var customActions = [
      <FlatButton
        key={1}
        label="Back"
        secondary={true}
        onTouchTap={this._handleCustomDialogCancel} />,
      ];
      return (
              <div style={styles.pack}>
                <div style={styles.goods} >{String(startTime.getMonth() + 1) + '.' + startTime.getDate()}</div>
                <div style={styles.goods} >{startTime.getHours() + ':' + startTime.getMinutes()}</div>
                <div style={styles.goods} >{item.user_name}</div>
                <div style={styles.title} >{item.task_title}</div>
                <div style={styles.goods} ><RaisedButton style={{width: '100%'}} onClick={this.showDetail} label="Detail" /></div>
                <Dialog
                  ref="customDialog"
                  title="Your detail about this task"
                  actions={customActions}
                  modal={false}>
                  <Select
                    placeholder="Rating"
                    value={'The score:'+item.rating}
                    disabled={true}
                    searchable={false}
                  />
                  <div>
                    <div>
                      <TextField
                        floatingLabelText="Actual Length"
                        value={item.length}
                        style={{width: '100%'}}
                      />
                    </div>
                    <div>
                      <TextField
                        floatingLabelText="Your note on task"
                        value={item.tutor_on_task}
                        style={{width: '100%'}}
                      />
                    </div>
                    <div>
                      <TextField
                        floatingLabelText="Your note on learner"
                        value={item.tutor_on_learner}
                        style={{width: '100%'}}
                      />
                    </div>
                  </div>
                  <div style={{marginTop: 20}}>
                    <div>
                      <TextField
                        floatingLabelText="Learner's note on task"
                        value={item.learner_on_task}
                        style={{width: '100%'}}
                      />
                    </div>

                    <div>
                      <TextField
                        floatingLabelText="Learner's note on tutor"
                        value={item.learner_on_tutor}
                        style={{width: '100%'}}
                      />
                    </div>
                  </div>
                </Dialog>
              </div>
      );
  }
});

let TaskResult = React.createClass({
  mixins: [Router.Navigation, React.addons.LinkedStateMixin],
  page_task: 1,
  contextTypes() {
    router: React.PropTypes.func
  },
  getInitialState() {
    return {
      tasks: [],
      loadShow: false,
      imageShow: false,
      taskLoadCompleted: false,
      key: '',

    }
  },
  componentWillMount() {
    this.getTask(1,true);
  },
  getTask(page,initial){
    let self = this ;
    if(initial){
      this.setState({taskLoadCompleted: false,tasks: []});
    }else{
      this.setState({taskLoadCompleted: false});
    }
    fetcher.getHistoryTasks(page,cookie.get('user_id'),cookie.get('auth_token'),function(data){
      console.log(data);
      if(data.task_results.length == 0){
        let _tasks = initial ? [] : self.state.tasks.concat(data.task_results);
        self.setState({
          tasks: _tasks,
          taskLoadCompleted: true,
          loadShow: false,
          imageShow: initial,
        })
      }else if(data.task_results.length > 0 && data.task_results.length < 6){
        let _tasks = initial ? data.task_results : self.state.tasks.concat(data.task_results);
        self.setState({
          tasks: _tasks,
          taskLoadCompleted: true,
          imageShow: false,
          loadShow: false,
        });
      }else{
        let _tasks = initial ? data.task_results : self.state.tasks.concat(data.task_results);
        self.setState({
          tasks: _tasks,
          taskLoadCompleted: true,
          imageShow: false,
          loadShow: true,
        });
      }
    });
  },
  _loadMoreTasks(){
    this.getTask(++this.page_task,false);
  },
  render() {
      return (
        <div>
          <h2 style={MainStyle.headline}>History Task</h2>
          <div style={styles.order}>
            <div style={styles.header}  >
              <div style={styles.goods} >Date</div>
              <div style={styles.goods} >Time</div>
              <div style={styles.goods} >Username</div>
              <div style={styles.title} >Task Name</div>
              <div style={styles.goods} >Details</div>
            </div>
              {this.state.tasks.map(function (item) {
                return <HistoryTaskContent item={item} />
              })}
            </div>
            <Error show={this.state.imageShow} desc="Did not find any history..." />
            <Progress completed={this.state.taskLoadCompleted } />
            <LoadButton style={styles.load} show={this.state.loadShow} onClick={this._loadMoreTasks} disabled={!this.state.taskLoadCompleted} />
        </div>
      );
  }
});

module.exports = TaskResult;

