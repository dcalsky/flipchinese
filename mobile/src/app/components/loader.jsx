let React = require('react');

let Loader = React.createClass({
    render() {
        return (
            <section className="center-xs middle-xs">
            	<div className="plus-loader">
            		Loading...
            	</div>
            </section>
        );
    }
});

module.exports = Loader ;