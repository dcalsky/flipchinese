'use strict';

let cookie = require('cookie-cutter');
let React = require('react/addons');
let Router = require('react-router');

let _ = require('underscore');

let Error = require('../components/error.jsx');
let MainStyle = require('../styles/main-style.jsx');
let Progress = require('../components/progress.jsx');
let Tabs = require('../components/tabs.jsx');

let checkStatus = require('../../utils/check-status.js');

let styles = {
    title: {
        paddingBottom: 30,
    },
    subTitle: {
        textAlign: 'center',
        fontSize: 17,
    },
    content: {
        padding: '20px 0 30px 0',
    },
    hanziMeal: {
        padding: '0 10px',
        boxShadow: '0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)',
        maxHeight: 450,
        minHeight: 250,
        fontSize: 15,
        fontFamily: "'Helvetica', 'Arial', sans-serif",
        lineHeight: 1.7,
        overflowY: 'auto'
    },
    mediaBox: {
        paddingBottom: 30,
    },
    wordMeal: {
        width: '100%',
    },
    footer: {
        display: 'block',
        padding: '25px 0',
    },
    image: {
        width: '100%',
        height: 'auto',
    },
    thumb: {
        width: '100%',
        height: 'auto',
        paddingTop: 20,
    },
    explain: {
        padding: 0,
        margin: '30px 0',
        boxShadow: '0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)',
    },
    explainHeader: {
        position: 'relative',
        backgroundColor: '#1976d2',
        fontSize: 18,
        color: '#fff',
        minHeight: 40,
        lineHeight: '40px',
    },
    explainContent: {
        padding: 25,
    },
    kpList: {
        listStyle: 'none',
        padding: 10,
        lineHeight: '2',
        boxShadow: '0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)',
    },
    kpItem: {
        fontSize: '1.5em',
        fontWeight: 400,
    }
}

let fetcher = {
    get(id,user_id,auth_token, callback) {
        fetch('http://api.flipchinese.com/api/v1/materials/' + id + '?user_id=' + user_id + '&auth_token=' + auth_token)
            .then(checkStatus)
            .then(function (data) {
                callback(data)
            }).catch(function (error) {
                console.log(error)
                window.location.href = '#/main/connect-error';
            });
    },
    getUserContent(user_id, auth_token, callback){
        fetch('http://api.flipchinese.com/api/v1/users/' + user_id + '/content?user_id=' + user_id + '&auth_token=' + auth_token)
            .then(checkStatus)
            .then(function (data) {
                callback(data)
            }).catch(function (error) {
                console.log(error);
                window.location.href = '#/main/connect-error';
            });
    },
};

let Material = React.createClass({
    mixins: [Router.Navigation, Router.State, React.addons.LinkedStateMixin],
    contextTypes() {
        router: React.PropTypes.func
    },
    getInitialState() {
        return {
            materialLoadCompleted: false,
            findNothing: false,
            title: null,
            intro: null,
            media: {
                video: null,
                audio: null,
                pdf: null,
                text: null
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
            materialTopics: [],
        };
    },
    componentWillMount() {
        if(this.detectBrowser()){
            mixpanel.track("open", {
                'where': "material-id",
                'id': this.getParams().id
            });
            this.getMaterial();
        }
    },
    detectBrowser(){  
        let sUserAgent = navigator.userAgent.toLowerCase();  
        let isIpad = sUserAgent.match(/ipad/i) == 'ipad';    
        let isIphone = sUserAgent.match(/iphone/i) == 'iphone';  
        let isMac = sUserAgent.match(/macintosh/i) == "macintosh";
        let isAndroid = sUserAgent.match(/android/i) == 'android'; 
        if(isIphone || isAndroid){
            window.location.href = 'http://m.flipchinese.com/#/main/material/' + this.getParams().id;
            return false;
        }else{
            return true;
        }
    },
    getMaterial(){
        let self = this;
        fetcher.get(self.getParams().id,cookie.get('user_id'),cookie.get('auth_token'), function (data) {
            self.setState({
                title: data.material.title,
                intro: data.material.intro,
                media: {
                    video: data.material.video,
                    audio: data.material.audio,
                    pdf: data.material.pdf,
                    text: data.material.text,
                    thumb: data.material.thumb,
                    image: data.material.image
                },
                scripts: {
                    hanzi: data.material.hanzi,
                    translation: data.material.translation,
                    pinyin: data.material.pinyin
                },
                kp: {
                    grammar: data.material.kp_grammar_list,
                    voc: data.material.kp_vocabulary_list,
                    character: data.material.kp_character_list
                },
                explain: data.material.explain,
                free: data.material.free,

            });
            self.verifyUser();
        });
    },
    verifyUser(){
        if(!this.state.title){
           this.setState({findNothing: true, materialLoadCompleted: true});
        }else{
            this.setState({materialLoadCompleted: true});
        }
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
    _back(){
        mixpanel.track("back", {
            'where': "material-id",
        });
        this.goBack();
    },
    render() {
        if(this.state.findNothing){
            return  <Error show={true} desc="Find Nothing ..."/> ;
        }else if(this.state.materialLoadCompleted){
            let videoMeal = <div style={styles.videoMeal}>
                                <video id="video-obj" width="100%" controls="controls" src={this.state.media.video}/>
                            </div> ;

            let wordMeal = <div className="editor" style={styles.wordMeal}><div dangerouslySetInnerHTML={{__html: this.state.media.text}} /></div> ;

            let audioMeal = <div style={styles.audioMeal}>
                                <audio style={{width: '100%',maxWidth:'560px'}} controls="controls">
                                    <source src={this.state.media.audio} type="audio/mpeg"/>
                                </audio>
                                {this.state.scripts.text ? wordMeal : this.state.media.image ? <img src={this.state.media.image} style={styles.image} /> : <img src={this.state.media.thumb} style={styles.thumb} /> }
                            </div> ; 
            let pdfMeal = <div style={styles.pdfMeal}>
                            <button className="button-raised">
                                <a href={this.props.pdf}>Download PDF</a>
                            </button>
                           </div>;

            let mediaMeal = this.state.media.video ? videoMeal :
                this.state.media.video ? videoMeal :
                this.state.media.pdf ? pdfMeal : 
                this.state.media.audio ? audioMeal : 
                this.state.media.text ? wordMeal : 
                this.state.media.image ? <img src={this.state.media.image} style={styles.image} /> : 
                this.state.media.thumb ? <img src={this.state.media.thumb} style={styles.thumb} /> : 
                <Error show={true} desc="Find Nothing ..."/>
            ;
            let hanziMeal = <div className="editor" style={styles.hanziMeal} dangerouslySetInnerHTML={{__html: this._combineText(this.state.scripts.pinyin, this.state.scripts.hanzi,'\r')}} />;
            let translationMeal = <div className="editor" style={styles.hanziMeal} dangerouslySetInnerHTML={{__html: this._filterText(this.state.scripts.translation)}} />;

            return (
                <div className="main row center-xs">
                    <div className="col-xs-8" style={{width: '100%'}}>
                        <div style={styles.title}>
                            <h2 style={MainStyle.headline}>{this.state.title}</h2>
                            <p style={styles.subTitle}>{this.state.intro}</p>
                        </div>
                       
                        {
                            this.state.scripts.hanzi && this.state.scripts.pinyin && this.state.scripts.translation ?
                             <div className="row" style={styles.content}>
                                <div style={styles.mediaBox} className="col-xs-12 col-sm-12 col-md-7">
                                    {mediaMeal}
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-5">
                                    <Tabs>
                                        <tab title="hanzi & pinyin" >
                                            {hanziMeal}
                                        </tab>
                                        <tab title="translation" >
                                            {translationMeal}
                                        </tab>
                                    </Tabs>
                                </div>
                            </div>
                            :
                             <div  style={styles.content}>
                                <div style={styles.mediaBox}>
                                    {mediaMeal}
                                </div>
                            </div>
                        }

                        <div style={styles.footer}>
                            {
                                !isEmpty(this.state.kp.grammar) || !isEmpty(this.state.kp.voc) ||  !isEmpty(this.state.kp.character)  ?
                                <div>
                                    <Tabs>
                                        <tab title="Vocabulary" >
                                            <ul style={styles.kpList}>
                                                {
                                                    _.map(this.state.kp.voc,(item, key)=>{
                                                        if(key){
                                                            return(
                                                                <li style={styles.kpItem}><b style={{color: '#1967d2'}}>{key}</b>{!isEmpty(item) && item.hasOwnProperty('intro') ? `    (intro: ${item.intro} )` : ''}</li>
                                                            )
                                                        }
                                                    })
                                                }
                                            </ul>
                                        </tab>
                                        <tab title="Grammar" >
                                            <ul style={styles.kpList}>
                                                {
                                                    _.map(this.state.kp.grammar,(item, key)=>{
                                                        if(key){
                                                            return(
                                                                <li style={styles.kpItem}><b style={{color: '#1967d2'}}>{key}</b>{!isEmpty(item) && item.hasOwnProperty('intro') ? `     (intro: ${item.intro} )` : ''}</li>
                                                            )
                                                        }
                                                    })
                                                }
                                            </ul>
                                        </tab>
                                        <tab title="Character" >
                                            <ul style={styles.kpList}>
                                                {
                                                    _.map(this.state.kp.character,(item, key)=>{
                                                        if(key){
                                                            return(
                                                                <li style={styles.kpItem}><b style={{color: '#1967d2'}}>{key}</b>{!isEmpty(item) && item.hasOwnProperty('intro') ? `      (intro: ${item.intro} )` : ''}</li>
                                                            )
                                                        }
                                                    })
                                                }
                                            </ul>
                                        </tab>
                                    </Tabs>
                                </div>
                                :
                                null
                            }
                            {
                                this.state.explain?
                                <div style={styles.explain}>
                                    <div style={styles.explainHeader} className="center-xs">
                                        <p className="middle-xs">Explain</p>
                                    </div>
                                    <div style={styles.explainContent} className="start-xs">
                                        <div className="editor" style={{fontFamily: "'Helvetica', 'Arial', sans-serif"}} dangerouslySetInnerHTML={{__html: this.state.explain}} />
                                    </div>
                                </div>
                                :
                                null
                            }
                        </div>
                        <button className="button-normal" style={{width: '100%', backgroundColor: '#1967d2'}} onClick={this._back} >{'< Back'}</button>
                    </div>
                </div>
            );
        }else{
            return <Progress completed={this.state.materialLoadCompleted}/>
        }
    }
});

module.exports = Material;
