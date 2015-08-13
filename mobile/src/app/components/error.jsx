let React = require('react');

let Error = React.createClass({
	render(){
		return(
			<section className="error middle-xs center-xs">
				<h3 className="error-content">{this.props.content}</h3>
				<button className="button-flat" onClick={this.props.handleBack}> Back </button>
			</section>
		);
	}
});

module.exports = Error;