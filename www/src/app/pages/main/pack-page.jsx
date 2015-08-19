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
    getPack_item(id, callback) {
        fetch('http://api.flipchinese.com/api/v1/users/pack_items/' + id)
            .then(checkStatus)
            .then(function (data) {
                callback(data)
            }).catch(function (error) {
                console.log(error)
                window.location.href = '#/main/connect-error';
            });
    },
    getPack(id, callback) {
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
        fetch('http://api.flipchinese.com/api/v1/users/' + user_id + '/content?id=' + user_id + '&user_id=' + user_id + '&auth_token=' + auth_token)
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
            mine: false,
        };
    },
    componentWillMount() {
        mixpanel.track("open", {
          'where': "pack inside",
        });
        if(this.getQuery().pack_item){
            this.getPack_item()
        }else{
            this.getPack()
        }
        
    },
    getPack_item(){
        let self = this;
        this.cart_string = JSON.parse(storage.get('cart')) || [];
        fetcher.getPack_item(this.getQuery().pack_item, function (data) {
            self.setState({
                taskLoadComplete: true,
                title: data.pack_item.pack.title,
                intro: data.pack_item.pack.intro,
                materials: data.pack_item.materials,
                tasks: data.pack_item.task_results,
                id: data.pack_item.id,
                materialLength: data.pack_item.materials.length,
                taskLength: data.pack_item.length,
                price: data.pack_item.pack.price,
                packType: 'pack_item',
                mine: true,
            });
        });
    },
    getPack(){
        let self = this;
        this.cart_string = JSON.parse(storage.get('cart')) || [];
        fetcher.getPack(this.getParams().id, function (data) {
            _.map(self.cart_string,function(pack_string){
                if(pack_string.id == data.pack.id){
                    self.setState({
                        addButtonLabel: 'Added',
                        ableToCart: false,
                    });
                }
            });
            if(cookie.get('user_id') && cookie.get('auth_token')){
                fetcher.getMyPacks(cookie.get('user_id'), cookie.get('auth_token'), function(userContent){
                    let mine = !(userContent.pack_ids.indexOf(parseInt(self.getParams().id)) === -1)
                    self.setState({
                        mine: mine,
                        taskLoadComplete: true,
                        title: data.pack.title,
                        intro: data.pack.intro,
                        materials: data.pack.materials,
                        tasks: data.pack.tasks,
                        id: data.pack.id,
                        materialLength: data.pack.materials.length,
                        taskLength: data.pack.length,
                        price: data.pack.price,
                        packType: 'pack_id',
                    });
                });
            }else{
                self.setState({
                    mine: false,
                    taskLoadComplete: true,
                    title: data.pack.title,
                    intro: data.pack.intro,
                    materials: data.pack.materials,
                    tasks: data.pack.tasks,
                    id: data.pack.id,
                    materialLength: data.pack.materials.length,
                    taskLength: data.pack.length,
                    price: data.pack.price,
                    packType: 'pack_id',
                });
            }

        });
    },
    back() {
        mixpanel.track("back", {
          'where': "pack inside",
        });
        this.goBack();
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
        let self = this;
        if (this.state.taskLoadComplete) {
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
                                            return <Content key={item.id} item={item} type="material" free={self.state.mine}/>
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
                                        {self.state.tasks.map(function (item) {
                                            if(self.state.packType == 'pack_item'){
                                                return <Content key={item.id} item={item.task} result_id={item.id} fulfilled={item.fulfilled} type="task" free={self.state.mine} />
                                            }else{
                                                return <Content key={item.id} item={item} type="task" buttonLabel="Go to My Pack" />
                                            }
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
                            this.state.mine
                            ?
                            <div>
                                <RaisedButton label="< Back" secondary={true} onClick={this.back} style={{width: '100%'}}/>
                            </div>
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
