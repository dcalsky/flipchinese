let React = require('react');

let Loader = React.createClass({
    render() {
        return (
            <section className="center-xs middle-xs" style={{margin: '10px 0 20px 0'}}>
            	<div className="plus-loader">
            		Loading...
            	</div>
            </section>
        );
    }
});

module.exports = Loader ;