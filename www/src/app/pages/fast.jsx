'use strict';

let cookie = require('cookie-cutter');

let React = require('react/addons');
let Router = require('react-router');

let Select  = require('react-select');
let _ = require('underscore');

let checkStatus = require('../utils/check-status.js');

let Content = require('./components/content.jsx');
let Progress = require('./components/progress.jsx');
let LoadButton = require('./components/load-button.jsx');
let Error = require('./components/error.jsx');

let styles = {  
  load: {
    width: '100%',
    marginTop: 20
  }

};

let fetcher = {
  getMaterial(page,topic,level,title, callback) {
    fetch('http://api.flipchinese.com/api/v1/materials?page='+page+'&topic='+topic+'&level='+level+'&title='+title+'&free='+1)
      .then(checkStatus)
      .then(function (data) {
        console.log(data);
          callback(data)
      }).catch(function(error) {
          window.location.href = '#/main/connect-error';  
      });
  },
  getMaterialTopic(callback) {
    fetch('http://api.flipchinese.com/api/v1/materials/topics?free=1')
      .then(checkStatus)
      .then(function (data) {
          callback(data)
      }).catch(function(error) {
          window.location.href = '#/main/connect-error';
      });
  },

};

let Public = React.createClass({
  mixins: [Router.Navigation, React.addons.LinkedStateMixin],
  page_material: 1,
  topic_material: '',
  level_material: '',
  myMaterails: [],
  contextTypes() {
    router: React.PropTypes.func
  },
  getInitialState() {
    return {
      materials: [],
      materialTopics: [],
      loadShow: false,
      imageShow: false,
      materialLoadCompleted: false,
      key_material: '',
      isActive_topic: '',
      isActive_level: '',
    }
  },
  componentWillMount() {
    mixpanel.track("open", {
      'where': "fast",
    });
    this.getMaterial(1,'','','',true);
    this.getTopic();
  },
  getTopic(){
    mixpanel.track("get topic", {
      'where': "fast",
    });
    let self = this ;
    fetcher.getMaterialTopic(function(data){
      self.setState({
        materialTopics: _.map(data,function(topic){return({value: topic,label: topic})}),
      });
    });
  },
  searchMaterial() {
    let self = this;
    if (!this.state.key_material) {
      return
    }
    mixpanel.track("search material", {
      'where': "fast",
      'key': this.state.key_material,
    });
    this.topic_material = '';
    this.level_material = '';
    this.getMaterial(1,this.topic_material,this.level_material,this.state.key_material,true);
  },
  getMaterial(page,topic,level,title,initial){
    mixpanel.track("get Materiail", {
      'where': "fast",
    });
    let self = this ;
    if(initial){
      this.setState({materialLoadCompleted: false,materials: [], imageShow: false});
    }else{
      this.setState({materialLoadCompleted: false, imageShow: false});
    }
    fetcher.getMaterial(page,topic,level,title, function (data) {
      if(data.materials.length == 0){
        let _materials = initial ? [] : self.state.materials.concat(data.materials);
        self.setState({
          materials: _materials,
          materialLoadCompleted: true,
          loadShow: false,
          imageShow: initial,
        });
      }else if(data.materials.length < 6 && data.materials.length > 0){
        let _materials = initial ? data.materials : self.state.materials.concat(data.materials);
        _materials = self._filterMyMaterial(_materials);
        self.setState({
          materials: _materials,
          materialLoadCompleted: true,
          imageShow: false,
          loadShow: false,
        });
      }else{
        let _materials = initial ? data.materials : self.state.materials.concat(data.materials);
        _materials = self._filterMyMaterial(_materials);
        self.setState({
          materials: _materials,
          materialLoadCompleted: true,
          imageShow: false,
          loadShow: true,
        });
      }
    });
  },
  _loadMoreMaterials(){
    mixpanel.track("load more", {
      'where': "fast",
      'topic': this.state.topic_material,
      'level': this.state.level_material,
    });
    this.page_material = this.page_material + 1;
    this.getMaterial(this.page_material,this.topic_material,this.level_material,this.state.key_material,false);
  },
  _handleMaterialTopicChange(val){
    this.page_material = 1;
    if(val == 'all'){
      val = '';
    }
    this.setState({
      key_material: '',
      isActive_topic: val,
    });
    mixpanel.track("topic change", {
      'where': "fast",
      'topic': val,
    });
    this.topic_material = val;
    this.getMaterial(1,val,this.level_material,'',true);
  },
  _handleMaterialLevelChange(val){
    this.page_material = 1;
    if(val == 'all'){
      val = '';
    }
    this.setState({
      key_material: '',
      isActive_level: val,
    });
    mixpanel.track("topic change", {
      'where': "fast",
      'level': val,
    });
    this.level_material = val;
    this.getMaterial(1,this.topic_material,val,'',true);
  },
  _filterMyMaterial(materials){
    let self = this ;
    let _materials = materials;
    if(self.myMaterails == false){
      return materials;
    }
    _.map(_materials,function(material){
      _.map(self.myMaterails,function(myMaterail){
        if(myMaterail.id == material.id){
          material['isMine'] = true;
        }
      })
    });
    return _materials;
  },
  render() {
    let self = this;
      return (
        <div className="row">
          <section className="left-nav col-xs-12 col-sm-12 col-md-2">
          <ul className="center-xs">
              <li className="row center-xs middle-xs">
                <input 
                  type="text" 
                  className="col-xs-10 "
                  style={{marginLeft: 15, marginBottom: 10,height: 30, borderRadius:'5px', MozBorderRadius:'5px', WebkitBorderRadius:'5px', border:'1px solid #ccc'}}
                  placeholder="Key Word" 
                  ref="search"
                  valueLink={this.linkState('key_material')}
                />
              </li>
              <li style={{paddingBottom: 25, borderBottom: '1px solid #e5e5e5'}}>
                <button type="button" className="button-raised col-xs-12" onClick={this.searchMaterial}>Search</button>
              </li>
                <li className="start-xs">
                  <h3 style={{color: '#1976d2',fontSize: 20, marginTop: 10}}>Time in China</h3>
                </li>
                <li className="start-xs" onClick={function(){self._handleMaterialLevelChange('all')}}>
                  <h4 style={{color: this.state.isActive_level == '' ? "#ff3b77" : "#000"}}>All</h4>
                </li>
                <li className="start-xs" onClick={function(){self._handleMaterialLevelChange(12)}}>
                  <h4 style={{color: this.state.isActive_level == 12 ? "#ff3b77" : "#000"}}>Just Arrived</h4>
                </li>
                <li className="start-xs" onClick={function(){self._handleMaterialLevelChange(13)}} style={{paddingBottom: 10, borderBottom: '1px solid #e5e5e5'}}>
                  <h4 style={{color: this.state.isActive_level == 13 ? "#ff3b77" : "#000"}}>Stayed Months or Years</h4>
                </li>
                <li className="start-xs">
                  <h3 style={{color: '#1976d2',fontSize: 20, marginTop: 10}}>Issue to Solve</h3>
                </li>
                <li className="start-xs" onClick={function(){self._handleMaterialTopicChange('all')}}>
                  <h4 style={{color: this.state.isActive_topic == '' ? "#ff3b77" : "#000"}}>All</h4>
                </li>
                {this.state.materialTopics.map(function(topic){
                  return (
                    <li className="start-xs" onClick={function(){self._handleMaterialTopicChange(topic.value)}}>
                      <h4 style={{color: self.state.isActive_topic == topic.value ? "#ff3b77" : "#000"}}>{topic.label}</h4>
                    </li>
                  )
                })}
            </ul>
          </section>
          <section className="main col-xs-12 col-sm-12 col-md-9">
            <div>
              <h2>Fast</h2>
                <div className="card" style={{paddingTop: 30}}>
                  <ul className="content-list row center-xs" >
                      {this.state.materials.map(function (item) {
                        return <Content item={item} type="material" ableToEnter={true} />
                      })}
                  </ul>
                </div>
                <Error show={this.state.imageShow} desc="Did not find anything..." />
                <Progress completed={this.state.materialLoadCompleted} />
                <div style={{padding: '0 80px'}}>
                  <LoadButton style={styles.load} show={this.state.loadShow} type="material" onClick={this._loadMoreMaterials} disabled={!this.state.materialLoadCompleted} />
                </div>
              </div>
            </section>
       </div>
      );
  }
});

module.exports = Public;
