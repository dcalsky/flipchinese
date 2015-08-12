let React = require('react');
let Router = require('react-router');

let cookie = require('cookie-cutter');
let reqwest = require('reqwest');

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
	        loadButton: true
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
	      	console.log(resp)
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
	      	console.log(resp)
	      	self.setState({
	      		packs: initial ? resp.packs : self.state.packs.concat(resp.packs),
	      		loadCompleted: true,
	      		loadButton: resp.packs && resp.packs.length >= 6 ? true : false
	      	});
	      }
	      , error(err){
      		console.log(err);
      		this.setState({
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
			materials: [],
		});
	},
	_handleLevelChange(val){
		this.page = 1;
		this.getPacks(1,'',val,'',true);
		this.setState({
			currentLevel: val,
			topicSpread: false,
			materials: [],
		});
	},
	_loadMore(){
		this.getPacks(++this.page,this.state.currentTopic,this.state.currentLevel,'',false);
	},
	render(){
		let self = this;
		return(
			<div className="main">
				<section className="appbar">
					<ul className="appbar-list row">
						<li className="appbar-icon col-xs-2 start-xs" onClick={()=>{this.goBack()}}>
							<i className="zmdi zmdi-chevron-left"></i>
						</li>
						<li className="appbar-title col-xs-9 row center-xs middle-xs" onClick={this._spreadTopic}>
							<h4>Focus</h4>
							<i className="zmdi zmdi-caret-down bottom-xs"></i>
						</li>
						<li className="col-xs-1 end-xs"></li>
					</ul>
				</section>
					{
						this.state.topicSpread?
						<section className="material-list">
							<ul className="topic-list">
								<li onClick={()=>{self._handleLevelChange('')}}>
									<div className={this.state.currentLevel == '' ? 'active topic-kind center-xs' : 'topic-kind center-xs'}>
										All Levels
									</div>
									<hr className="topic-line-kind" />
								</li>
								<li onClick={()=>{self._handleLevelChange(1)}}>
									<div className={this.state.currentLevel == 1 ? 'active topic-item' : 'topic-item'}>
										Zero Beginner
									</div>
									<hr className="topic-line-item" />
								</li>
								<li onClick={()=>{self._handleLevelChange(2)}}>
									<div className={this.state.currentLevel == 2 ? 'active topic-item' : 'topic-item'}>
										Beginner
									</div>
									<hr className="topic-line-item" />
								</li>
								<li onClick={()=>{self._handleLevelChange(3)}}>
									<div className={this.state.currentLevel == 3 ? 'active topic-item' : 'topic-item'}>
										Intermediate
									</div>
									<hr className="topic-line-item" />
								</li>
								<li onClick={()=>{self._handleLevelChange(4)}}>
									<div className={this.state.currentLevel == 4 ? 'active topic-item' : 'topic-item'}>
										Advanced
									</div>
									<hr className="topic-line-item" />
								</li>
								<li onClick={()=>{self._handleLevelChange(5)}}>
									<div className={this.state.currentLevel == 5 ? 'active topic-item' : 'topic-item'}>
										All Levels Applied
									</div>
									<hr className="topic-line-item" />
								</li>
								<br />
								<li onClick={()=>{self._handleTopicChange('')}}>
									<div className={this.state.currentTopic == '' ? 'active topic-kind center-xs' : 'topic-kind center-xs'}>
										All Topics
									</div>
									<hr className="topic-line-kind" />
								</li>
								{this.state.topics.map((item)=>{
									return(
										<li onClick={()=>{self._handleTopicChange(item)}}>
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
								<li className="row middle-xs">
									<div className="col-xs-6">
										<img src={item.thumb} className="material-img" />
									</div>
									<div className="col-xs-6">
										<h4 className="material-title">{item.title}</h4>
										<p><i className="material-pin zmdi zmdi-pin"></i>{item.topic}</p>
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

			</div>
		);
	}
});

module.exports = Pack ;