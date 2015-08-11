'use strict';

let cookie = require('cookie-cutter');

let React = require('react/addons');
let Router = require('react-router');

let mui = require('material-ui');
let { Tabs, Tab, TextField, RaisedButton} = mui;
let Select  = require('react-select');
let _ = require('underscore');

let checkStatus = require('../../utils/check-status.js');

let MainStyle = require('../styles/main-style.jsx');
let Content = require('../components/content.jsx');
let Progress = require('../components/progress.jsx');
let LoadButton = require('../components/load-button.jsx');
let Error = require('../components/error.jsx');

let styles = {  
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
  }

};

let fetcher = {
  getMaterial(page,topic,level,title, callback) {
    fetch('http://api.flipchinese.com/api/v1/materials?page='+page+'&topic='+topic+'&level='+level+'&title='+title)
      .then(checkStatus)
      .then(function (data) {
          callback(data)
      }).catch(function(error) {
          window.location.href = '#/main/connect-error';  
      });
  },
  getTask(page,topic,level,title, callback) {
    fetch('http://api.flipchinese.com/api/v1/tasks?page=' + page+'&topic='+topic+'&level='+level+'&title='+title)
      .then(checkStatus)
      .then(function (data) {
          callback(data)
      }).catch(function(error) {
          window.location.href = '#/main/connect-error';
      });
  },
  getTaskTopic(callback) {
    fetch('http://api.flipchinese.com/api/v1/tasks/topics')
      .then(checkStatus)
      .then(function (data) {
          callback(data)
      }).catch(function(error) {
          window.location.href = '#/main/connect-error';
      });
  },
  getMaterialTopic(callback) {
    fetch('http://api.flipchinese.com/api/v1/materials/topics')
      .then(checkStatus)
      .then(function (data) {
          callback(data)
      }).catch(function(error) {
          window.location.href = '#/main/connect-error';
      });
  },
  getMyPacks(id,user_id,auth_token,callback) {
    fetch('http://api.flipchinese.com/api/v1/users/'+id+'/pack_items?id='+id+'&user_id='+user_id+'&auth_token='+auth_token)
      .then(checkStatus)
      .then(function (data) {
          callback(data)
      }).catch(function(error) {
          callback({error: error})
      });
  },
};

let Public = React.createClass({
  mixins: [Router.Navigation, React.addons.LinkedStateMixin],
  page_material: 1,
  page_task: 1,
  topic_task: '',
  topic_material: '',
  level_task: '',
  level_material: '',
  myMaterails: [],
  myTasks: [],
  initialSelectedIndex: 0,
  contextTypes() {
    router: React.PropTypes.func
  },
  getInitialState() {
    return {
      materials: [],
      tasks: [],
      topics: [],
      levels: [],
      loadShow: false,
      imageShow: false,
      materialLoadCompleted: false,
      taskLoadCompleted: false,
      key_material: '',
      key_task: '',
    }
  },
  componentWillMount() {
    this.getMine();
    this.getTopic();
    this.getLevel();
  },
  getMine(){
    let self = this ;
    fetcher.getMyPacks(cookie.get('user_id'),cookie.get('user_id'),cookie.get('auth_token'),function(data){
      data.pack_items.map(function(pack_item){
        self.myMaterails = self.myMaterails.concat(pack_item.pack.materials);
        self.myTasks = self.myTasks.concat(pack_item.pack.tasks);
      });
      self.getMaterial(1,'','','',true);
      self.getTask(1,'','','',true);
    })
  },
  getTopic(){
    let self = this ;
    fetcher.getTaskTopic(function(data){
      self.setState({
        taskTopics: _.map(data,function(topic){return({value: topic,label: topic})}),
      });
    });
    fetcher.getMaterialTopic(function(data){
      self.setState({
        materialTopics: _.map(data,function(topic){return({value: topic,label: topic})}),
      });
    });
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
  searchMaterial() {
    let self = this;
    if (!this.state.key_material) {
      return
    }
    this.topic_material = '';
    this.level_material = '';
    this.getMaterial(1,this.topic_material,this.level_material,this.state.key_material,true);
  },
  searchTask() {
    let self = this;
    if (!this.state.key_task) {
      return
    }
    this.topic_task = '';
    this.level_task = '';    
    this.getMaterial(1,this.topic_task,this.level_task,this.state.key_task,true);
  },
  getMaterial(page,topic,level,title,initial){
    let self = this ;
    if(initial){
      this.setState({materialLoadCompleted: false,materials: []});
    }else{
      this.setState({materialLoadCompleted: false});
    }
    fetcher.getMaterial(page,topic,level,title, function (data) {
      if(data.materials.length == 0){
        let _materials = initial ? [] : self.state.materials.concat(data.materials);
        self.setState({
          materials: _materials,
          materialLoadCompleted: true,
          loadShow: false,
          imageShow: initial,
        })
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
  getTask(page,topic,level,title,initial){
    let self = this ;
    if(initial){
      this.setState({taskLoadCompleted: false,tasks: []});
    }else{
      this.setState({taskLoadCompleted: false});      
    }
    fetcher.getTask(page,topic,level,title,function (data) {
      if(data.tasks.length == 0){
        let _tasks = initial ? [] : self.state.tasks.concat(data.tasks);
        self.setState({
          tasks: _tasks,
          taskLoadCompleted: true,
          loadShow: false,
          imageShow: initial,
        })
      }else if(data.tasks.length < 6 && data.tasks.length > 0){
        let _tasks = initial ? data.tasks : self.state.tasks.concat(data.tasks);
        _tasks = self._filterMyTask(_tasks);
        self.setState({
          tasks: _tasks,
          taskLoadCompleted: true,
          imageShow: false,
          loadShow: false,
        });
      }else{
        let _tasks = initial ? data.tasks : self.state.tasks.concat(data.tasks);
        _tasks = self._filterMyTask(_tasks);
        self.setState({
          tasks: _tasks,
          taskLoadCompleted: true,
          imageShow: false,
          loadShow: true,
        });
      }
    });
  },
  _loadMoreMaterials(){
    this.getMaterial(++this.page_material,this.topic_material,this.level_material,this.state.key_material,false);
  },
  _loadMoreTasks(){
    this.getTask(++this.page_task,this.topic_task,this.level_task,this.state.key_task,false);
  },
  _handleMaterialTopicChange(val){
    this.page_material = 1 ;
    this.setState({key_material: ''});
    this.topic_material = val;
    this.getMaterial(1,val,this.level_material,'',true);
  },
  _handleMaterialLevelChange(val){
    this.page_material = 1 ;
    this.setState({key_material: ''});
    this.level_material = val;
    this.getMaterial(1,this.topic_material,val,'',true);
  },
  _handleTaskTopicChange(val){
    this.page_task = 1 ;
    this.setState({key_task: ''});
    this.topic_task = val;
    this.getTask(1,val,this.level_task,'',true);
  },
  _handleTaskLevelChange(val){
    this.page_task = 1 ;
    this.setState({key_task: ''});
    this.level_task = val;
    this.getTask(1,this.topic_task,val,'',true);
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
  _filterMyTask(tasks){
    let self = this ;
    let _tasks = tasks;
    if(self.myTasks == false){
      return tasks;
    }
    _.map(_tasks,function(task){
      _.map(self.myTasks,function(myTask){
        if(myTask.id == task.id){
          task['isMine'] = true;
        }
      })
    });
    return _tasks;
  },
  _tabChange(tabIndex, tab){
    this.initialSelectedIndex = tabIndex;
  },
  render() {
      return (
        <div>
          <h2 style={MainStyle.headline}>Content List</h2>
          <Tabs  onChange={this._tabChange} initialSelectedIndex={this.initialSelectedIndex}>
            <Tab label='Materials'>
              <div style={styles.filterBox}>
                <div style={styles.selectBox}>
                  <Select
                      placeholder="All Topics"
                      options={this.state.materialTopics}
                      value={this.topic_material}
                      onChange={this._handleMaterialTopicChange}
                      disabled={!this.state.materialLoadCompleted}
                  />
                </div>
                <div style={styles.selectBox}>
                  <Select
                      placeholder="All Level"
                      options={this.state.levels}
                      value={this.level_material}
                      onChange={this._handleMaterialLevelChange}
                      disabled={!this.state.materialLoadCompleted}
                      searchable={false}
                  />
                </div>
                <div style={styles.searchBox}>
                  <TextField
                    floatingLabelText="Key Word"
                    ref="search"
                    valueLink={this.linkState('key_material')}
                  />
                  <RaisedButton
                    type="button"
                    primary={true}
                    label="Search"
                    onClick={this.searchMaterial}
                  />
                </div>
              </div>
              <div>
                  {this.state.materials.map(function (item) {
                    return <Content item={item} type="material" />
                  })}
              </div>
            <Error show={this.state.imageShow} desc="Did not find anything..." />
            <Progress completed={this.state.materialLoadCompleted} />
            <LoadButton style={styles.load} show={this.state.loadShow} type="material" onClick={this._loadMoreMaterials} disabled={!this.state.materialLoadCompleted} />
            </Tab>
            <Tab label='Tasks'>
              <div style={styles.filterBox}>
                <div style={styles.selectBox}>
                  <Select
                      placeholder="All Topics"
                      options={this.state.taskTopics}
                      value={this.topic_task}
                      onChange={this._handleTaskTopicChange}
                      disabled={!this.state.taskLoadCompleted}
                  />
                </div>
                <div style={styles.selectBox}>
                  <Select
                      placeholder="All Level"
                      options={this.state.levels}
                      value={this.level_task}
                      onChange={this._handleTaskLevelChange}
                      disabled={!this.state.taskLoadCompleted}
                  />
                </div>
                <div style={styles.searchBox}>
                  <TextField
                    floatingLabelText="Key Word"
                    ref="search"
                    valueLink={this.linkState('key_task')}
                  />
                  <RaisedButton
                    type="button"
                    primary={true}
                    label="Search"
                    onClick={this.searchTask}
                  />
                </div>
              </div>
              <div>
                  {this.state.tasks.map(function (item) {
                    return <Content item={item} type="task" />
                  })}
              </div>
            <Error show={this.state.imageShow} desc="Did not find anything..." />
            <Progress completed={this.state.taskLoadCompleted} />
            <LoadButton style={styles.load} show={this.state.loadShow} onClick={this._loadMoreTasks}  type="task" disabled={!this.state.taskLoadCompleted} />
            </Tab>
          </Tabs>
        </div>
      );
  }
});

module.exports = Public;
