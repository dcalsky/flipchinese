let React = require('react');

let Tabs = React.createClass({
	displayName: 'Tabs',
    getInitialState() {
	    let selectedIndex = 0;
	    if (this.props.initialSelectedIndex && this.props.initialSelectedIndex < this._getTabCount()) {
	      selectedIndex = this.props.initialSelectedIndex;
	    }
	    return {
	      selectedIndex: selectedIndex
	    };
    },
    _getTabCount() {
	    return React.Children.count(this.props.children);
    },
    _handleTouchTap(tabIndex, tab) {
	    if (this.props.onChange && this.state.selectedIndex !== tabIndex) {
	      this.props.onChange(tabIndex, tab);
	    }
	    this.setState({ selectedIndex: tabIndex });
    },
    render(){
    	let self = this;
    	let tabContent = [];
	    let tabs = React.Children.map(this.props.children, function (tab, index) {
	    	if (tab.type == 'tab') {
		        tabContent.push(React.cloneElement(TabContent, {
		            key: index,
		            selected: self.state.selectedIndex === index,
		            style: tab.props.style
		        }, tab.props.children));
		        return React.createElement('div', {
			        key: index,
			        className: "tab col-xs",
			        selected: self.state.selectedIndex === index,
			        tabIndex: index,
		        },
		        	React.createElement('div',{
		        			className: self.state.selectedIndex === index ? 'tab-header row center-xs middle-xs active' : 'tab-header row center-xs middle-xs',
		        			tabIndex: index,
		        			handleTouchTap: self._handleTouchTap,
		        			onClick: function(){self._handleTouchTap(index)}
		        		},
		        		React.createElement('p',{},tab.props.title)
		        	),
		        );
    		}
	    }, this);
	    return(
			React.createElement(
	        	'div',
	        	{className: "tabs row"},
	        	tabs,
	        	tabContent
	      	)
	    );
	      
    }
});

let TabContent = React.createClass({
	render(){
		if(this.props.selected){
		    return React.createElement(
		      'div',
		      { className: "tabs-content", onTouchTap: this.handleTouchTap, style: this.props.style },
		      this.props.children
		    );
		}else{
			return null;
		}
	}
});
module.exports = Tabs ;