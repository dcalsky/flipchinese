'use strict';

let React = require('react');
let Router = require('react-router');

let cookie = require('cookie-cutter');
let reqwest = require('reqwest');
let _ = require('underscore');

let Error = require('../components/error.jsx');
let Loader = require('../components/loader.jsx');
//let checkStatus = require('../utils/check-status.js');

let Fast = React.createClass({
	mixins: [Router.Navigation, Router.State],
	getInitialState() {
	    return {
	        materials: [],
	        loadCompleted: false,
	        tasks: [],
	        ableToEnter: [],
	        pack: null,
	    };
	},
	componentWillMount() {
	    this.getPack(this.getParams().id, cookie.get('user_id'), cookie.get('auth_token'));
	},
	getPack(id, user_id, auth_token){
		let self = this;
		this.setState({loadCompleted: false,});
		if(cookie.get('user_id') && cookie.get('auth_token')){
			//getMypack
		    reqwest({
		        url: 'http://api.flipchinese.com/api/v1/users/' + user_id + '/pack_items?user_id=' + user_id + '&auth_token=' + auth_token
		      , type: 'json'
		      , method: 'get'
		      , success(resp) {
			      	console.log(resp)
			      	let packIds = _.map(resp.pack_items,(item)=>{
			      		return item.pack.id;
			      	});
			      	self.setState({
			      		ableToEnter: packIds.indexOf(parseInt(id)) == -1 ? false : true,
			      	});
			      	self._getThisPack(id)
		      }
		      , error(err){
		      		console.log(err);
		      		self.setState({
		      			loadCompleted: true,
		      		});
		      }
		    });
		}else{
	      	this.setState({
	      		ableToEnter: false
	      	});
			this._getThisPack(id);
		}
	},
	_getThisPack(id){
		let self = this;
	    reqwest({
	        url: 'http://api.flipchinese.com/api/v1/packs/' + id
	      , type: 'json'
	      , method: 'get'
	      , success(resp) {
		      	console.log(resp)
		      	self.setState({
		      		materials: resp.pack.materials,
		      		tasks: resp.pack.tasks,
		      		pack: resp.pack,
		      		loadCompleted: true,
		      	});
	      }
	      , error(err){
	      		console.log(err);
	      		self.setState({
	      			loadCompleted: true,
	      		});
	      }
	    });
	},
	_enterMaterial(id){
		if(this.state.ableToEnter){
			this.transitionTo('/material/' + id);
		}else{
			alert('Please login or buy this pack...');
		}

	},
	_enterTask(id){
		if(this.state.ableToEnter){
			this.transitionTo('/task/' + id);
		}else{
			alert('Please log in or buy this pack...');
		}
	},
	render(){
		let self = this;
		return(
			<div className="main">
				<section className="appbar">
					<ul className="appbar-list row middle-xs">
						<li className="appbar-icon col-xs-2 start-xs" style={{cursor: 'pointer'}} onClick={()=>{this.goBack()}}>
							<i className="zmdi zmdi-chevron-left"></i>
						</li>
						<li className="appbar-title col-xs-9 row center-xs" style={{cursor: 'pointer'}} onClick={this._spreadTopic}>
							<h4>{this.state.pack ? this.state.pack.title : 'Pack Inside'}</h4>
						</li>
						<li className="col-xs-1 end-xs" style={{cursor: 'pointer'}} onClick={()=>{
							if(cookie.get('user_id') && cookie.get('auth_token')){
								this.transitionTo('account');
							}else{
								this.transitionTo('login');
							}
						}}>
							<i style={{fontSize: 24}} className="zmdi zmdi-account-circle"></i>
						</li>
					</ul>
				</section>
				{
					this.state.pack ?
					<section style={{padding: '15px 15px 0 15px'}}>
						<div style={{fontSize: '0.9em', fontWeight: 400,}} dangerouslySetInnerHTML={{__html: this.state.pack.intro}} />
					</section>
					:
					null
				}
				<section >
				{
					this.state.materials && this.state.materials.length != 0 ?
					<div>
                        <div className="explainMeal">
                            <div className="explain-header center-xs">
                                <p className="middle-xs">Materials</p>
                            </div>
                            <div className="explain-content start-xs">
                                <ul className="material-list">
									{this.state.materials.map((item)=>{
										return(
											<li key={item.id} className="row middle-xs" style={{cursor: 'pointer'}} onClick={()=>{this._enterMaterial(item.id)}}>
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
                                </ul>
                            </div>
                        </div>
					</div>
					:
					null
				}
				{
					this.state.tasks && this.state.tasks.length != 0 ?
					<div>
                        <div className="explainMeal">
                            <div className="explain-header center-xs">
                                <p className="middle-xs">Tasks</p>
                            </div>
                            <div className="explain-content start-xs">
                                <ul className="material-list">
									{this.state.tasks.map((item)=>{
										return(
											<li key={item.id} className="row middle-xs" style={{cursor: 'pointer'}} onClick={()=>{this._enterTask(item.id)}}>
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
                                </ul>
                            </div>
                        </div>
					</div>
					:
					null
				}
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