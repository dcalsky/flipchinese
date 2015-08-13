
let React = require('react');
let Router = require('react-router');

let Home = React.createClass({
	mixins: [Router.Navigation],
	_enterMaterial(id){
		this.transitionTo('/material/' + id);
		alert('123');
	},
    render() {
        return (
            <div>
            	Hello Mobile! Flip Chinese Mobile...
            </div>
        );
    }
});

module.exports = Home;