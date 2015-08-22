'use strict';

let React = require('react');
let Router = require('react-router');

let cookie = require('cookie-cutter');
let reqwest = require('reqwest');

let Error = require('../components/error.jsx');
let Loader = require('../components/loader.jsx');
//let checkStatus = require('../utils/check-status.js');

let Fast = React.createClass({
	page: 1,
	mixins: [Router.Navigation],
	getInitialState() {
	    return {
	        materials: [],
	        topics: [],
	        currentTopic: '',
	        currentLevel: '',
	        topicSpread: false,
	        loadCompleted: false,
	        loadButton: true,
	        findNothing: false,
	    };
	},
	componentWillMount() {
	    this.getMaterial(1,'','','',true);
	    this.getTopic();
	},
	getTopic(){
		let self = this;
	    reqwest({
	        url: 'http://api.flipchinese.com/api/v1/materials/topics?free=1'
	      , type: 'json'
	      , method: 'get'
	      , success(resp) {
	      	self.setState({topics: resp});
	      }
	      , error(err){
      		console.log(err);
	      }
	    });
	},
	getMaterial(page,topic,level,title,initial){
		let self = this;
		this.setState({loadCompleted: false,})
	    reqwest({
	        url: 'http://api.flipchinese.com/api/v1/materials?page='+page+'&topic='+topic+'&level='+level+'&title='+title+'&free=1'
	      , type: 'json'
	      , method: 'get'
	      , success(resp) {
	      		if(resp.materials &&　resp.materials.length != 0){
			      	self.setState({
			      		materials: initial ? resp.materials : self.state.materials.concat(resp.materials),
			      		loadCompleted: true,
			      		loadButton: resp.materials && resp.materials.length >= 6 ? true : false,
			      		findNothing: false,
			      	});
			      }else{
			      	self.setState({
			      		materials: initial ? [] : self.state.materials,
			      		findNothing: initial,
			      		loadButton: false,
			      		loadCompleted: true,
			      	});
			      }
	      }
	      , error(err){
	      		console.log(err);
	      		self.setState({
	      			loadCompleted: true,
	      		});
	      }
	    });
	},
	_spreadTopic(){
		this.setState({
			topicSpread: !this.state.topicSpread
		});
	},
	_handleTopicChange(val){
		this.page = 1;
		this.getMaterial(1,val,'','',true);
		this.setState({
			currentTopic: val,
			topicSpread: false,
			materials: [],
		});
	},
	_handleLevelChange(val){
		this.page = 1;
		this.getMaterial(1,'',val,'',true);
		this.setState({
			currentLevel: val,
			topicSpread: false,
			materials: [],
		});
	},
	_enterMaterial(id){
		this.transitionTo('/main/material/' + id ,{},{free: 1});
	},
	_loadMore(){
		this.getMaterial(++this.page,this.state.currentTopic,this.state.currentLevel,'',false);
	},
	render(){
		let self = this;
		return(
			<div className="main">
				<section className="appbar">
					<ul className="appbar-list row middle-xs">
						<li className="appbar-icon col-xs-1 start-xs" style={{cursor: 'pointer'}} onClick={()=>{this.goBack()}}>
							<i className="zmdi zmdi-chevron-left"></i>
						</li>
						<li className="appbar-title col-xs-10 row center-xs" style={{cursor: 'pointer'}} onClick={this._spreadTopic}>
							<h4>China Life<i className="zmdi zmdi-caret-down"></i></h4>
							
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
					{
						this.state.topicSpread?
						<section>
							<ul className="topic-list">
								<li style={{cursor: 'pointer'}} onClick={()=>{self._handleLevelChange('')}}>
									<div className={this.state.currentLevel == '' ? 'active topic-kind center-xs' : 'topic-kind center-xs'}>
										All Levels
									</div>
									<hr className="topic-line-kind" />
								</li>
								<li style={{cursor: 'pointer'}} onClick={()=>{self._handleLevelChange(11)}}>
									<div className={this.state.currentLevel == 11 ? 'active topic-item' : 'topic-item'}>
										Just Arrived
									</div>
									<hr className="topic-line-item" />
								</li>
								<li style={{cursor: 'pointer'}} onClick={()=>{self._handleLevelChange(12)}}>
									<div className={this.state.currentLevel == 12 ? 'active topic-item' : 'topic-item'}>
										Stayed Months or Years
									</div>
									<hr className="topic-line-item" />
								</li>
								<br />
								<li style={{cursor: 'pointer'}} onClick={()=>{self._handleTopicChange('')}}>
									<div className={this.state.currentTopic == '' ? 'active topic-kind center-xs' : 'topic-kind center-xs'}>
										All Topics
									</div>
									<hr className="topic-line-kind" />
								</li>
								{this.state.topics.map((item)=>{
									return(
										<li style={{cursor: 'pointer'}} onClick={()=>{self._handleTopicChange(item)}}>
											<div className={this.state.currentTopic == item ? 'active topic-item' : 'topic-item'}>
												{item}
											</div>
											<hr className="topic-line-item" />
										</li>
									)
								})}
							</ul>
						</section>
						:
						null
					}
				<section >
					<ul className="material-list container-fluid">
						{this.state.materials.map((item)=>{
							return(
								<li style={{cursor: 'pointer'}} className="row" onClick={()=>{this._enterMaterial(item.id)}}>
									<div className="col-xs-6">
										<img src={item.thumb + '-flipchinesesj'} className="material-img" />
									</div>
									<div className="col-xs-6 material-info">
										<h4 className="material-title">{item.title}</h4>
										{
											item.topic?
											<p><i className="material-pin zmdi zmdi-pin"></i>{item.topic}</p>
											:
											null
										}
									</div>
								</li>
							);
						})}
						{
							this.state.loadCompleted && this.state.loadButton ?
							<li className="middle-xs center-xs" style={{marginTop: 10, borderBottom: 'none'}}>
								<button className="button-raised" style={{width: '80%'}} onClick={this._loadMore}>Load More</button>
							</li>
							:
							null
						}
					</ul>
				</section>
				{
					this.state.loadCompleted?
					null
					:
					<Loader />
				}
				{
					this.state.findNothing?
					<Error content="Find Nothing..." handleBack={()=>{this.getMaterial(1,'','','',true);}}/>
					:
					null
				}

			</div>
		);
	}
});

module.exports = Fast ;