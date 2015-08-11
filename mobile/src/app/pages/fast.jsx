let React = require('react');
let Router = require('react-router');

let cookie = require('cookie-cutter');
let _ = require('underscore');
let reqwest = require('reqwest');

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
	        loadButton: true
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
	      	console.log(resp)
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
	      	self.setState({
	      		materials: initial ? resp.materials : self.state.materials.concat(resp.materials),
	      		loadCompleted: true,
	      		loadButton: resp.materials && resp.materials.length >= 6 ? true : false
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
	_loadMore(){
		this.getMaterial(this.page++,this.state.currentTopic,this.state.currentLevel,'',false);
	},
	render(){
		let self = this;
		return(
			<div className="fast">
				<section className="appbar">
					<ul className="appbar-list row">
						<li className="appbar-icon col-xs-2 start-xs">
							<i className="zmdi zmdi-chevron-left"></i>
						</li>
						<li className="appbar-title col-xs-9 row center-xs middle-xs" onClick={this._spreadTopic}>
							<h4>Fast</h4>
							<i className="zmdi zmdi-caret-down bottom-xs"></i>
						</li>
						<li className="col-xs-1 end-xs"></li>
					</ul>
				</section>
					{
						this.state.topicSpread?
						<section className="material-list">
							<ul className="topic-list">
								<li className={this.state.currentTopic == '' ? 'active' : ''} onClick={()=>{self._handleTopicChange('')}}>All Topics</li>
								{this.state.topics.map((item)=>{
									return(
										<li className={this.state.currentTopic == item ? 'active' : ''} onClick={()=>{self._handleTopicChange(item)}}>{item}</li>
									)
								})}
							</ul>
						</section>
						:
						null
					}
				<section >
					<ul className="material-list">
						{this.state.materials.map((item)=>{
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
							this.state.loadButton ?
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

module.exports = Fast ;