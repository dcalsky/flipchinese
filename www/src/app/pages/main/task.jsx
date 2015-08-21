'use strict';

let cookie = require('cookie-cutter');
let React = require('react/addons');
let Router = require('react-router');

let mui = require('material-ui');
let { TextField, FlatButton, Dialog} = mui;
let _ = require('underscore');

let MainStyle = require('../styles/main-style.jsx');
let Progress = require('../components/progress.jsx');
let TaskPart = require('../components/task-part.jsx');
let Error = require('../components/error.jsx');

let checkStatus = require('../../utils/check-status.js');

let fetcher = {
    get(id, callback) {
        fetch('http://api.flipchinese.com/api/v1/tasks/' + id)
            .then(checkStatus)
            .then(function (data) {
                callback(data)
            }).catch(function (error) {
                console.log(error)
                window.location.href = '#/main/connect-error';
            });
    },
    postTaskResults(result_id, user_id, auth_token, task_id, learner_on_task, learner_on_tutor, start_time, end_time, callback){
        fetch('http://api.flipchinese.com/api/v1/task_results/' + result_id, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: result_id,
                user_id: user_id,
                auth_token: auth_token,
                task_result: {
                    task_id: task_id,
                    user_id: user_id,
                    learner_on_task: learner_on_task,
                    learner_on_tutor: learner_on_tutor,
                    start_time: start_time,
                    end_time: end_time,
                    fulfilled: true
                }
            })
        }).then(checkStatus).then(function (data) {
            callback(data)
        }).catch(function (error) {
            window.location.href = '#/main/connect-error';
        });
    }
};

let Task = React.createClass({
    mixins: [Router.Navigation, Router.State, React.addons.LinkedStateMixin],
    contextTypes() {
        router: React.PropTypes.func
    },
    getInitialState() {
        return {
            taskLoadComplete: false,
            isDone: false,
            findNothing: false,
            title: null,
            parts: [],
            isSelfTask: false,
            learner_on_task: null,
            learner_on_tutor: null,
            startTime: new Date()
        };
    },
    componentWillMount() {
        mixpanel.track("open", {
          'where': "task",
        });
        if(!cookie.get('user_id') || !cookie.get('auth_token')){
            this.transitionTo('sign-in');
        }
        this.loadInit();
    },
    loadInit() {
        let self = this;
        fetcher.get(self.getParams().id, function (data) {
            self.setState({
                taskLoadComplete: true,
                title: data.task.title,
                parts: data.task.parts,
                isDone: self.getQuery().fulfilled == 'true' ? true : false,
                isSelfTask: data.task.parts[0].kind === 'self' ? true : false,
            });
        });
    },
    dialogShow(){
        this.refs.finishDialog.show();
    },
    _handleDialogCancel() {
        mixpanel.track("cancel to submit task result", {
          'where': "task",
        });
        this.refs.finishDialog.dismiss();
    },
    _handleDialogSubmit() {
        mixpanel.track("submit task result", {
          'where': "task",
        });
        let self = this;
        fetcher.postTaskResults(this.getQuery().result_id, cookie.get('user_id'), cookie.get('auth_token'), this.getParams().id, this.state.learner_on_task, this.state.learner_on_tutor, this.state.startTime, new Date(), function (data) {
            console.log(data)
            self.refs.finishDialog.dismiss();
            // bad way !!!
            window.location.href = 'http://localhost:3000/#/main/task/'+ self.getParams().id + '?result_id=' + self.getQuery().result_id + '&fulfilled=true'
            self.setState({
                isDone: true,
            });
        });
    },
    render() {
        let index = 1;
        this.state.parts.map(function (item) {
            item.index = index;
            index++;
        });
        let dialogActions = [
            <FlatButton
                key={1}
                label="Cancel"
                secondary={true}
                onTouchTap={this._handleDialogCancel}
            />,
            <FlatButton
                key={2}
                label="Submit"
                primary={true}
                onTouchTap={this._handleDialogSubmit}
            />
        ];
        let self = this;
        return (
            <div>
                {
                    this.state.findNothing ?
                        <Error show={true} desc="Find Nothing ..."/>
                        :
                        <div style={{display: this.state.taskLoadComplete ? 'block' : 'none'}}>
                            <h2 style={MainStyle.headline}>{this.state.title}</h2>
                            {this.state.parts.map(function (item) {
                                return <TaskPart key={item.id} part={item} isDone={self.state.isDone}/>
                            })}
                            {
                                this.state.isDone ?
                                    null
                                    :
                                    <div>
                                        <button className="button-normal" style={{width: "100%", backgroundColor: '#ff3b77'}} onClick={this.dialogShow}>
                                            Submit
                                        </button>
                                    </div>
                            }
                            <Dialog
                                ref="finishDialog"
                                title="Finishing the Task"
                                actions={dialogActions}
                                modal={false}>
                                <h3>Please comment on the task and the tutor/LP.</h3>

                                <div>
                                    <TextField
                                        floatingLabelText="On Task"
                                        ref="onTask"
                                        valueLink={this.linkState('learner_on_task')}
                                        style={MainStyle.textField}
                                    />
                                </div>
                                {
                                    this.state.isSelfTask?
                                    null
                                    :
                                    <div>
                                        <TextField
                                            floatingLabelText="On Tutor/LP"
                                            ref="onTutor"
                                            valueLink={this.linkState('learner_on_tutor')}
                                            style={MainStyle.textField}
                                        />
                                    </div>
                                }
                            </Dialog>
                        </div>
                }
                <Progress completed={this.state.taskLoadComplete}/>
            </div>
        )
    }
});

module.exports = Task;
