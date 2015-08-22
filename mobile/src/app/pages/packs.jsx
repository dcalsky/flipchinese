let React = require('react');
let Router = require('react-router');

let cookie = require('cookie-cutter');
let reqwest = require('reqwest');

let Error = require('../components/error.jsx');
let Loader = require('../components/loader.jsx');
//let checkStatus = require('../utils/check-status.js');

let Pack = React.createClass({
	page: 1,
	mixins: [Router.Navigation],
	getInitialState() {
	    return {
	        packs: [],
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
	    this.getPacks(1,'','','',true);
	    this.getTopic();
	},
	getTopic(){
		let self = this;
	    reqwest({
	        url: 'http://api.flipchinese.com/api/v1/packs/topics'
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
	getPacks(page,topic,level,title,initial){
		let self = this;
		this.setState({loadCompleted: false,})
	    reqwest({
	        url: 'http://api.flipchinese.com/api/v1/packs?page='+page+'&topic='+topic+'&level='+level+'&title='+title
	      , type: 'json'
	      , method: 'get'
	      , success(resp) {
	      		if(resp.packs &&　resp.packs.length != 0){
			      	self.setState({
			      		packs: initial ? resp.packs : self.state.packs.concat(resp.packs),
			      		loadCompleted: true,
			      		loadButton: resp.packs && resp.packs.length >= 6 ? true : false,
			      		findNothing: false,
			      	});
	      		}else{
			      	self.setState({
			      		packs: initial ? [] : resp.packs,
			      		loadCompleted: true,
			      		loadButton: false,
			      		findNothing: initial,
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
		this.getPacks(1,val,'','',true);
		this.setState({
			currentTopic: val,
			topicSpread: false,
			packs: [],
		});
	},
	_handleLevelChange(val){
		this.page = 1;
		this.getPacks(1,'',val,'',true);
		this.setState({
			currentLevel: val,
			topicSpread: false,
			packs: [],
		});
	},
	_loadMore(){
		this.getPacks(++this.page,this.state.currentTopic,this.state.currentLevel,'',false);
	},
	_enterPack(id){
		this.transitionTo('/main/pack-inside/' + id);
	},
	render(){
		let self = this;
		return(
			<div className="main">
				<section className="appbar">
					<ul className="appbar-list row middle-xs">
						<li className="appbar-icon col-xs-1" style={{cursor: 'pointer'}} onClick={()=>{this.goBack()}}>
							<i className="zmdi zmdi-chevron-left"></i>
						</li>
						<li className="appbar-title col-xs-10 row center-xs" style={{cursor: 'pointer'}} onClick={this._spreadTopic}>
							<h4>Learn Chinese<i className="zmdi zmdi-caret-down"></i></h4>
						</li>
						<li className="col-xs-1 end-xs" style={{cursor: 'pointer'}} onClick={()=>{
							if(cookie.get('user_id') && cookie.get('auth_token')){
								this.transitionTo('/main/account');
							}else{
								this.transitionTo('/main/login');
							}
						}}>
							<i style={{fontSize: 26}} className="zmdi zmdi-account-circle"></i>
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
								<li style={{cursor: 'pointer'}} onClick={()=>{self._handleLevelChange(1)}}>
									<div className={this.state.currentLevel == 1 ? 'active topic-item' : 'topic-item'}>
										Zero Beginner
									</div>
									<hr className="topic-line-item" />
								</li>
								<li style={{cursor: 'pointer'}} onClick={()=>{self._handleLevelChange(2)}}>
									<div className={this.state.currentLevel == 2 ? 'active topic-item' : 'topic-item'}>
										Beginner
									</div>
									<hr className="topic-line-item" />
								</li>
								<li style={{cursor: 'pointer'}} onClick={()=>{self._handleLevelChange(3)}}>
									<div className={this.state.currentLevel == 3 ? 'active topic-item' : 'topic-item'}>
										Intermediate
									</div>
									<hr className="topic-line-item" />
								</li>
								<li style={{cursor: 'pointer'}} onClick={()=>{self._handleLevelChange(4)}}>
									<div className={this.state.currentLevel == 4 ? 'active topic-item' : 'topic-item'}>
										Advanced
									</div>
									<hr className="topic-line-item" />
								</li>
								<li style={{cursor: 'pointer'}} onClick={()=>{self._handleLevelChange(5)}}>
									<div className={this.state.currentLevel == 5 ? 'active topic-item' : 'topic-item'}>
										All Levels Applied
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
					<ul className="material-list">
						{this.state.packs.map((item)=>{
							return(
								<li className="row middle-xs" style={{cursor: 'pointer'}} onClick={()=>{this._enterPack(item.id)}}>
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
							<li className="middle-xs center-xs" style={{borderBottom: 'none'}}>
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
					<Error content="Find Nothing..." handleBack={()=>{this.getPacks(1,'','','',true)}} />
					:
					null
				}

			</div>
		);
	}
});

module.exports = Pack ;