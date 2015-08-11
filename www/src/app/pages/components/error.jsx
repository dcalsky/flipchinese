'use strict';

let React = require('react');

let styles = {
	imageBox: {
		marginTop: 50,
		textAlign: 'center',
	},
	desc: {
		marginTop: 15,
	}
};

let Error = React.createClass({
	componentWillMount() {
        mixpanel.track("Error!");  
	},
    render () {
    	if(this.props.show){
	        return (
	            <div style={styles.imageBox}>
	            	<img src="./images/error.png" />
	            	<h2 style={styles.desc}>{this.props.desc}</h2>
	            </div>
	        );
    	}else{
    		return null;
    	}
    }
});

module.exports = Error;