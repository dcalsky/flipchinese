'use strict';

let storage = require('react-storage');
let cookie = require('cookie-cutter');

let React = require('react/addons') ;
let Router = require('react-router') ;

let mui = require('material-ui') ;
let { FlatButton, Dialog, FontIcon, TextField, RaisedButton } = mui ;
let LeftNav = require('../components/left-nav.jsx');
let Select = require('react-select');
let MainStyle = require('../styles/main-style.jsx');
let _ = require('underscore')  ;

let Progress = require('../components/progress.jsx');
let LoadButton = require('../components/load-button.jsx');
let Error = require('../components/error.jsx');
let {Typography,Colors} = mui.Styles  ;

let checkStatus = require('../../utils/check-status.js');

let styles = {
  pack: {
      boxShadow: '2px 2px 3px #aaaaaa',
      margin: '15px 0',
      width: '100%',
      border: '1px solid #E5E5E5',
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
  },
  info: {
    flex: 1,
    listStyle: 'none',
    margin: 'auto 0',
    fontSize: 16,
    lineHeight: 1.5,
  },
  price: {
    fontSize: 24,
    fontWeight: 300,
    margin: 'auto 0 auto 0',
    color: '#FF3B77',
  },
  title: {
    fontSize: 22,
    fontWeight: 400,
    color: '#0084CA',
    marginBottom: 10,
    lineHeight: 1,
  },
  filterBox: {
    width: '100%',
    display: 'block',
    marginTop: 15,
  },
  selectBox: {
    margin: '0 0 10px 0',
  },
  searchBox: {
    textAlign: 'center',
  },
  load: {
    width: '100%',
    marginTop: 20
  },
  buttonIcon: {
    color: Typography.textFullWhite,
    height: '100%',
    display: 'inline-block',
    verticalAlign: 'middle',
    float: 'left',
    paddingLeft: '12px',
    lineHeight: '36px',
  },
  buttonLabel: {
    padding: '0px 16px 0px 8px'
  },
  buttonNormal: {
    margin: '0 0 10px 8px',
  },
  buttonGroup: {
    margin: 'auto 0',
    textAlign: 'right'
  }


};
let fetcher = {
  getPack(page,topic,level,title, callback) {
    fetch('http://api.flipchinese.com/api/v1/packs?page='+page+'&topic='+topic+'&level='+level+'&title='+title)
      .then(checkStatus)
      .then(function (data) {
          callback(data)
      }).catch(function(error) {
          window.location.href = '#/main/connect-error';
      });
  },
  getTopic(callback) {
    fetch('http://api.flipchinese.com/api/v1/packs/topics')
      .then(checkStatus)
      .then(function (data) {
          callback(data)
      }).catch(function(error) {
          window.location.href = '#/main/connect-error';
      });
  },
  getMyPacks(id,user_id,auth_token,callback) {
    fetch('http://api.flipchinese.com/api/v1/users/'+id+'/content?id='+id+'&user_id='+user_id+'&auth_token='+auth_token)
      .then(checkStatus)
      .then(function (data) {
          callback(data)
      }).catch(function(error) {
          window.location.href = '#/main/connect-error';
      });
  },
};

let Content = React.createClass({
  mixins: [ Router.Navigation ],
  carts: [],
  getInitialState(){
    return{
      disable: false,
      buttonLabel: 'Add To Cart',
    }
  },
  addToCart(){
    this.props.addToCart(this.props.item);
    this.setState({
      disable: true,
      buttonLabel: 'Added',
    });
    this.refs.customDialog.show();
  },
  componentWillMount(){
    if(this.props.item.add){
      this.setState({
        disable: true,
        buttonLabel: 'Added',
      });
    }
  },
  view(){
    this.transitionTo('/main/packs/' + this.props.item.id);
  },
  _handleCustomDialogGo(){
    this.transitionTo('/main/cart');
  },
  _handleCustomDialogCancel() {
    this.refs.customDialog.dismiss();
  },
  render() {
    if(this.props.item.isMine){
      return(
        <div style={styles.pack} className="row">
          <div className="col-md-4 col-sm-4 col-xs-12" style={styles.imageBox}>
            <img src={this.props.item.thumb} style={styles.image}/>
          </div>
          <div style={styles.info} className="col-md-3 col-sm-11 col-xs-12">
            <li style={styles.title}>{this.props.item.title}</li>
            <li>Level:{this.props.item.level}</li>
            <li>Topic:{this.props.item.topic}</li>
            <li>Material:{this.props.item.materials.length}</li>
            <li>Tasks:{this.props.item.tasks.length}</li>              
          </div>
          <div style={styles.price} className="col-md-1 col-sm-1 col-xs-12">
           <span>${this.props.item.price}</span>
          </div>
          <div style={styles.buttonGroup} className="col-md-4 col-sm-12 col-xs-12">
            <RaisedButton type="button" style={styles.buttonNormal} label="bought" disabled="true" />
            <RaisedButton type="button" style={styles.buttonNormal} label="View" onClick={this.view}  />
          </div>
        </div>
      )
    }else{
      let customActions = [
        <FlatButton
          label="Continue"
          secondary={true}
          onTouchTap={this._handleCustomDialogCancel} />,
        <FlatButton
          label="Go to shopping cart"
          primary={true}
          onTouchTap={this._handleCustomDialogGo} />
      ];
      return (
        <div style={styles.pack} className="row">
          <div className="col-md-4 col-sm-4 col-xs-12" style={styles.imageBox}>
            <img src={this.props.item.thumb} style={styles.image}/>
            <div className="tag"></div>
          </div>
          <div style={styles.info} className="col-md-3 col-sm-11 col-xs-12">
            <li style={styles.title}>{this.props.item.title}</li>
            <li>Level:{this.props.item.level}</li>
            <li>Topic:{this.props.item.topic}</li>
            <li>Material:{this.props.item.materials.length}</li>
            <li>Tasks:{this.props.item.tasks.length}</li>              
          </div>
          <div style={styles.price} className="col-md-1 col-sm-1 col-xs-12">
           <span>${this.props.item.price}</span>
          </div>
          <div style={styles.buttonGroup} className="col-md-4 col-sm-12 col-xs-12">
            <RaisedButton type="button" style={styles.buttonNormal} primary={true} label={this.state.buttonLabel}  labelStyle={styles.buttonLabel} onClick={this.addToCart} disabled={this.state.disable} >
              <FontIcon style={styles.buttonIcon} className="zmdi zmdi-shopping-cart-plus"/>
            </RaisedButton>
            <RaisedButton style={styles.buttonNormal} type="button" label="View" onClick={this.view}  />
          </div>
          <Dialog
            ref="customDialog"
            title="The pack is added to the shopping cart successfully!"
            actions={customActions}
            modal={false}>
            <img style={{position: 'absolute',right: 50, top: 20, hegiht: 50 ,width: 50}} src="images/correct.png" />

            <p style={{fontSize: 16,}}> Continue selecting packs, or go to shopping cart and pay.</p>
          </Dialog>
        </div>
      );
    }
  }
});



let Pack = React.createClass({
  mixins: [Router.Navigation, React.addons.LinkedStateMixin],
  page: 1,
  topic: '',
  level: '',
  myPacks_ids: [],
  cart: [],
  contextTypes() {
    router: React.PropTypes.func
  },
  getInitialState() {
    return {
      packs: [],
      topics: [],
      levels: [],
      loadShow: false,
      imageShow: false,
      loadCompleted: false,
      key: '',

    }
  },
  componentWillMount() {
    if(cookie.get('user_id') && cookie.get('auth_token')){
      this.getMine();
    }else{
      this.getPack(1,'','','','',true);
    }
    this.getCart();
    this.getTopic();
    this.getLevel();
  },
  getMine(){
    let self = this ;
    fetcher.getMyPacks(cookie.get('user_id'),cookie.get('user_id'),cookie.get('auth_token'),function(data){
      self.myPacks_ids = data.pack_ids
      self.getPack(1,'','','',true);
    });
  },
  getCart(){
    this.cart = JSON.parse(storage.get('cart')) || [];
  },
  getTopic(){
    let self = this ;
    fetcher.getTopic(function(data){
      self.setState({
        topics: _.map(data,function(topic){return({value: topic,label: topic})}),
      });
    })
  },
  getLevel(){
    this.setState({
      levels: [
        {value: '1',label: 'Zero Beginner'},
        {value: '2',label: 'Beginner'},
        {value: '3',label: 'Intermediate'},
        {value: '4',label: 'Advanced'},
        {value: '5',label: 'All Levels Applied'},
      ],
    });
  },
  searchPacks() {
    let self = this;
    if (!this.state.key) {
      return
    }
    mixpanel.track("seach pack", {
      'where': "pack",
      'key words': this.state.key,
    });
    this.topic = '';
    this.level = '';
    this.getPack(1,this.topic,this.level,this.state.key,true);
  },
  getPack(page,topic,level,title,initial){
    let self = this ;
    if(initial){
      this.setState({loadCompleted: false,packs: []});
    }else{
      this.setState({loadCompleted: false});
    }
    fetcher.getPack(page,topic,level,title, function (data) {
      if(data.packs.length == 0){
        let _packs = initial ? [] : self.state.packs.concat(data.packs);
        self.setState({
          packs: _packs,
          loadCompleted: true,
          loadShow: false,
          imageShow: initial,
        })
      }else if(data.packs.length < 6 && data.packs.length > 0){
        let _packs = initial ? data.packs : self.state.packs.concat(data.packs);
        _packs = self._filterMyPack(_packs);
        _packs = self._filterCart(_packs);
        self.setState({
          packs: _packs,
          loadCompleted: true,
          imageShow: false,
          loadShow: false,
        });
      }else{
        let _packs = initial ? data.packs : self.state.packs.concat(data.packs);
        _packs = self._filterMyPack(_packs);
        _packs = self._filterCart(_packs);
        self.setState({
          packs: _packs,
          loadCompleted: true,
          imageShow: false,
          loadShow: true,
        });
      }
    });
  },
  _loadMorePacks(){
    mixpanel.track("load more pack", {
      'where': "pack",
    });
    this.page = this.page + 1;
    this.getPack(this.page,this.topic,this.level,this.state.key,false);
  },
  _handlePackTopicChange(val){
    mixpanel.track("topic change", {
      'where': "pack",
      'topic': val,
    });
    this.page = 1 ;
    this.setState({key: ''});
    this.topic = val;
    this.getPack(1,val,this.level,'',true);
  },
  _handlePackLevelChange(val){
    mixpanel.track("level change", {
      'where': "pack",
      'level': val
    });
    this.page = 1 ;
    this.setState({key: ''});
    this.level = val;
    this.getPack(1,this.topic,val,'',true);
  },
  _filterMyPack(packs){
    let self = this ;
    if(self.myPacks_ids == []){
      return packs;
    }
    _.map(packs,function(pack){
        if(self.myPacks_ids.indexOf(pack.id) != -1){
          pack['isMine'] = true;
        }
    });
    return packs;
  },
  addToCart(pack){
    mixpanel.track("add to cart", {
      'where': "pack",
      'id': pack.id,
    });
    this.cart.push({
      id: pack.id,
      title: pack.title,
      materials: pack.materials.length,
      tasks: pack.tasks.length,
      price: pack.price,
    });    
    storage.set('cart',JSON.stringify(this.cart));
  },
  _filterCart(packs){
    let self = this ;
    let _packs = packs;
    if(self.cart == false ){
      return packs;
    }
    _.map(_packs,function(pack){
      _.map(self.cart,function(pack_string){
        if(pack_string.id == pack.id){
          pack['add'] = true;
        }
      })
    });
    return _packs;
  },
  render() {
    let self = this;
      return (
        <div>
          <h2>Find Packs</h2>
              <div style={styles.filterBox}>
                <div style={styles.selectBox}>
                  <Select
                      placeholder="All Topics"
                      options={this.state.topics}
                      value={this.topic}
                      onChange={this._handlePackTopicChange}
                      disabled={!this.state.loadCompleted}
                  />
                </div>
                <div style={styles.selectBox}>
                  <Select
                      placeholder="All Level"
                      options={this.state.levels}
                      value={this.level}
                      onChange={this._handlePackLevelChange}
                      disabled={!this.state.loadCompleted}
                      searchable={false}
                  />
                </div>
                <div style={styles.searchBox}>
                  <TextField
                    floatingLabelText="Key Word"
                    ref="search"
                    valueLink={this.linkState('key')}
                  />
                  <RaisedButton
                    type="button"
                    primary={true}
                    label="Search"
                    onClick={this.searchPacks}
                  />
                </div>
              </div>
              <div className="row">
                  {this.state.packs.map(function (item) {
                    return <Content item={item} addToCart={self.addToCart} />
                  })}
              </div>
            <Progress completed={this.state.loadCompleted} />
            <Error show={this.state.imageShow} desc="Did not find anything..." />
            <LoadButton style={styles.load} show={this.state.loadShow} onClick={this._loadMorePacks} disabled={!this.state.loadCompleted} />
        </div>
      )
  }
});

module.exports = Pack;
