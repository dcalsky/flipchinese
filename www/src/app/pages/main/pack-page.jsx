'use strict';

let cookie = require('cookie-cutter');
let storage = require('react-storage');

let React = require('react/addons');
let Router = require('react-router');

let mui = require('material-ui');
let { FontIcon, RaisedButton, Checkbox, FlatButton, Snackbar} = mui;
let {Colors} = mui.Styles;

let _ = require('underscore');

let MainStyle = require('../styles/main-style.jsx');
let Progress = require('../components/progress.jsx');
let Content = require('../components/content.jsx');

let checkStatus = require('../../utils/check-status.js');

let fetcher = {
    get(id, callback) {
        fetch('http://api.flipchinese.com/api/v1/packs/' + id)
            .then(checkStatus)
            .then(function (data) {
                callback(data)
            }).catch(function (error) {
                console.log(error)
                window.location.href = '#/main/connect-error';
            });
    },
    getMyPacks(user_id, auth_token, callback) {
        fetch('http://api.flipchinese.com/api/v1/users/' + user_id + '/pack_items?user_id=' + user_id + '&auth_token=' + auth_token)
            .then(checkStatus)
            .then(function (data) {
                callback(data)
            }).catch(function (error) {
                console.log(error)
                window.location.href = '#/main/connect-error';
            });
    },
    done(id, user_id, auth_token, callback) {
        fetch('http://api.flipchinese.com/api/v1/packs/' + id + '/done', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                auth_token: auth_token
            })
        }).then(checkStatus).then(function (data) {
            callback(data)
        }).catch(function (error) {
            console.log(error)
            window.location.href = '#/main/connect-error';
        });
    }
};

let PackPage = React.createClass({
    mixins: [Router.Navigation, Router.State, React.addons.LinkedStateMixin],
    cart_string: [],
    getInitialState() {
        return {
            taskLoadComplete: false,
            title: null,
            intro: null,
            materials: [],
            tasks: [],
            isMine: false,
            isDone: false,
            id: null,
            materialLength: 0,
            taskLength: 0,
            price: 0,
            ableToCart: true,
            addButtonLabel: 'Add To Cart',
        };
    },
    componentWillMount() {
        mixpanel.track("open", {
          'where': "pack inside",
        });
        this.getMine();
    },
    getMine(){
        let self = this;
        if(cookie.get('user_id') && cookie.get('auth_token')){
            fetcher.getMyPacks(cookie.get('user_id'), cookie.get('auth_token'), function (pack) {
                pack.pack_items.map(function (pack_item) {
                    if (pack_item.pack_id == self.getParams().id) {
                        self.setState({
                            isMine: true
                        });
                        if (pack_item.done)
                            self.setState({
                                isDone: true
                            });
                    }
                });
                self.getPack();
            });
        }else{
            self.getPack();
        }
    },
    getPack(){
        let self = this;
        this.cart_string = JSON.parse(storage.get('cart'));
        fetcher.get(this.getParams().id, function (data) {
            data.pack.materials.map(function (item) {
                item.isMine = self.state.isMine;
            });
            data.pack.tasks.map(function (item) {
                item.isMine = self.state.isMine;
            });
            _.map(self.cart_string,function(pack_string){
                if(pack_string.id == data.pack.id){
                    self.setState({
                        addButtonLabel: 'Added',
                        ableToCart: false,
                    });
                }
            });
            self.setState({
                taskLoadComplete: true,
                title: data.pack.title,
                intro: data.pack.intro,
                materials: data.pack.materials,
                tasks: data.pack.tasks,
                id: data.pack.id,
                materialLength: data.pack.materials.length,
                taskLength: data.pack.tasks.length,
                price: data.pack.price,
            });
        });
    },
    back() {
        mixpanel.track("back", {
          'where': "pack inside",
        });
        this.transitionTo('packs');
    },
    addToCart(){
        mixpanel.track("add to cart", {
          'where': "pack inside",
          'id': this.state.id,
        });
        this.cart_string.push({
          id: this.state.id,
          title: this.state.title,
          materials: this.state.materialLength,
          tasks: this.state.taskLength,
          price: this.state.price,
        });
        this.setState({
          ableToCart: false,
          addButtonLabel: 'Added',
        });
        storage.set('cart',JSON.stringify(this.cart_string));
    },
    done() {
        mixpanel.track("pack done", {
          'where': "pack inside",
          'user': cookie.get('user_id')
        });
        this.refs.checkbox.setChecked(!this.refs.checkbox.isChecked());
        this.refs.snackbar.show();
        let self = this;
        if (!this.state.isDone) {
            fetcher.done(this.getParams().id, cookie.get('user_id'), cookie.get('auth_token'), function (data) {
                if (data.result == 'ok')
                    self.refs.checkbox.setChecked(true);
            });
        }
    },
    render() {
        if (this.state.taskLoadComplete) {
            console.log(this.state.isMine);
            return (
                <div>
                    <div style={{display: this.state.taskLoadComplete ? 'block' : 'none'}}>
                        <h2 style={MainStyle.headline}>{this.state.title}</h2>
                        {
                            this.state.intro?
                            <div style={{paddingTop: 30}}>
                                <h3 style={{fontSize: '24px', height: '48px', lineHeight: '48px', textAlign: 'center', color: '#FFFFFF', backgroundColor: Colors.blue700}}>
                                    Pack Intro</h3>
                                <div style={{fontSize:'14px',margin:'10px 0', padding: '30px 40px 0 40px'}}
                                     dangerouslySetInnerHTML={{__html: this.state.intro}}/>
                             </div>
                            :
                            null
                        }

                        {
                            this.state.materials.length?
                            <div>
                                <h3 style={{display: this.state.materials.length?'block':'none',fontSize: '24px', height: '48px', lineHeight: '48px', textAlign: 'center', color: '#FFFFFF', backgroundColor: Colors.blue700}}>
                                    Materials</h3>
                                <div className="card">
                                    <ul className="content-list row center-xs">
                                        {this.state.materials.map(function (item) {
                                            return <Content key={item.id} item={item} type="material"/>
                                        })}
                                    </ul>
                                </div>
                            </div>
                            :
                            null
                        }
                        {
                            this.state.tasks.length?
                            <div>
                                <h3 style={{fontSize: '24px', height: '48px', lineHeight: '48px', textAlign: 'center', color: '#FFFFFF', backgroundColor: Colors.blue700}}>
                                    Tasks</h3>
                                <div className="card">
                                    <ul  className="content-list row center-xs">
                                        {this.state.tasks.map(function (item) {
                                            return <Content key={item.id} item={item} type="task"/>
                                        })}
                                    </ul>
                                </div>
                            </div>
                            :
                            null
                        }
                        <div
                            style={{display: this.state.isMine ? 'block' : 'none', textAlign: 'center',margin:'40px 0'}}>
                            <div style={{display: 'inline-block', maxWidth: '460px',minWidth: '360px'}}>
                                <span style={{fontSize:'16px', color: '#0084CA'}}>Complete - Click to confirm your completion.</span>
                                <Checkbox
                                    ref="checkbox"
                                    style={{fontSize:'24px', marginTop:'4px'}}
                                    labelStyle={{color: '#0084CA'}}
                                    name="complete"
                                    value="complete"
                                    label="I have completed this pack!"
                                    defaultChecked={this.state.isDone}
                                    onCheck={this.done}/>
                            </div>
                        </div>
                        {
                            this.state.isMine
                            ?
                            null
                            :
                            <div className="row center-xs" style={{padding: '0 90px'}}>
                                <div className="col-xs-12 col-sm-6 col-md-6">
                                    <RaisedButton label="< Back" secondary={true} onClick={this.back} style={{width: '100%'}}/>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6">
                                    <RaisedButton disabled={!this.state.ableToCart} labelStyle={MainStyle.buttonLabel} label={this.state.addButtonLabel} primary={true} onClick={this.addToCart} style={{width: '100%'}} />
                                </div>
                            </div>
                        }
                        <Snackbar
                            ref="snackbar"
                            message="You have completed this pack!"
                            onActionTouchTap={this._handleAction}/>
                    </div>
                </div>
            );
        } else {
            return <Progress completed={this.state.taskLoadComplete}/>
        }
    }
});

module.exports = PackPage;
