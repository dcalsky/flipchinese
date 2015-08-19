let React = require('react');
let Router = require('react-router');

let cookie = require('cookie-cutter');
let reqwest = require('reqwest');

let Error = require('../components/error.jsx');
let Loader = require('../components/loader.jsx');
//let checkStatus = require('../utils/check-status.js');

let MyPack = React.createClass({
	page: 1,
	mixins: [Router.Navigation],
	getInitialState() {
	    return {
	        packs: [],
	        loadCompleted: false,
	        findNothing: false,
	    };
	},
	componentWillMount() {
		if(cookie.get('user_id') && cookie.get('auth_token')){
			this.getPacks(cookie.get('user_id'), cookie.get('auth_token'));
		}else{
			window.location.href = '#/main/login';
		}  
	},
	getPacks(user_id, auth_token){
		let self = this;
		this.setState({loadCompleted: false,})
	    reqwest({
	        url: 'http://api.flipchinese.com/api/v1/users/'+user_id+'/pack_items?id='+user_id+'&user_id='+user_id+'&auth_token='+auth_token
	      , type: 'json'
	      , method: 'get'
	      , success(resp) {
	      		if(resp.pack_items &&　resp.pack_items.length != 0){
			      	self.setState({
			      		packs: resp.pack_items,
			      		loadCompleted: true,
			      		findNothing: false,
			      	});
	      		}else{
			      	self.setState({
			      		packs: [],
			      		loadCompleted: true,
			      		findNothing: true,
			      	});
	      		}
	      }
	      , error(err){
      		console.log(err);
      		this.setState({
      			loadCompleted: true,
      			findNothing: true,
      		});
	      }
	    });
	},
	_enterPack(id, pack_item){
		this.transitionTo('/main/pack-inside/' + id, {}, {pack_item: pack_item});
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
						<li className="appbar-title col-xs-9 row center-xs">
							<h4>My Packs</h4>
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
				<section >
					<ul className="material-list">
						{this.state.packs.map((item)=>{
							return(
								<li className="row middle-xs" style={{cursor: 'pointer'}} onClick={()=>{this._enterPack(item.pack.id, item.id)}}>
									<div className="col-xs-6">
										<img src={item.pack.thumb} className="material-img" />
									</div>
									<div className="col-xs-6">
										<h4 className="material-title">{item.pack.title}</h4>
										<p><i className="material-pin zmdi zmdi-pin"></i>{item.pack.topic}</p>
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
					<div style={{marginTop: 30}}>
						<p style={{fontSize: '1em', fontWeight: 400, color: '#1967d2', margin: '15px 15px'}}>Welcome! Find your packs and buy them on computer! Then start your learning!</p>
						<Error  buttonLabel="Find Packs" handleBack={()=>{this.transitionTo('/main/focus')}} />
					</div>
					:
					null
				}

			</div>
		);
	}
});

module.exports = MyPack ;