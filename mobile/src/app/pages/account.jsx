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
	        username: null,
	        currentTaskId: null,
	    };
	},
	componentWillMount() {
		let user_id = cookie.get('user_id'), auth_token = cookie.get('auth_token');
		if(user_id && auth_token){
			this.getHistoryTask(1, user_id, auth_token, true);
			this.getUserInfo(user_id, auth_token)
		}else{
			window.location.href = '#/main/login';
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
			      		tasks: initial ? resp.task_results : self.state.tasks.concat(resp.task_results),
			      		historyLoadCompleted: true,
			      		findNothing: false,
			      	});
			      }else{
			      	self.setState({
			      		tasks: initial ? [] : self.state.tasks,
			      		historyLoadCompleted: true,
			      	});
			      }
	      }
	      , error(err){
	      		console.log(err);
	      		self.setState({
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
		      		username: resp.user.username,
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
	_showDetail(id){
		this.setState({
			currentTaskId: id == this.state.currentTaskId ? null : id,
		});
	},
	_handleSelectChange(type, e){
		let val = e.target.value;
		console.log(val);
		this.setState({
			level: type == 'level' ? val : this.state.level,
			years_in_china: type == 'years_in_china' ? val : this.state.years_in_china,
			gender: type == 'gender' ? val : this.state.gender,
		});
	},
	_handleInputChange(type, e){
		let val = e.target.value;
		console.log(this.state.contact_phone)
		this.setState({
			contact_phone: type == 'contact_phone' ? val : this.state.contact_phone,
		});
	},
	_handleFormSubmit(e){
		e.preventDefault();
		this.setState({infoLoadCompleted: false});
		this.updateUserInfo(cookie.get('user_id'), cookie.get('auth_token'), {
            level: this.state.level,
            country_origin: this.state.country_origin,
            gender: this.state.gender,
            years_in_china: this.state.years_in_china,
            contact_phone: this.state.contact_phone,
		});
	},
	_logout(){
		cookie.set('user_id','');
		cookie.set('auth_token','');
		this.transitionTo('login');
	},
	render(){
		let self = this;
        let levels = ['','Zero Beginner', 'Beginner', 'Intermediate', 'Advanced'];
		return(
			<div className="main">
				<section className="appbar">
					<ul className="appbar-list middle-xs row">
						<li className="appbar-icon col-xs-1 start-xs" style={{cursor: 'pointer'}} onClick={()=>{this.goBack()}}>
							<i className="zmdi zmdi-chevron-left"></i>
						</li>
						<li className="appbar-title col-xs-10 row center-xs" style={{cursor: 'pointer'}} onClick={this._spreadTopic}>
							<h4>Account</h4>
						</li>
					</ul>
				</section>

				<section className="account center-xs middle-xs">
					<img className="account-avatar" src="./images/user.png" alt="Logo" /> 
					<h3 className="account-username">{this.state.username ? this.state.username : 'Loading Username'}</h3>
					{this.state.level ? <h4 className="account-level">Level: {levels[this.state.level]}</h4> : null}
				</section>

				<section>
					<Tabs>
						<tab title="Personal Info">
							<form className="personal-info" onSubmit={this._handleFormSubmit}>
								<ul className="personal-info-list">
									<li className="personal-info-list-item row middle-xs">
										<label className="personal-info-list-item-title col-xs-4 start-xs">Level</label>
										<select
											type="select"
											className="col-xs-6"
											value={this.state.level}
											onChange={(e)=>{self._handleSelectChange('level', e)}}
											placeholder="Level"
										>
											<option value={1}>Zero Beginner</option>
											<option value={2}>Beginner</option>
											<option value={3}>Intermediate</option>
											<option value={4}>Advanced</option>

										</select>
									</li>
									<li className="personal-info-list-item row middle-xs">
										<label className="personal-info-list-item-title col-xs-4">Years In China</label>
										<select
											type="select"
											className="col-xs-6"
											value={this.state.years_in_china}
											onChange={(e)=>{self._handleSelectChange('years_in_china', e)}}
											placeholder="Years In China"
										>
											<option value="Not yet">Not yet</option>
											<option value="Less than 1 month">Less than 1 month</option>
											<option value="Less than 1 year">Less than 1 year</option>
											<option value="1-2 years">1-2 years</option>
											<option value="2-3 years">2-3 years</option>
											<option value="More than 3 years">More than 3 years</option>
										</select>
									</li>
									<li className="personal-info-list-item row middle-xs">
										<label className="personal-info-list-item-title col-xs-4">Gender</label>
										<select
											type="select"
											className="col-xs-6"
											value={this.state.gender}
											onChange={(e)=>{self._handleSelectChange('gender', e)}}
											placeholder="Gender"
										>
											<option value="male">Male</option>
											<option value="female">Female</option>
										</select>
									</li>
									<li className="personal-info-list-item row middle-xs">
										<label className="personal-info-list-item-title col-xs-4">Contact Phone</label>
										<input
											type="text"
											className="col-xs-6"
											value={this.state.contact_phone}
											onChange={(e)=>{self._handleInputChange('contact_phone', e)}}
											placeholder="Contact Phone"
										/>
									</li>
									<li className="personal-info-list-item center-xs middle-xs" style={{paddingBottom: 5, borderBottom: 'none'}}>
										<button className="button-raised" disabled={!this.state.infoLoadCompleted} style={{backgroundColor: '#02b81b',width: '80%'}}>{this.state.infoLoadCompleted ? 'Submit' : 'Submiting...'}</button>
									</li>
								</ul>
							</form>
							<div className="center-xs" style={{marginTop: 5}}>
								<button className="button-raised" style={{backgroundColor: '#c9394a',width: '80%'}} onClick={this._logout}>Log out</button>
							</div>
							{
								this.state.infoLoadCompleted?
								null
								:
								<Loader />
							}
						</tab>
						<tab title="History Task">
							<div className="history-task">
								<ul className="history-task-header row">
					              <li className="col-xs-2">Date</li>
					              <li className="col-xs-7">Task Name</li>
					              <li className="col-xs-3">Details</li>
								</ul>
								<div className="history-task-list">
									{this.state.tasks.map((item)=>{
										let startTime = new Date(item.start_time);
										return(
											<div>
												<ul className="history-task-list-item row middle-xs">
									                <li className="col-xs-2">{String(startTime.getMonth() + 1) + '.' + startTime.getDate()}</li>
									                <li className="col-xs-7">{item.task_title}</li>
									                <li className="col-xs-3 history-task-list-item-button" style={{cursor: 'pointer'}} onClick={()=>{self._showDetail(item.task_id)}}><h3 >Detail <i className="zmdi zmdi-chevron-down"></i></h3></li>
												</ul>
								                {
								                	this.state.currentTaskId == item.task_id?
								                	<ul className="history-task-detail row middle-xs">
								                		<li className="history-task-detail-item col-xs-12">
								                			<label className="history-task-detail-title" style={{display: 'inline'}}>Your sroce:</label>
								                			<span className="history-task-detail-content">{item.rating}</span>
								                		</li>
								                		<li className="history-task-detail-item col-xs-12">
								                			<label className="history-task-detail-title" style={{display: 'inline'}}>Actual Length:</label>
								                			<span className="history-task-detail-content">{item.length}</span>
								                		</li>
								                		<li className="history-task-detail-item col-xs-12">
								                			<label className="history-task-detail-title">Tutor note on you:</label>
								                			<p className="history-task-detail-content">{item.tutor_on_learner}</p>
								                		</li>
								                		<li className="history-task-detail-item col-xs-12">
								                			<label className="history-task-detail-title">Notes on task:</label>
								                			<p className="history-task-detail-content">{item.learner_on_task}</p>
								                		</li>
								                		<li className="history-task-detail-item col-xs-12">
								                			<label className="history-task-detail-title">Notes on tutor:</label>
								                			<p className="history-task-detail-content">{item.learner_on_tutor}</p>
								                		</li>
								                	</ul>
								                	:
								                	null
								                }
							                </div>
										);
									})}
								</div>
							</div>
							{
								this.state.findNothing?
								<Error />
								:
								null
							}
							{
								this.state.historyLoadCompleted?
								null
								:
								<Loader />
							}
						</tab>
					</Tabs>
				</section>

			</div>
		);
	}
});

module.exports = Fast ;