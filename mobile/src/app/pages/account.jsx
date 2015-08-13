'use strict';

let React = require('react');
let Router = require('react-router');

let cookie = require('cookie-cutter');
let reqwest = require('reqwest');

let Tabs = require('../components/tabs.jsx');
let Error = require('../components/error.jsx');
let Loader = require('../components/loader.jsx');

let Fast = React.createClass({
	mixins: [Router.Navigation],
	getInitialState() {
	    return {
	        loadCompleted: false,
            tasks: [],
	        level: null,
	        gender: null,
	        years_in_china: null,
	        contact_phone: null,
	        loadButton: true,
	    };
	},
	componentWillMount() {
		let user_id = cookie.get('user_id'), auth_token = cookie.get('auth_token');
		if(user_id && auth_token){
			this.getHistoryTask(1, user_id, auth_token, true);
			this.getUserInfo(user_id, auth_token)
		}else{
			this.transitionTo('login');
		}
	},
	getHistoryTask(page, user_id, auth_token, initial){
		let self = this;
		this.setState({loadCompleted: false,})
	    reqwest({
	        url: 'http://api.flipchinese.com/api/v1/task_results?fulfilled=1&target_id=' + user_id + '&auth_token=' + auth_token
	      , type: 'json'
	      , method: 'get'
	      , success(resp) {
	      		if(resp.task_results &&　resp.task_results.length != 0){
			      	self.setState({
			      		materials: initial ? resp.task_results : self.state.tasks.concat(resp.task_results),
			      		historyLoadCompleted: true,
			      		findNothing: false,
			      	});
			      }else{
			      	self.setState({
			      		materials: initial ? [] : self.state.tasks,
			      		historyLoadCompleted: true,
			      	});
			      }
	      }
	      , error(err){
	      		console.log(err);
	      		this.setState({
	      			historyLoadCompleted: true,
	      			findNothing: true,
	      		});
	      }
	    });
	},
	getUserInfo(user_id, auth_token){
		let self = this;
		this.setState({loadCompleted: false,})
	    reqwest({
	        url: 'http://api.flipchinese.com/api/v1/users/'+user_id
	      , type: 'json'
	      , method: 'get'
	      , success(resp) {
		      	self.setState({
			        level: resp.user.level,
			        gender: resp.user.gender,
			        years_in_china: resp.user.years_in_china,
			        contact_phone: resp.user.contact_phone,	
    	      		infoLoadCompleted: true,
		      	});
	      }
	      , error(err){
	      		console.log(err);
	      		self.setState({
	      			infoLoadCompleted: true,
	      		});
	      }
	    });
	},
	updateUserInfo(user_id, auth_token, userInfo){
		let self = this;
		this.setState({infoLoadCompleted: false,})
	    reqwest({
	        url: 'http://api.flipchinese.com/api/v1/users/'+user_id
	      , type: 'json'
	      , method: 'put'
	      , data: {
		        id: user_id,
		        user_id: user_id,
		        auth_token: auth_token,
		        user: userInfo,
	      	}
	      , success(resp) {
		      	console.log(resp);
	      		self.setState({
	      			infoLoadCompleted: true,
	      		})
	      }
	      , error(err){
	      		console.log(err);
	      		self.setState({
	      			infoLoadCompleted: true,
	      		});
	      }
	    });
	},
	render(){
		let self = this;
		return(
			<div className="main">
				<section className="appbar">
					<ul className="appbar-list middle-xs row">
						<li className="appbar-icon col-xs-2 start-xs" onClick={()=>{this.goBack()}}>
							<i className="zmdi zmdi-chevron-left"></i>
						</li>
						<li className="appbar-title col-xs-9 row center-xs" onClick={this._spreadTopic}>
							<h4>Account</h4>
						</li>
						<li className="col-xs-1 end-xs" onClick={()=>{
							if(cookie.get('user_id') && cookie.get('auth_token')){
								cookie.set('user_id','');
								cookie.set('auth_token','');
								this.transitionTo('home');
							}else{
								this.transitionTo('login');
							}
						}}>
							<h4>Quit</h4>
						</li>
					</ul>
				</section>

				<section>

				</section>

				<section>
					<Tabs>
						<tab title="History Task">

						</tab>
						<tab title="Personal Info">

						</tab>
					</Tabs>
				</section>
				{
					this.state.loadCompleted?
					null
					:
					<Loader />
				}
			</div>
		);
	}
});

module.exports = Fast ;