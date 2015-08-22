let React = require('react');
let Router = require('react-router');
let Tabs = require('./tabs.jsx');
let Loader = require('./loader.jsx');

let reqwest = require('reqwest');
let cookie = require('cookie-cutter');
let _ = require('underscore');

let isEmpty = (obj)=>{
    if(obj instanceof Array){
        return obj.length && obj.length == 0;
    }else if(obj instanceof Object){
        let key;
        for(key in obj){
            return false;
        }
        return true;
    }else{
        if(obj){
            return false;
        }else{
            return true;
        }
    }
};

let Material = React.createClass({
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
                image: null,
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
    componentWillReceiveProps(nextProps) {
        if(this.detectBrowser(nextProps.id)){
            this.getMaterial(nextProps.id);
        }
    },
	componentWillMount() {
        if(this.detectBrowser(this.props.id)){
            this.getMaterial(this.props.id);
        }
	},
    detectBrowser(material_id){  
        let sUserAgent = navigator.userAgent.toLowerCase();  
        let isIpad = sUserAgent.match(/ipad/i) == 'ipad';    
        let isIphone = sUserAgent.match(/iphone/i) == 'iphone';  
        let isMac = sUserAgent.match(/macintosh/i) == "macintosh";
        let isAndroid = sUserAgent.match(/android/i) == 'android'; 
        if(!isIphone && !isAndroid){
            window.location.href = 'http://www.flipchinese.com/#/material/' + material_id;
            return false;
        }else{
            return true;
        }
    },
	getMaterial(material_id){
        let self = this;
	    reqwest({
	        url: 'http://api.flipchinese.com/api/v1/materials/' + material_id + '?user_id=' + cookie.get('user_id') + '&auth_token=' + cookie.get('auth_token')
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
    _combineText(text1,text2,word){
        let Array1 = text1.split(word);
        let Array2 = text2.split(word);
        let _array = _.map(_.zip(Array1,Array2),function(arr){
            return _.map(arr,function(word,i){
                return i === 1 ? word + '<br /><br />' : word + '<br />'
            });
        });
        return _.flatten(_array).toString().replace(new RegExp(',', 'gm'), '');
    },
    _filterText(text){
        return text.replace(new RegExp('\n', 'gm'), '<br /><br />');
    },
	render(){
		if(this.state.loadCompleted){
	        let videoMeal = <div className="col-xs-12">
	                            <video id="video-obj" width="100%" controls="controls" src={this.state.media.video}/>
	                        </div> ;

	        let wordMeal = <div className="col-xs-12"><div className="editor" dangerouslySetInnerHTML={{__html: this.state.media.text}} /></div> ;

	        let audioMeal = <div className="col-xs-12">
	                            <audio style={{width: '100%',maxWidth:'560px'}} controls="controls">
	                                <source src={this.state.media.audio} type="audio/mpeg"/>
	                            </audio>
	                            {this.state.scripts.text ? wordMeal : <img src={this.state.media.thumb} style={{width: '100%', height: 'auto', marginTop: 10}} /> }
	                        </div> ; 
	        let pdfMeal = <div className="col-xs-12">
	                        <button className="button-raised" onClick={()=>{window.open(this.props.pdf)}}>Download PDF</button>
	                      </div>;

            let mediaMeal = this.state.media.video ? videoMeal : this.state.media.video ? videoMeal : this.state.media.pdf ? pdfMeal : this.state.media.audio ? audioMeal : this.state.media.text ? wordMeal : this.state.media.image ? <img src={this.state.media.image} style={styles.image} /> : this.state.media.thumb ? <img src={this.state.media.thumb} style={styles.thumb} /> : null  ;
	        let hanziMeal = <div className="hanziMeal editor" dangerouslySetInnerHTML={{__html: this._combineText(this.state.scripts.pinyin, this.state.scripts.hanzi,'\r')}} />;
	        let translationMeal = <div className="hanziMeal editor" dangerouslySetInnerHTML={{__html: this._filterText(this.state.scripts.translation)}} />;
			return(
				<div className="main">
					<section className="appbar">
						<ul className="appbar-list row middle-xs">
							<li className="appbar-icon col-xs-1 start-xs" style={{cursor: 'pointer'}} onClick={()=>{this.goBack()}}>
								<i className="zmdi zmdi-chevron-left"></i>
							</li>
							<li className="appbar-title col-xs-10 row center-xs">
								<h4>{this.state.title ? this.state.title : 'Material'}</h4>
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
					<section style={{height: 'auto'}}>
	                {
	                    this.state.scripts.hanzi && this.state.scripts.pinyin && this.state.scripts.translation ?
	                     <div>
		                     <div className="mediaMeal">
								{mediaMeal}
		                     </div>
                            
                            <Tabs>
                                <tab title="hanzi & pinyin" style={{fontSize: 14}}>
                                    <div style={{padding: 10}}>
                                        {hanziMeal}
                                    </div>
                                </tab>
                                <tab title="translation" style={{fontSize: 14}}>
                                    <div style={{padding: 10}}>
                                        {translationMeal}
                                    </div>
                                </tab>
                            </Tabs>
	                    </div>
	                    :
	                     <div className="mediaMeal">
                            {mediaMeal}
	                    </div>
	                }
                    {
                        !isEmpty(this.state.kp.grammar) || !isEmpty(this.state.kp.voc) || !isEmpty(this.state.kp.character) ?
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
                                <div className="explain-content-text editor" dangerouslySetInnerHTML={{__html: this.state.explain}} />
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
							<li className="appbar-icon col-xs-1 start-xs" onClick={()=>{this.goBack()}}>
								<i className="zmdi zmdi-chevron-left"></i>
							</li>
							<li className="appbar-title col-xs-10 row center-xs middle-xs">
								<h4>Material</h4>
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

module.exports = Material ;