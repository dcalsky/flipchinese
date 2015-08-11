'use strict';

let React = require('react');
let Router = require('react-router');

let MenuItem = React.createClass({
	mixins: [Router.Navigation, Router.State],
	_turnTo(){
        mixpanel.track("use left nav", {
          'to': this.props.item.route,
        });
		this.props.onActive(this.props.item.route);
		this.transitionTo(this.props.item.route)
	},
	render(){
		//mixins router ==> this.isActive(); 
		switch(this.props.item.type){
			case 'link': 
				return(<li className={this.isActive(this.props.item.route) ? 'menu-item-link active':'menu-item-link'} onClick={this._turnTo}><p>{this.props.item.text}</p></li>)
				break;
			case 'text':
				return(<li className="menu-item-p"><p>{this.props.item.text}</p></li>)
				break;
			case 'line':
				return(<li className="menu-item-line"></li>)
				break;
			default:
				return null
		}
	}
});

let LeftNav = React.createClass({
	getInitialState() {
	    return {
	    	isActive: null,
	    };
	},
	_onActive(id){
		this.setState({
			isActive: id,
		});
	},
    render() {
    	let self = this;
        return (
            <div className="left-nav">
            	<ul className="start-xs">
            		{this.props.menuItems.map(function(item){
            			return(
            				<MenuItem item={item} onActive={self._onActive} />
            			)
            		})}
            	</ul>
            </div>
        );
    }
});

module.exports = LeftNav;