'use strict';

let cookie = require('cookie-cutter');

let React = require('react/addons') ;
let Router = require('react-router') ;

let mui = require('material-ui') ;
let { FloatingActionButton, RaisedButton } = mui ;
let MainStyle = require('../styles/main-style.jsx');
let _ = require('underscore')  ;

let {Typography,Colors} = mui.Styles  ;

let Progress = require('../components/progress.jsx');
let Error = require('../components/error.jsx');

let checkStatus = require('../../utils/check-status.js');

let user_id = cookie.get('user_id');
let auth_token = cookie.get('auth_token');

let styles = {
  buttonIcon: {
    color: Typography.textFullWhite
  },
  buttonLabel: {
    padding: '0px 16px 0px 8px'
  },
  buttonNormal: {
    margin: '10px 10px 5px 0px',
  },
  flatButtonIcon: {
    height: '100%',
    display: 'inline-block',
    verticalAlign: 'middle',
    float: 'left',
    paddingLeft: '12px',
    lineHeight: '36px',
    color: Colors.cyan500
  },
  pack: {
    boxShadow: '2px 2px 3px #aaaaaa',
    margin: '15px 0',
    width: '100%',
    border: '1px solid #E5E5E5'
  },
  image: {
    width: '100%',
    height: 'auto',
    paddingLeft: 0,
  },
  imageBox: {
    position: 'relative',
    padding: 0,
  },
  tag: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 'auto',
    paddingLeft: 0,
  },
  info: {
    listStyle: 'none',
    fontSize: 16,
    lineHeight: 1.3,
    margin: 'auto 0',
  },
  price: {
    fontSize: 24,
    fontWeight: 300,
    color: '#FF3B77',
    margin: 'auto 0',
  },
  title: {
    fontSize: 22,
    fontWeight: 400,
    color: '#0084CA',
    margin: 'auto 0',
  },
  buttonGroup: {
    margin: 'auto 0',
  }


};

let fetcher = {
  getMyPacks(id,user_id,auth_token,callback) {
    fetch('http://api.flipchinese.com/api/v1/users/'+id+'/pack_items?id='+id+'&user_id='+user_id+'&auth_token='+auth_token)
    .then(checkStatus)
    .then(function (data) {
        callback(data)
    }).catch(function(error) {
      console.log(error)
        window.location.href = '#/main/connect-error';
    });
  },
};

let Content = React.createClass({
  mixins: [ Router.Navigation ],
  enterPack(){
    mixpanel.track("enter pack", {
      'where': "my pack",
      'id': this.props.item.pack_id,
    });
    this.transitionTo('/main/packs/'+this.props.item.pack_id); 
  }, 
  render() {
    return (
      <div style={styles.pack} className="row">
        <div style={styles.imageBox} className="col-xs-4">
          <img src={this.props.item.pack.thumb} style={styles.image}  />
            {
              this.props.item.done?
              <img src="./images/tag_completed.png" style={styles.tag} />
              :
              null
            }
        </div>
        <div style={styles.info} className="col-xs-6">
              <li style={styles.title}>{this.props.item.pack.title}</li>
              <li>Level:{this.props.item.pack.level}</li>
              <li>Topic:{this.props.item.pack.topic}</li>
              <li>Material:{this.props.item.pack.materials.length}</li>
              <li>Tasks:{this.props.item.pack.tasks.length}</li>              
        </div>
        <div style={styles.buttonGroup} className="col-xs-2">
         <RaisedButton primary={true} onClick={this.enterPack} label="Enter" />
        </div>
      </div>
    );
  }
})



let Mypack = React.createClass({
  mixins: [ Router.Navigation, React.addons.LinkedStateMixin ],

  filter: {topic:null,level:null},
  contextTypes() {
    router: React.PropTypes.func
  },
  getInitialState() {
    return {
      packs: [],
      page: 1,
      loaderLabel: 'Load More',
      loaderDisabled: false,
      loadCompleted: false,
      imageShow: false,
    }
  },
  componentWillMount(){
    mixpanel.track("open", {
      'where': "my pack",
    });
    if(!cookie.get('user_id') || !cookie.get('auth_token')){
        this.transitionTo('sign-in');
    }
    let self = this;
    fetcher.getMyPacks(cookie.get('user_id'),cookie.get('user_id'),cookie.get('auth_token'), function(data) {
      if(data.pack_items.length == 0){
        self.setState({
          packs: data.pack_items,
          loadCompleted: true,
          imageShow: true,
        });
      }else{
        self.setState({
          packs: data.pack_items,
          loadCompleted: true,
          imageShow: false,
        });
      }
    });
  },
  addPack(){
    mixpanel.track("want to add pack", {
      'where': "my pack",
      'id': cookie.get('user_id'),
    });
    this.transitionTo('packs');
  },
  /*
  loadMore(){
    let _packs = this.state.packs ;
    this.state.loaderDisabled = true ;
    this.state.loaderLabel = 'Loading...' ;
    this.setState({
      page : this.state.page + 1,
    });
    
    fetcher.getMyPacks(user_id,auth_token,function(data) {
      if(data.packs.length){
        _packs = _packs.concat(data.pack_items);
        this.state.loaderLabel = 'Load More' ;
        this.state.loaderDisabled = false ;
        self.setState({
          packs: _packs,
        });
      }else{
        this.state.loaderLabel = 'No More' ;
        this.state.loaderDisabled = true ;
      }
    }); 
  },
  */
  render(){
    if(this.state.loadCompleted){
      return (
          <div>
            <h2>Packs I Bought</h2>
                <div style={{textAlign:"right"}}>
                  <FloatingActionButton iconClassName="zmdi zmdi-plus" onClick={this.addPack}/>
                  <b style={{fontSize: 20,margin: '0 0 20px 10px',color: '#8c8c8c'}}>Find More Packs</b>
                </div>
                <div> 
                  {this.state.packs.map(function(item){return <Content item={item} /> })}
                </div>
            <Error show={this.state.imageShow} desc="Nothing in your package..." />
            </div>
      );
    }else{
      return (<Progress completed={this.state.loadCompleted} />);
    }
  }
});

module.exports = Mypack;
