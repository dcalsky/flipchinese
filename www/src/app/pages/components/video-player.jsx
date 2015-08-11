let React = require('react/addons');

let VideoPlayer = React.createClass({
  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <video id="video-obj" width="100%" controls="controls" src={this.props.video}/>
      </div>
    )
  }
});

module.exports = VideoPlayer;


