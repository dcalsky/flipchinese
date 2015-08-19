'use strict';

let React = require('react/addons');

let mui = require('material-ui');
let {Paper} = mui;
let Colors = mui.Styles.Colors;

let MainStyle = require('../styles/main-style.jsx');
let ImageBox = require('../components/image-box.jsx');
let AudioPlayer = require('../components/audio-player.jsx');
let PDFDownload = require('../components/pdf-download.jsx');

let TaskPart = React.createClass({
    render() {
        //this.props.part.learner_image = 'https://www.baidu.com/img/bd_logo1.png';
        //this.props.part.learner_audio = 'http:/78rfvr.com2.z0.glb.qiniucdn.com/heming_pants.mp3';
        //this.props.part.learner_pdf = 'https://www.baidu.com/';
        let learnerText = '';
        if (this.props.part.learner_text) {
            learnerText = this.props.part.learner_text.replace(new RegExp('\r', 'g'), '').replace(new RegExp('\n', 'g'), '<br/>');
        }
        let answerText = '';
        if (this.props.part.answer_text) {
            answerText = this.props.part.answer_text.replace(new RegExp('\r', 'g'), '').replace(new RegExp('\n', 'g'), '<br/>');
        }
        return (
            <div>
                <h3 styles={[MainStyle.partHeadline, {paddingLeft:'14px' ,color: '#FFFFFF', backgroundColor: Colors.blue700}]}>
                    <span style={{float:'left', height:'40px', lineHeight:'40px'}}>
                    <div
                        style={{display:'inline-block',width:'24px',height:'24px',lineHeight:'24px',fontSize: '14px', border: '3px solid #FFFFFF', borderRadius: '50%'}}>{this.props.part.index}</div>
                    </span>
                    {this.props.part.title}
                </h3>
                <p style={{fontSize: '18px',textAlign: 'center',margin: '15px 0'}}>
                    <i className="zmdi zmdi-time"></i>&nbsp;Expected length:{this.props.part.length} minutes</p>
                <Paper zDepth={1} style={{marginBottom: '24px'}}>
                    <ImageBox image={this.props.part.learner_image}/>
                    <AudioPlayer audio={this.props.part.learner_audio}/>
                    <PDFDownload pdf={this.props.part.learner_pdf}/>

                    <div dangerouslySetInnerHTML={{__html: learnerText}} style={{
                        fontSize: '14px',
                        lineHeight: 2,
                        padding: '16px 24px'
                    }}/>
                </Paper>
                {
                    this.props.isDone ?
                        <Paper zDepth={1} style={{marginBottom: '24px'}}>
                            <h4 style={{textAlign:'center',fontSize:'24px',fontWeight:'600',padding:'14px 8px 8px 8px'}}>
                                Answer</h4>
                            <ImageBox image={this.props.part.answer_image}/>
                            <AudioPlayer audio={this.props.part.answer_audio}/>
                            <PDFDownload pdf={this.props.part.answer_pdf}/>
                            <div dangerouslySetInnerHTML={{__html: answerText}}
                                 style={{fontSize: '14px',lineHeight: 2,padding: '16px 24px'}}/>
                        </Paper>
                        :
                        null
                }
            </div>
        );
    }
});


module.exports = TaskPart;