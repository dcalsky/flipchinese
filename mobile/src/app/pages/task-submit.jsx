let React = require('react');
let Router = require('react-router');
let Tabs = require('../components/tabs.jsx');
let Loader = require('../components/loader.jsx');

let reqwest = require('reqwest');
let cookie = require('cookie-cutter');
let _ = require('underscore');

let Task = React.createClass({
	mixins: [Router.Navigation, Router.State,],
	getInitialState() {
	    return {
            
	    };
	},
	componentWillMount() {

	},
	submitTaskResult(user_id, auth_token, task_id, learner_on_task, learner_on_tutor, start_time, end_time){
        let self = this;
	    reqwest({
	        url: 'http://api.flipchinese.com/api/v1/tasks/' + this.getParams().id + '?user_id=' + user_id + '&auth_token=' + auth_token
	      , type: 'json'
	      , method: 'post'
	      , success(resp) {
            self.setState({
            	    
            });
	      }
	      , error(err){
      		self.setState({
                loadCompleted: true,
                findNothing: true,
            });
	      }
	    });
    postTaskResults(user_id, auth_token, task_id, learner_on_task, learner_on_tutor, start_time, end_time, callback){
        fetch('http://api.flipchinese.com/api/v1/task_results/' + task_id, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
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
	},
	render(){
		if(this.state.loadCompleted){
			return(
				<div className="main">
					<section className="appbar">
						<ul className="appbar-list row middle-xs">
							<li className="appbar-icon col-xs-2 start-xs" style={{cursor: 'pointer'}} onClick={()=>{this.goBack()}}>
								<i className="zmdi zmdi-chevron-left"></i>
							</li>
							<li className="appbar-title col-xs-9 row center-xs">
								<h4>Task</h4>
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

					</section>
				</div>
			);
		}else{
			return(
				<div className="material">
					<section className="appbar">
						<ul className="appbar-list row">
							<li className="appbar-icon col-xs-2 start-xs" onClick={()=>{this.goBack()}}>
								<i className="zmdi zmdi-chevron-left"></i>
							</li>
							<li className="appbar-title col-xs-9 row center-xs middle-xs">
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