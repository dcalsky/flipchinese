'use strict';

let mui = require('material-ui');
let React = require('react');
let {RaisedButton} = mui;

let LoadButton = React.createClass({
	render(){
		if(this.props.show){
			if(this.props.disabled){
				return(
					<RaisedButton 
						secondary={true} 
						onClick={this.props.onClick} 
						label="Loading..."
						disabled={true}
						style={this.props.style}
					/>
				)
			}else{
				return (
					<RaisedButton 
						secondary={true} 
						onClick={this.props.onClick} 
						label="Load More"
						disabled={false} 
						style={this.props.style}
					/>
				)
			}
		}else{
			return null;
		}
	}
});

module.exports = LoadButton ;