'use strict';

let React = require('react');

let LoadButton = React.createClass({
	render(){
		if(this.props.show){
				return(
					<button 
						className="button-normal"
						onClick={this.props.onClick} 
						disabled={this.props.disabled}
						style={this.props.style ? this.props.style : {backgroundColor: '#1967d2'}}
					>{this.props.disabled ? "Loading..." : "Load More"}
					</button>
				)
		}else{
			return null;
		}
	}
});

module.exports = LoadButton ;