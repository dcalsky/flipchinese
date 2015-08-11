'use strict';

let cookie = require('cookie-cutter');
let React = require('react/addons');
let Router = require('react-router');

let mui = require('material-ui');
let {  RaisedButton, Tabs, Tab, Paper } = mui;
let _ = require('underscore');

let MainStyle = require('./styles/main-style.jsx');
let Progress = require('./components/progress.jsx');
let Error = require('./components/error.jsx');

let checkStatus = require('../utils/check-status.js');

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
        padding: '25px 10px 0 10px',
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
        padding: '25px 0',
    },
    image: {
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
        fontFamily: "'Helvetica', 'Arial', sans-serif",
    }
}

let fetcher = {
    get(id, callback) {
        fetch('http://api.flipchinese.com/api/v1/materials/' + id)
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
        mixpanel.track("open", {
          'where': "material-id",
        });
        this.getMaterial();
    },
    /*
    componentDidUpdate(prevProps, prevState) {
          if(prevProps.params.id != this.getParams().id){
            console.log("123")
            window.location.href = '#/material-free/' + this.getParams().id;
            this.transitionTo('/material-free/' + this.getParams().id)
          }
    },
    */
    getMaterial(){
        let self = this;
        fetcher.get(self.getParams().id, function (data) {
            self.setState({
                title: data.material.title,
                intro: data.material.intro,
                media: {
                    video: data.material.video,
                    audio: data.material.audio,
                    pdf: data.material.pdf,
                    text: data.material.text,
                    thumb: data.material.thumb,
                },
                scripts: {
                    hanzi: data.material.hanzi,
                    translation: data.material.translation,
                    pinyin: data.material.pinyin
                },
                kp: {
                    grammar: data.material.grammar,
                    voc: data.material.voc,
                    character: data.material.character
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
        this.transitionTo('fast');
    },
    render() {
        if(this.state.findNothing){
            return  <Error show={true} desc="Find Nothing ..."/> ;
        }else if(this.state.materialLoadCompleted){


            let videoMeal = <div style={styles.videoMeal}>
                                <video id="video-obj" width="100%" controls="controls" src={this.state.media.video}/>
                            </div> ;

            let wordMeal = <div style={styles.wordMeal}><div dangerouslySetInnerHTML={{__html: this.state.media.text}} /></div> ;

            let audioMeal = <div style={styles.audioMeal}>
                                <audio style={{width: '100%',maxWidth:'560px'}} controls="controls">
                                    <source src={this.state.media.audio} type="audio/mpeg"/>
                                </audio>
                                {this.state.scripts.text ? wordMeal : <img src={this.state.media.thumb} style={styles.image} /> }
                            </div> ; 
            let pdfMeal = <div style={styles.pdfMeal}>
                            <RaisedButton 
                                linkButton={true} 
                                href={this.props.pdf} 
                                secondary={true}
                                label="Download PDF"
                            />
                           </div>;

            let mediaMeal = this.state.media.video ? videoMeal : this.state.media.video ? videoMeal : this.state.media.pdf ? pdfMeal : this.state.media.audio ? audioMeal : this.state.media.text ? wordMeal : <Error show={true} desc="Find Nothing ..."/> ;
            let hanziMeal = <div style={styles.hanziMeal} dangerouslySetInnerHTML={{__html: this._combineText(this.state.scripts.pinyin, this.state.scripts.hanzi,'\r')}} />;
            let translationMeal = <div style={styles.hanziMeal} dangerouslySetInnerHTML={{__html: this._filterText(this.state.scripts.translation)}} />;
            return (
                <div className="row center-xs">
                    <div className="main start-xs col-xs-12 col-sm-12 col-md-9">
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
                                        <Tab label="hanzi & pinyin" >
                                            {hanziMeal}
                                        </Tab>
                                        <Tab label="translation" >
                                            {translationMeal}
                                        </Tab>
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
                                this.state.kp.grammar && this.state.kp.voc && this.state.kp.character?
                                <div>
                                    <Tabs>
                                        <Tab label="Grammar" >
                                            {this.state.kp.grammar}
                                        </Tab>
                                        <Tab label="Voc" >
                                            {this.state.kp.voc}
                                        </Tab>
                                        <Tab label="Character" >
                                            {this.state.kp.character}
                                        </Tab>
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
                                    <div className="start-xs">
                                        <div style={styles.explainContent} dangerouslySetInnerHTML={{__html: this.state.explain}} />
                                    </div>
                                </div>
                                :
                                null
                            }
                        </div>
                        <RaisedButton style={{width: '100%'}} secondary={true} label="< Back" onClick={this._back} />
                    </div>
                </div>
            );
        }else{
            return (
                <section style={{minHeight: 768}}>
                    <Progress completed={this.state.materialLoadCompleted}/>
                </section>
            );
        }
    }
});

module.exports = Material;
