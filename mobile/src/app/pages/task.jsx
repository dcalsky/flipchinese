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
            loadCompleted: false,
            findNothing: false,
            title: null,
            intro: null,
            media: {
                video: null,
                audio: null,
                text: null,
                thumb: null,
            },
            scripts: {
                hanzi: null,
                translation: null,
                pinyin: null
            },
            kp: {
                grammar: null,
                voc: null,
                character: null
            },
            explain: null,
	    };
	},
	componentWillMount() {
        this.getTask();
	},
	getTask(){
        let self = this;
	    reqwest({
	        url: self.getQuery().free == 1 ? 'http://api.flipchinese.com/api/v1/materials/' + this.getParams().id : 'http://api.flipchinese.com/api/v1/materials/' + this.getParams().id + '?user_id=' + cookie.get('user_id') + '&auth_token=' + cookie.get('auth_token')
	      , type: 'json'
	      , method: 'get'
	      , success(resp) {
            self.setState({
                title: resp.material.title,
                intro: resp.material.intro,
                media: {
                    video: resp.material.video,
                    audio: resp.material.audio,
                    text: resp.material.text,
                    thumb: resp.material.thumb,
                },
                scripts: {
                    hanzi: resp.material.hanzi,
                    translation: resp.material.translation,
                    pinyin: resp.material.pinyin
                },
                kp: {
                    grammar: resp.material.grammar,
                    voc: resp.material.voc,
                    character: resp.material.character
                },
                explain: resp.material.explain,
                free: resp.material.free,
                loadCompleted: true
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
                                    this.transitionTo('account');
                                }else{
                                    this.transitionTo('login');
                                }
                            }}>
                                <i style={{fontSize: 24}} className="zmdi zmdi-account-circle"></i>
                            </li>
						</ul>
					</section>
					<section>
	                {
	                    this.state.scripts.hanzi && this.state.scripts.pinyin && this.state.scripts.translation ?
	                     <div>
		                     <div className="mediaMeal">
								{mediaMeal}
		                     </div>
                            
                            <Tabs>
                                <tab title="hanzi & pinyin" style={{fontSize: 14}}>
                                    {hanziMeal}
                                </tab>
                                <tab title="translation" style={{fontSize: 14}}>
                                    {translationMeal}
                                </tab>
                            </Tabs>
	                    </div>
	                    :
	                     <div className="mediaMeal">
                            {mediaMeal}
	                    </div>
	                }
                    {
                        this.state.kp.grammar || this.state.kp.voc || this.state.kp.character?
                        <div>
                            <Tabs>
                                <tab title="Grammar" >
                                    {this.state.kp.grammar}
                                </tab>
                                <tab title="Voc" >
                                    {this.state.kp.voc}
                                </tab>
                                <tab title="Character" >
                                    {this.state.kp.character}
                                </tab>
                            </Tabs>
                        </div>
                        :
                        null
                    }
                    {
                        this.state.explain?
                        <div className="explainMeal">
                            <div className="explain-header center-xs">
                                <p className="middle-xs">Explain</p>
                            </div>
                            <div className="explain-content start-xs">
                                <div className="explain-content-text" dangerouslySetInnerHTML={{__html: this.state.explain}} />
                            </div>
                        </div>
                        :
                        null
                    }
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