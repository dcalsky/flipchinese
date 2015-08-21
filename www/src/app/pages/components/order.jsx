'use strict';

let cookie = require('cookie-cutter');

let React = require('react/addons');
let Router = require('react-router');

let mui = require('material-ui');
let { RaisedButton, ClearFix } = mui;
let _ = require('underscore');

let checkStatus = require('../../utils/check-status.js');

let MainStyle = require('../styles/main-style.jsx');
let Error = require('../components/error.jsx');
let LoadButton = require('../components/load-button.jsx');
let Progress = require('../components/progress.jsx');

let styles = {
  header: {
    border: '1px solid #E5E5E5',
    backgroundColor: '#E5E5E5',
    padding: 10,
    margin: 'auto 0',
  },
  goods: {
    fontSize: 18,
    margin: 'auto 0',
    textAlign: 'center'
  },
  pack: {
    padding: 10,
    borderBottom: '1px solid #E5E5E5',
    width: '100%',
    margin: 0,
  },
  image: {
    width: 'auto',
    height: 150,
    margin: 'auto 0',
  },
  headerImage: {
    fontSize: 18,
    margin: 'auto 0',
  },
  order: {
    boxShadow: '2px 2px 3px #aaaaaa',
    border: '1px solid #e5e5e5',
    display: 'block',
    margin: '0 0 20px 0',
    width: '100%',
    padding: 0,
  },
  titlePrice: {
    fontSize: 20,
    color: '#0084CA',
  },
  titleDate: {
    fontSize: 18,
    paddingTop: 6,
  },
  load: {
    width: '100%',
  },
};

let fetcher = {
  getHistoryOrders(page,user_id,callback) {
    fetch('http://api.flipchinese.com/api/v1/orders?page=' + page + '&target_id=' + user_id)
      .then(checkStatus)
      .then(function (data) {
          callback(data)
      }).catch(function(error) {
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
    .then(function(response) {
      return response.json()
    }).then(function(data) {
        callback(data)
    })
  }
};

let HistoryBuyContent = React.createClass({
  mixins: [ Router.Navigation ],
  getInitialState () {
      return {
        ableToBuy: false,
        buyButtonLabel: 'paid',
      };
  },
  componentWillMount() {
    let _ableToBuy = false;
    let _buyButtonLabel = 'paid';
    switch(this.props.item.status){
      case 'initialized': 
        _ableToBuy = true 
        _buyButtonLabel = 'pay'
        break;
      case 'paid':
       _ableToBuy = false 
       _buyButtonLabel = 'Bought'
     }
      this.setState({
        ableToBuy: _ableToBuy,
        buyButtonLabel: _buyButtonLabel,
      });
  },
  buy(){
    this.setState({
      ableToBuy: false,
      buyButtonLabel: 'Paying...'
    });
    fetcher.pay(this.props.item.id,cookie.get('user_id'),cookie.get('auth_token'),function(data){
      if(data.result == 'ok'){
        mixpanel.track("buy", {
          'id': this.props.item.id,
          'user': cookie.get('user_id'),
        });
        window.location.href = data.pay_url;  
      }else{
        self.setState({
          ableToBuy: true,
          buyButtonLabel: 'pay'
        });
          alert("Error");
        }
    });
  },
  render() {
    let time = this.props.item.created_at.substr(0, 10);
      return (
        <div style={{padding: 20}}>
            <div className="row" style={{marginBottom: 4}}>
              <div className="col-xs-6 start-xs" style={styles.titleDate}>
                <span style={{paddingRight: 5,borderRight: '1px solid #aaa'}}>No.{this.props.item.order_no}</span>
                <span style={{paddingLeft: 5}}>Date:{time}</span>
              </div>
              <div className="col-xs-6 end-xs" style={styles.titlePrice} >
                <span style={{marginRight: 8}}>Total:${this.props.item.price}</span>
                <RaisedButton primary={true} onClick={this.buy} disabled={!this.state.ableToBuy} label={this.state.buyButtonLabel} />
              </div>
           </div>
          <div style={styles.order}>
            <div>
                <div style={styles.header} className="row"  >
                  <div style={styles.headerImage} className="col-xs-3">Pack</div>
                  <div style={styles.goods} className="col-xs-3">Pack No</div>
                  <div style={styles.goods} className="col-xs-3">Title</div>
                  <div style={styles.goods} className="col-xs-3">Price</div>
                </div>
                {this.props.item.pack_items.map(function(item){
                  return(
                    <div style={styles.pack} className="row">
                      <img style={styles.image} className="col-xs-3" src={item.pack.thumb} />
                      <div style={styles.goods} className="col-xs-3" >{item.pack_id}</div>
                      <div style={styles.goods} className="col-xs-3" >{item.pack.title}</div>
                      <div style={styles.goods} className="col-xs-3" >${item.pack.price}</div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      );
  }
});

let Order = React.createClass({
  mixins: [Router.Navigation, React.addons.LinkedStateMixin],
  page_order: 1,
  contextTypes() {
    router: React.PropTypes.func
  },
  getInitialState() {
    return {
      orders: [],
      loadShow: false,
      imageShow: false,
      orderLoadCompleted: false,
      key: '',

    }
  },
  componentWillMount() {
    mixpanel.track("open", {
      'where': "order",
    });
    this.getOrder(1,true);
  },
  getOrder(page,initial){
    let self = this ;
    if(initial){
      this.setState({orderLoadCompleted: false,orders: []});
    }else{
      this.setState({orderLoadCompleted: false});
    }
    fetcher.getHistoryOrders(page,cookie.get('user_id'),function (data) {
      data.orders = data.orders.reverse();
      if(data.orders.length == 0){
        let _orders = initial ? [] : self.state.orders.concat(data.orders);
        self.setState({
          orders: _orders,
          orderLoadCompleted: true,
          loadShow: false,
          imageShow: initial,
        })
      }else if(data.orders.length >0 && data.orders.length < 6){
        let _orders = initial ? data.orders : self.state.orders.concat(data.orders);
        self.setState({
          orders: _orders,
          orderLoadCompleted: true,
          imageShow: false,
          loadShow: false,
        });
      }else{
        let _orders = initial ? data.orders : self.state.orders.concat(data.orders);
        self.setState({
          orders: _orders,
          orderLoadCompleted: true,
          imageShow: false,
          loadShow: true,
        });
      }
    });
  },
  _loadMoreOrders(){
    mixpanel.track("load more orders", {
      'where': "order",
    });
    this.getOrder(++this.page_order,false);
  },
  render() {
      return (
          <div>
            {this.state.orders.map(function (item) {
              return <HistoryBuyContent item={item} />
            })}
            <Error show={this.state.imageShow} desc="Did not find any order..." />
            <Progress completed={this.state.orderLoadCompleted} />
            <LoadButton style={styles.load} show={this.state.loadShow} onClick={this._loadMoreOrders} disabled={!this.state.orderLoadCompleted} />
          </div>
      );
    }
});

module.exports = Order;

