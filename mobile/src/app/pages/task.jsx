let React = require('react');
let Router = require('react-router');
let Tabs = require('../components/tabs.jsx');
let Loader = require('../components/loader.jsx');

let reqwest = require('reqwest');
let cookie = require('cookie-cutter');
let _ = require('underscore');

let Task = React.createClass({
	mixins: [Router.Navigation, Router.State,],
    taskResultId: null,
	getInitialState() {
	    return {
            task: null,
            start_time: new Date(),
            isSelfTask: false,
	    };
	},
	componentWillMount() {
        this.getTask();
	},
	getTask(){
        let self = this;
	    reqwest({
	        url: 'http://api.flipchinese.com/api/v1/tasks/' + this.getParams().id 
	      , type: 'json'
	      , method: 'get'
	      , success(resp) {
                self.setState({
                    task: resp.task,
                    loadCompleted: true,
                    done: self.getQuery().fulfilled == 'true' ? true : false,
                    isSelfTask: resp.task.parts[0].self == 'self' ? true : false,
                });
                self.taskResultId = self.getQuery().result_id;
	      }
	      , error(err){
      		self.setState({
                loadCompleted: true,
                findNothing: true,
            });
	      }
	    });
	},
    getTaskResultId(){
        let self = this;
        reqwest({
            url: 'http://api.flipchinese.com/api/v1/users/' + user_id + '/content?user_id=' + user_id + '&auth_token=' + auth_token + '&id=' + user_id
          , type: 'json'
          , method: 'get'
          , success(resp) {
                if(resp.task_ids.indexOf(parseInt(self.getParams().id)) === -1){
                    self.setState({
                        loadCompleted: true,
                        findNothing: true,
                    });
                    return;
                }
                self.getTask()
          }
          , error(err){
            self.setState({
                loadCompleted: true,
                findNothing: true,
            });
          }
        });
    },
    postResult(){
        if(this.state.readyPost){
            let self = this;
            let result_id = this.getQuery().result_id, user_id = cookie.get('user_id'), auth_token = cookie.get('auth_token');
            let task_result = {
                task_id: this.getParams().id,
                user_id: user_id,
                start_time: this.state.start_time,
                end_time: this.state.end_time,
                learner_on_task: this.state.learner_on_task,
                learner_on_tutor: this.state.learner_on_tutor,
                fulfilled: true,
            };
            reqwest({
                url: 'http://api.flipchinese.com/api/v1/task_results/' + result_id
              , type: 'json'
              , method: 'put'
              , data: {id: result_id, user_id: user_id, auth_token: auth_token, task_result: task_result}
              , success(resp) {
                    self.setState({done: true});
                    window.location.href = '#/main/task/' + task_result['task_id'] + '?result_id=' + result_id + '&fulfilled=true'
              }
              , error(err){
                self.setState({
                    loadCompleted: true,
                    findNothing: true,
                });
              }
            });
        }else{
            this.setState({
                readyPost: true,
            });
        }

    },
    _handleInputChange(type, e){
        let val = e.target.value;
        this.setState({
            learner_on_task: type == 'learner_on_task' ? val : this.state.learner_on_task,
            learner_on_tutor: type == 'learner_on_tutor' ? val : this.state.learner_on_tutor,
        });
    },
	render(){
		if(this.state.loadCompleted){
			return(
				<div className="main">
					<section className="appbar">
						<ul className="appbar-list row middle-xs">
							<li className="appbar-icon col-xs-1 start-xs" style={{cursor: 'pointer'}} onClick={()=>{this.goBack()}}>
								<i className="zmdi zmdi-chevron-left"></i>
							</li>
							<li className="appbar-title col-xs-10 row center-xs">
								<h4>{this.state.task.title ? this.state.task.title : 'Task'}</h4>
							</li>
                            <li className="col-xs-1 end-xs" style={{cursor: 'pointer'}} onClick={()=>{
                                if(cookie.get('user_id') && cookie.get('auth_token')){
                                    this.transitionTo('/main/account');
                                }else{
                                    this.transitionTo('/main/login');
                                }
                            }}>
                                <i style={{fontSize: 24}} className="zmdi zmdi-account-circle"></i>
                            </li>
						</ul>
					</section>
					<section>

                        {this.state.task.parts.map((item, index)=>{

                            return (
                                <div>
                                    <div className="explainMeal">
                                        <div className="explain-header center-xs">
                                            <p className="middle-xs">{index+1}.{item.title}</p>
                                        </div>
                                        <div className="explain-content start-xs" style={{padding: 10}}>
                                            <p style={{fontSize: '1em',textAlign: 'center', margin: 10}}>
                                                <i className="zmdi zmdi-time"></i>&nbsp;<u>Expected length:{item.length}</u>
                                            </p>
                                            <div className="explain-content-text" dangerouslySetInnerHTML={{__html: item.learner_text}} />
                                        </div>
                                    </div>
                                    {
                                        this.state.done?
                                        <div className="explainMeal">
                                            <div className="explain-header center-xs">
                                                <p className="middle-xs">Answer</p>
                                            </div>
                                            <div className="explain-content start-xs" style={{padding: 10}}>
                                                <div className="explain-content-text" dangerouslySetInnerHTML={{__html: item.answer_text}} />
                                            </div>
                                        </div>
                                        :
                                        null
                                    }
                                </div>
                            )
                        })}
					</section>
                    {
                        this.state.readyPost?
                        <section className="personal-info">
                        <ul className="personal-info-list">
                            <li className="personal-info-list-item row middle-xs" style={{padding: 10}}>
                                <label className="personal-info-list-item-title col-xs-12">On Task:</label>
                                <input
                                    type="text"
                                    className="col-xs-12"
                                    disabled={this.state.done}
                                    value={this.state.learner_on_task}
                                    onChange={(e)=>{this._handleInputChange('learner_on_task', e)}}
                                />
                            </li>
                            {
                                this.state.isSelfTask ?
                                null
                                :
                                <li className="personal-info-list-item row middle-xs" style={{padding: 10}}>
                                    <label className="personal-info-list-item-title col-xs-12">On Tutor/LP:</label>
                                    <input
                                        type="text"
                                        className="col-xs-12"
                                        disabled={this.state.done}
                                        value={this.state.learner_on_tutor}
                                        onChange={(e)=>{this._handleInputChange('learner_on_tutor', e)}}
                                    />
                                </li>
                            }
                        </ul>
                        </section>
                        :
                        null
                    }
                    {
                        this.state.done?
                        null
                        :
                        <div className="center-xs">
                            <button className="button-raised" style={{width: '80%'}} onClick={this.postResult}>Submit</button>
                        </div>
                    }
				</div>
			);
		}else{
			return(
				<div className="material">
					<section className="appbar">
						<ul className="appbar-list row">
							<li className="appbar-icon col-xs-1 start-xs" onClick={()=>{this.goBack()}}>
								<i className="zmdi zmdi-chevron-left"></i>
							</li>
							<li className="appbar-title col-xs-10 row center-xs middle-xs">
								<h4>Task</h4>
							</li>
							<li className="col-xs-1 end-xs"></li>
						</ul>
					</section>
					<Loader />
				</div>
			);
			
		}
	}
});

module.exports = Task ;