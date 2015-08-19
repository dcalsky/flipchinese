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
            task: null
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
                });
	      }
	      , error(err){
      		self.setState({
                loadCompleted: true,
                findNothing: true,
            });
	      }
	    });
	},
    getTaskResultIds(){
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
                self.taskResultIds = resp.task
          }
          , error(err){
            self.setState({
                loadCompleted: true,
                findNothing: true,
            });
          }
        });
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
                                <div className="explainMeal">
                                    <div className="explain-header center-xs">
                                        <p className="middle-xs">{index+1}.{item.title}</p>
                                    </div>
                                    <div className="explain-content start-xs" style={{padding: 10}}>
                                        <p style={{fontSize: '1em',textAlign: 'center', margin: 10}}>
                                            <i className="zmdi zmdi-time"></i>&nbsp;Expected length:{item.length}
                                        </p>
                                        <div className="explain-content-text" dangerouslySetInnerHTML={{__html: item.learner_text}} />
                                    </div>
                                </div>
                            )
                        })}
                        <button className="button-raise"
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