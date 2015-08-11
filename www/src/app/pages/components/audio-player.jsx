let React = require('react/addons');

let AudioPlayer = React.createClass({
    render() {
        if (this.props.audio) {
            return (
                <div style={{padding:'12px', textAlign: 'center'}}>
                    <audio style={{width: '100%',maxWidth:'560px'}} controls="controls">
                        <source src={this.props.audio} type="audio/mpeg"/>
                    </audio>
                </div>
            );
        } else {
            return null;
        }
    }
});

module.exports = AudioPlayer;
