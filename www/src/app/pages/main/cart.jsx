'use strict';

let storage = require('react-storage');
let cookie = require('cookie-cutter');

let React = require('react/addons') ;
let Router = require('react-router') ;

let mui = require('material-ui') ;
let { Dialog, FontIcon, RaisedButton, FlatButton } = mui ;
let MainStyle = require('../styles/main-style.jsx');
let _ = require('underscore')  ;

let checkStatus = require('../../utils/check-status.js');

let Progress = require('../components/progress.jsx');
let Error = require('../components/error.jsx');

let styles = {
  header: {
    width: '100%',
    margin: 'auto 40px auto 0',
  },
  headerTitle: {
    fontWeight: 300,
    fontSize: '20px',
    textAlign: 'center',
  },
  goods: {
    fontWeight: 200,
    fontSize: '16px',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    padding: 15,
    backgroundColor: '#EEE',
    margin: 'auto 0',
  },
  footerTitle: {
    fontWeight: 300,
    fontSize: '16px',
    color: '#0084CA',

  },
  buttonGroup: {
    marginTop: '40px',
    width: '100%'
  },
  pack: {
    boxShadow: '2px 2px 3px #aaaaaa',
    border: '1px solid #e5e5e5',
    margin: '20px 0',
    width: '100%',
    padding: '30px 0',
  },
  deleteButton: {
    width: '100%',
  },
  buttonIcon: {
    color: 'white',
    height: '100%',
    display: 'inline-block',
    verticalAlign: 'middle',
    float: 'left',
    paddingLeft: '14px',
    lineHeight: '36px',
  },

};
let fetcher = {
  createOrder(user_id,auth_token,pack_ids, callback) {
    fetch('http://api.flipchinese.com/api/v1/orders',{
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user_id,
        auth_token: auth_token,
        pack_ids: pack_ids,
      })
    })
    .then(checkStatus)
    .then(function (data) {
        callback(data)
    }).catch(function(error) {
      console.log(error)
        window.location.href = '#/main/connect-error';
    });
  },
  pay(order_id,user_id,auth_token,callback) {
    fetch('http://api.flipchinese.com/api/v1/orders/'+order_id+'/pay',{
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: order_id ,
        user_id: user_id,
        auth_token: auth_token,
      })
    })
    .then(checkStatus)
    .then(function (data) {
        callback(data)
    }).catch(function(error) {
        console.log(error)
        window.location.href = '#/main/connect-error';
    });
  },
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
  deletePack(){
    this.props.deletePack(this.props.item);
  },
  render(){
    if(this.props.item.isMine){
      return null;
    }
    return(
      <div style={styles.pack} className="row middle-xs">
              <div style={styles.goods} className="col-xs-2">{this.props.item.id}</div>
              <div style={styles.goods} className="col-xs-2">{this.props.item.title}</div>
              <div style={styles.goods} className="col-xs-2">{this.props.item.materials}</div>
              <div style={styles.goods} className="col-xs-2">{this.props.item.tasks}</div>
              <div style={styles.goods} className="col-xs-2">${this.props.item.price}</div>
              <div style={styles.goods} className="col-xs-2">
                <FlatButton style={styles.deleteButton} label="Delete" onClick={this.deletePack} />
              </div>
      </div>
    );
  }
});
let Cart = React.createClass({
  mixins: [ Router.Navigation, Router.State , React.addons.LinkedStateMixin ],
  myPacks: [],
  contextTypes() {
    router: React.PropTypes.func
  },
  getInitialState() {
      return {
        packs: [],
        totalPrice: 0,
        totalMaterials: 0,
        totalTasks: 0,
        totalPacks: 0,
        ableToBuy: false,
        buyButtonLabel: 'Buy Now >',
        loadCompleted: false,
      };
  },
  componentWillMount(){
    if(cookie.get('user_id') && cookie.get('auth_token')){
      this._filterCart(JSON.parse(storage.get('cart')));
    }else{
      this._getCart(JSON.parse(storage.get('cart')));
    }
  },
  deletePack(pack){
    var _packs = _.reject(this.state.packs, function(item){ return item.id == pack.id; });
    var _carts = [] ;
    _packs.map(function(item){
      _carts.push(JSON.stringify(item));
    });
    storage.set('cart',JSON.stringify(_carts));
    let _ableToBuy = _packs.length > 0 ? true : false ;
    this.setState({
      packs: _packs,
      totalPrice: (parseFloat(this.state.totalPrice) - parseFloat(pack.price)).toFixed(2),
      totalMaterials: this.state.totalMaterials - pack.materials,
      totalTasks: this.state.totalTasks - pack.tasks,
      totalPacks: _packs.length,
      ableToBuy: _ableToBuy,
    });
    mixpanel.track("delete pack", {
      'where': "cart",
      'money': pack.price,
      'number of materials': pack.materials,
      'number of tasks': pack.tasks,
    });
  },
  back(){
    mixpanel.track("back", {
      'where': "cart",
    });
    this.transitionTo('/main/packs');
  },
  buy(){
    if(!cookie.get('user_id') || !cookie.get('auth_token')){
      mixpanel.track("free user want to buy");
      cookie.set('fromCart','true');
      this.transitionTo('sign-in');
    }else{
      this.setState({
        ableToBuy: false,
        buyButtonLabel: 'Paying...',
        paying: true,
      });
      let self = this;
      let pack_ids = _.map(this.state.packs,function(pack){
        return pack.id;
      });
      mixpanel.track("buy", {
        'where': "cart",
        'user': cookie.get('user_id'),
        'price': this.state.totalPrice,
        'pack_ids': pack_ids,
      });
      pack_ids = pack_ids.join();
      fetcher.createOrder(cookie.get('user_id'),cookie.get('auth_token'),pack_ids,function(orders){
        if(orders.order.status == 'paid'){
          storage.clear();
          alert('Bought Successfully ! Added to MY PACK.');
          self.transitionTo('/main/my-pack');
        }else{
          fetcher.pay(orders.order.id,cookie.get('user_id'),cookie.get('auth_token'),function(data){
            if(data.result == 'ok'){
                storage.clear();
                window.location.href = data.pay_url;    
            }else{
              mixpanel.track("buy error", {
                'where': "cart",
              });
              self.setState({
                ableToBuy: true,
                buyButtonLabel: 'Buy Now >',
                paying: false,
              });
              alert("Error");
            }
          });
        }
      });
    }
  },
  _getCart(packs){
    let totalTasks = 0, totalPrice = 0, totalMaterials = 0, _packs = [];
    _.map(packs,function(item){
      totalTasks = totalTasks + item.tasks ;
      totalPrice = totalPrice + parseFloat(item.price) ;
      totalMaterials = totalMaterials + item.materials ;
      _packs.push({
        id: item.id,
        title: item.title,
        materials: item.materials,
        tasks: item.tasks,
        price: parseFloat(item.price),
        isMine: item.isMine,
      });
    });
    let _ableToBuy = _packs.length > 0 ? true : false ;
    this.setState({
      packs: _packs,
      totalTasks: totalTasks,
      totalPrice: (parseFloat(totalPrice)).toFixed(2),
      totalMaterials: totalMaterials,
      totalPacks: _packs.length,
      ableToBuy: _ableToBuy,
      loadCompleted: true,
    });
  },
  _filterCart(packs){
    let self = this ;
    fetcher.getMyPacks(cookie.get('user_id'),cookie.get('user_id'),cookie.get('auth_token'),function(data){
      data.pack_items.map(function(pack_item){
        self.myPacks = self.myPacks.concat(pack_item);
      });
      _.map(packs,function(pack){
        _.map(self.myPacks,function(myPack){
          if(myPack.pack_id == pack.id){
            pack['isMine'] = true;
          }
        })
      });
      self._getCart(_.reject(packs, function(pack){ return pack.isMine == true; }))
    });
  },
  _handleCustomDialogCancel(){
    this.refs.customDialog.dismiss();
  },
  render(){
    var self = this ;
    if(this.state.packs.length != 0 && this.state.loadCompleted){
      let customActions = [
        <FlatButton
          label="Confirm"
          primary={true}
          onTouchTap={this._handleCustomDialogCancel} />
      ];
      return (
          <div>
            <h2>Shopping Cart</h2>
            <div style={{paddingTop: "40px"}}  >
              <div style={styles.header} className="row middle-xs">
                  <div style={styles.headerTitle} className="col-xs-2">ID</div>
                  <div style={styles.headerTitle} className="col-xs-2">Title</div>
                  <div style={styles.headerTitle} className="col-xs-2">Materials</div>
                  <div style={styles.headerTitle} className="col-xs-2">Tasks</div>
                  <div style={styles.headerTitle} className="col-xs-2">Price</div>
                  <div style={styles.headerTitle} className="col-xs-2">Operate</div>
              </div>
              <div style={styles.body} >
                {this.state.packs.map(function(item){
                  return <Content item={item} deletePack={self.deletePack} />
                })}
              </div>
              <div style={styles.footer} className="row middle-xs">
                  <div styles={styles.footerTitle} className="col-xs-3">Packs: {this.state.totalPacks}</div>
                  <div styles={styles.footerTitle} className="col-xs-3">Materials: {this.state.totalMaterials}</div>
                  <div styles={styles.footerTitle} className="col-xs-3">Tasks: {this.state.totalTasks}</div>
                  <div styles={styles.footerTitle} className="col-xs-3">Price: ${this.state.totalPrice}</div>
              </div>
              <div style={styles.buttonGroup} className="row">
                <div className="col-xs-6 start-xs">
                  <RaisedButton secondary={true} onClick={this.back} label="< Back to select more" />
                </div>

                <div className="col-xs-6 end-xs">
                 <RaisedButton primary={true} onClick={this.buy} disabled={!this.state.ableToBuy} label={this.state.buyButtonLabel}>
                  <FontIcon style={styles.buttonIcon} className="zmdi zmdi-money"/>
                </RaisedButton>
                </div>
              </div>
              <Dialog
                ref="customDialog"
                title="Bought Successfully ! Added to MY PACK."
                actions={customActions}
                modal={false}>
              </Dialog>
            </div>
          </div>
      );
    }else if(this.state.packs.length == 0 && this.state.loadCompleted){
      return (
        <div>
          <h2  style={MainStyle.headline}>Shopping Cart</h2>
          <Error show="true" desc="Did not find anything in cart..." />
        </div>
      )
    }else{
      return (
        <div>
          <h2  style={MainStyle.headline}>Shopping Cart</h2>
          <Progress completed={this.state.loadCompleted} />
        </div>
      )
    }
  }
});

module.exports = Cart;
