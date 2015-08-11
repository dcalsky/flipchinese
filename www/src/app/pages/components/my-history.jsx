'use strict';

let cookie = require('cookie-cutter');

let React = require('react/addons');
let Router = require('react-router');

let mui = require('material-ui');
let {  TextField,Dialog, RaisedButton,FlatButton } = mui;
let _ = require('underscore');

let Select = require('react-select');
let Error = require('../components/error.jsx');
let LoadButton = require('../components/load-button.jsx');
let Progress = require('../components/progress.jsx');
let MainStyle = require('../styles/main-style.jsx');

let checkStatus = require('../../utils/check-status.js');

let styles = {
  header: {
    backgroundColor: '#E5E5E5',
    padding: '20px 0',
    width: '100%',
    margin: 0,
  },
  goods: {
    fontSize: 16,
    margin: 'auto 0',
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    margin: 'auto 0',
    textAlign: 'center',
  },
  pack: {
    padding: '20px 0',
    borderBottom: '1px solid #E5E5E5',
    margin: 'auto 0',
  },
  order: {
    boxShadow: '1px 1px 3px #aaaaaa',
    border: '1px solid #e5e5e5',
    display: 'block',
    padding: 0,
    margin: '20px 0',
  },
  load: {
    width: '100%',
  }
};

let fetcher = {
  getHistoryTasks(page,user_id,auth_token,callback) {
    fetch('http://api.flipchinese.com/api/v1/task_results?fulfilled=1&target_id=' + user_id + '&auth_token=' + auth_token)
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
    mixpanel.track("watch task detail", {
      'where': "history",
    });
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
              <div style={styles.pack} className="row">
                <div style={styles.goods} className="col-xs-2">{String(startTime.getMonth() + 1) + '.' + startTime.getDate()}</div>
                <div style={styles.goods} className="col-xs-2">{startTime.getHours() + ':' + startTime.getMinutes()}</div>
                <div style={styles.title} className="col-xs-5">{item.task_title}</div>
                <div style={styles.goods} className="col-xs-3"><RaisedButton style={{width: '100%'}} onClick={this.showDetail} label="Detail" /></div>
                <Dialog
                  ref="customDialog"
                  title="Your detail about this task"
                  actions={customActions}
                  modal={false}>
                  <Select
                    placeholder="Rating"
                    value={'Your score:'+item.rating}
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
                        floatingLabelText="tutor note on you"
                        value={item.tutor_on_learner}
                        style={{width: '100%'}}
                      />
                    </div>
                  </div>
                  <div style={{marginTop: 20}}>
                    <div>
                      <TextField
                        floatingLabelText="Notes on Task"
                        value={item.learner_on_task}
                        style={{width: '100%'}}
                      />
                    </div>
                    <div>
                      <TextField
                        floatingLabelText="Notes on tutor"
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

let MyHistory = React.createClass({
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
    mixpanel.track("open", {
      'where': "history",
    });
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
    mixpanel.track("load more history task result", {
      'where': "history",
    });
    this.page_task = this.page_task + 1 ;
    this.getTask(this.page_task,false);
  },
  render() {
      return (
        <div>
          <div style={styles.order} >
            <div style={styles.header} className="row">
              <div style={styles.goods} className="col-xs-2">Date</div>
              <div style={styles.goods} className="col-xs-2">Time</div>
              <div style={styles.title} className="col-xs-5">Task Name</div>
              <div style={styles.goods} className="col-xs-3">Details</div>
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

module.exports = MyHistory;

