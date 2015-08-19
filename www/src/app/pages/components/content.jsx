'use strict';

let React = require('react/addons');
let Router = require('react-router');

let mui = require('material-ui');
let { RaisedButton} = mui;

let MainStyle = require('../styles/main-style.jsx');

let styles = {
  img: {
    position: 'relative',
  },
  tag: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    opacity: 0.9,
    zIndex: '999'
  }
}

let Content = React.createClass({
  mixins: [Router.Navigation],
  enterContent() {
        mixpanel.track("enter "+this.props.type);
    if(this.props.type == 'task' && this.props.result_id){
      this.transitionTo('/main/' + this.props.type + '/' + this.props.item.id, {}, {result_id: this.props.result_id, fulfilled: this.props.fulfilled});
    }else{
      this.transitionTo('/main/' + this.props.type + '/' + this.props.item.id);
    }
  },
  render() {
    let abled = false ;
    let image = this.props.type == 'task' ? this.props.item.parts[0].thumb : this.props.item.thumb;
    if(this.props.item.isMine || this.props.free){
      abled = true ;
    }
    return (
      <li className="col-xs-12 col-md-3 col-sm-5" style={{margin: '20px 10px',listStyle: 'none'}}>
        <div style={styles.img}>
          <img  src={image} />
          {
            this.props.item.media?
            <img src={'./images/tag_' + this.props.item.media + '.png'} style={styles.tag} />
            :
            null
          }
        </div>
        <div  className="content-title start-xs">
          <h3>
            {this.props.item.title}
          </h3>
        </div>
        {
          this.props.item.topic?
          <div className="content-topic start-xs">
            <i className="zmdi zmdi-pin" style={{paddingRight: 5, fontSize: 14}}></i>
            <span>
              {this.props.item.topic}
            </span>
          </div>
          :
          null
        }
        <div className="content-intro start-xs">
          <p>
            {this.props.item.intro}
          </p>
          </div>
        <div className="content-button center-xs">
          <RaisedButton primary={true} label={this.props.buttonLabel ? this.props.buttonLabel : 'Learn'} disabled={!abled} onClick={this.enterContent} />
        </div>
      </li>
    );
  }
});

module.exports = Content;
